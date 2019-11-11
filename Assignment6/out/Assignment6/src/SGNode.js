define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This class represents a basic node of a scene graph.
     */
    class SGNode {
        constructor(graph, name) {
            this.parent = null;
            this.scenegraph = graph;
            this.setName(name);
        }
        /**
         * By default, this method checks only itself. Nodes that have children should override this
         * method and navigate to children to find the one with the correct name
         * @param name name of node to be searched
         * @return the node whose name this is, null otherwise
         */
        getNode(name) {
            if (this.name == name) {
                return this;
            }
            return null;
        }
        /**
         * Sets the parent of this node
         * @param parent the node that is to be the parent of this node
         */
        setParent(parent) {
            this.parent = parent;
        }
        /**
         * Sets the scene graph object whose part this node is and then adds itself
         * to the scenegraph (in case the scene graph ever needs to directly access this node)
         * @param graph a reference to the scenegraph object of which this tree is a part
         */
        setScenegraph(graph) {
            this.scenegraph = graph;
            graph.addNode(this.name, this);
        }
        /**
         * Sets the name of this node
         * @param name the name of this node
         */
        setName(name) {
            this.name = name;
        }
        /**
         * Gets the name of this node
         * @return the name of this node
         */
        getName() {
            return this.name;
        }
        setLights(lights) {
            this.lights = lights;
        }
        setTransform(transform) {
            throw new Error("Not supported");
        }
        setAnimationTransform(transform) {
            throw new Error("Not supported");
        }
        setMaterial(mat) {
            throw new Error("Not supported");
        }
        getMaterial() {
            throw new Error("Not supported");
        }
    }
    exports.SGNode = SGNode;
});
//# sourceMappingURL=SGNode.js.map