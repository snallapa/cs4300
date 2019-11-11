define(["require", "exports", "./SGNode", "gl-matrix", "%COMMON/Light"], function (require, exports, SGNode_1, gl_matrix_1, Light_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This class represents a group node in the scenegraph. A group node is simply a logical grouping
     * of other nodes. It can have an arbitrary number of children. Its children can be nodes of any type
     * @author Amit Shesh
     */
    class GroupNode extends SGNode_1.SGNode {
        constructor(graph, name) {
            super(graph, name);
            this.children = [];
        }
        /**
         * Searches recursively into its subtree to look for node with specified name.
         * @param name name of node to be searched
         * @return the node whose name this is if it exists within this subtree, null otherwise
         */
        getNode(name) {
            let n = super.getNode(name);
            if (n != null) {
                return n;
            }
            let i = 0;
            let answer = null;
            while (i < this.children.length && answer == null) {
                answer = this.children[i].getNode(name);
                i++;
            }
            return answer;
        }
        /**
         * Sets the reference to the scene graph object for this node, and then recurses down
         * to children for the same
         * @param graph a reference to the scenegraph object of which this tree is a part
         */
        setScenegraph(graph) {
            super.setScenegraph(graph);
            this.children.forEach(child => child.setScenegraph(graph));
        }
        /**
         * To draw this node, it simply delegates to all its children
         * @param context the generic renderer context {@link ScenegraphRenderer}
         * @param modelView the stack of modelview matrices
         */
        draw(context, modelView) {
            this.children.forEach(child => child.draw(context, modelView));
        }
        getLights(modelView) {
            let transformedLights = this.lights.map(light => {
                const newPosition = gl_matrix_1.vec4.transformMat4(gl_matrix_1.vec4.create(), light.getPosition(), modelView.peek());
                const newDirection = gl_matrix_1.vec4.transformMat4(gl_matrix_1.vec4.create(), light.getSpotDirection(), modelView.peek());
                const l = new Light_1.Light();
                l.setAmbient(light.getAmbient());
                l.setDiffuse(light.getDiffuse());
                l.setSpecular(light.getSpecular());
                l.setSpotAngle(light.getSpotCutoff());
                l.setPosition([newPosition[0], newPosition[1], newPosition[2]]);
                l.setSpotDirection([newDirection[0], newDirection[1], newDirection[2]]);
                return l;
            });
            this.children.forEach(child => {
                transformedLights = transformedLights.concat(child.getLights(modelView));
            });
            return transformedLights;
        }
        /**
         * Makes a deep copy of the subtree rooted at this node
         * @return a deep copy of the subtree rooted at this node
         */
        clone() {
            let newc = [];
            this.children.forEach(child => newc.push(child.clone()));
            let newgroup = new GroupNode(this.scenegraph, name);
            this.children.forEach(child => newgroup.addChild(child));
            return newgroup;
        }
        /**
         * Since a group node is capable of having children, this method overrides the default one
         * in {@link sgraph.AbstractNode} and adds a child to this node
         * @param child
         * @throws IllegalArgumentException this class does not throw this exception
         */
        addChild(child) {
            this.children.push(child);
            child.setParent(this);
        }
        /**
         * Get a list of all its children, for convenience purposes
         * @return a list of all its children
         */
        getChildren() {
            return this.children;
        }
        getNumberLights() {
            return (this.lights.length +
                this.children.map(c => c.getNumberLights()).reduce((a, b) => a + b, 0));
        }
    }
    exports.GroupNode = GroupNode;
});
//# sourceMappingURL=GroupNode.js.map