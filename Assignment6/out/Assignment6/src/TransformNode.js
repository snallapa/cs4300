define(["require", "exports", "./SGNode", "gl-matrix", "%COMMON/Light"], function (require, exports, SGNode_1, gl_matrix_1, Light_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This node represents a transformation in the scene graph. It has only one child. The
     * transformation can be viewed as changing from its child's coordinate system to its parent's
     * coordinate system. This also stores an animation transform that can be tweaked at runtime
     * @author Amit Shesh
     */
    class TransformNode extends SGNode_1.SGNode {
        constructor(graph, name) {
            super(graph, name);
            this.transform = gl_matrix_1.mat4.create();
            this.animationTransform = gl_matrix_1.mat4.create();
            this.child = null;
        }
        /**
         * Creates a deep copy of the subtree rooted at this node
         * @return a deep copy of the subtree rooted at this node
         */
        clone() {
            let newchild;
            if (this.child != null) {
                newchild = this.child.clone();
            }
            else {
                newchild = null;
            }
            let newtransform = new TransformNode(this.scenegraph, this.name);
            newtransform.setTransform(this.transform);
            newtransform.setAnimationTransform(this.animationTransform);
            if (newchild != null) {
                try {
                    newtransform.addChild(newchild);
                }
                catch (e) { }
            }
            return newtransform;
        }
        /**
         * Determines if this node has the specified name and returns itself if so. Otherwise it recurses
         * into its only child
         * @param name name of node to be searched
         * @return
         */
        getNode(name) {
            let n = super.getNode(name);
            if (n != null)
                return n;
            if (this.child != null) {
                return this.child.getNode(name);
            }
            return null;
        }
        /**
         * Since this node can have a child, it override this method and adds the child to itself
         * This will overwrite any children set for this node previously.
         * @param child the child of this node
         * @throws IllegalArgumentException this method does not throw this exception
         */
        addChild(child) {
            if (this.child != null)
                throw new Error("Transform node already has a child");
            this.child = child;
            this.child.setParent(this);
        }
        /**
         * Draws the scene graph rooted at this node
         * After preserving the current top of the modelview stack, this "post-multiplies" its
         * animation transform and then its transform in that order to the top of the model view
         * stack, and then recurses to its child. When the child is drawn, it restores the modelview
         * matrix
         * @param context the generic renderer context {@link sgraph.IScenegraphRenderer}
         * @param modelView the stack of modelview matrices
         */
        draw(context, modelView) {
            modelView.push(gl_matrix_1.mat4.clone(modelView.peek()));
            gl_matrix_1.mat4.multiply(modelView.peek(), modelView.peek(), this.animationTransform);
            gl_matrix_1.mat4.multiply(modelView.peek(), modelView.peek(), this.transform);
            if (this.child != null)
                this.child.draw(context, modelView);
            modelView.pop();
        }
        getLights(modelView) {
            modelView.push(gl_matrix_1.mat4.clone(modelView.peek()));
            gl_matrix_1.mat4.multiply(modelView.peek(), modelView.peek(), this.animationTransform);
            gl_matrix_1.mat4.multiply(modelView.peek(), modelView.peek(), this.transform);
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
            if (this.child != null) {
                transformedLights = transformedLights.concat(this.child.getLights(modelView));
            }
            modelView.pop();
            return transformedLights;
        }
        /**
         * Sets the animation transform of this node
         * @param mat the animation transform of this node
         */
        setAnimationTransform(mat) {
            this.animationTransform = mat;
        }
        /**
         * Gets the transform at this node (not the animation transform)
         * @return
         */
        getTransform() {
            return this.transform;
        }
        /**
         * Sets the transformation of this node
         * @param t
         * @throws IllegalArgumentException
         */
        setTransform(t) {
            this.transform = gl_matrix_1.mat4.clone(t);
        }
        /**
         * Gets the animation transform of this node
         * @return
         */
        getAnimationTransform() {
            return this.animationTransform;
        }
        /**
         * Sets the scene graph object of which this node is a part, and then recurses to its child
         * @param graph a reference to the scenegraph object of which this tree is a part
         */
        setScenegraph(graph) {
            super.setScenegraph(graph);
            if (this.child != null) {
                this.child.setScenegraph(graph);
            }
        }
        getNumberLights() {
            return this.lights.length + this.child.getNumberLights();
        }
    }
    exports.TransformNode = TransformNode;
});
//# sourceMappingURL=TransformNode.js.map