define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A specific implementation of this scene graph. This implementation is still independent
     * of the rendering technology (i.e. WebGL)
     * @author Amit Shesh
     */
    class Scenegraph {
        constructor() {
            this.root = null;
            this.meshes = new Map();
            this.nodes = new Map();
            this.textures = new Map();
        }
        dispose() {
            this.renderer.dispose();
        }
        /**
         * Sets the renderer, and then adds all the meshes to the renderer.
         * This function must be called when the scene graph is complete, otherwise not all of its
         * meshes will be known to the renderer
         * @param renderer The {@link ScenegraphRenderer} object that will act as its renderer
         * @throws Exception
         */
        setRenderer(renderer) {
            this.renderer = renderer;
            //now add all the meshes
            for (let [meshName, mesh] of this.meshes) {
                this.renderer.addMesh(meshName, mesh);
            }
        }
        /**
         * Set the root of the scenegraph, and then pass a reference to this scene graph object
         * to all its node. This will enable any node to call functions of its associated scene graph
         * @param root
         */
        makeScenegraph(root) {
            this.root = root;
            this.root.setScenegraph(this);
        }
        /**
         * Draw this scene graph. It delegates this operation to the renderer
         * @param modelView
         */
        draw(modelView) {
            if (this.root != null && this.renderer != null) {
                this.renderer.draw(this.root, modelView);
            }
        }
        addPolygonMesh(meshName, mesh) {
            this.meshes.set(meshName, mesh);
        }
        animate(time) { }
        addNode(nodeName, node) {
            this.nodes.set(nodeName, node);
        }
        getRoot() {
            return this.root;
        }
        getLights(modelView) {
            return this.root.getLights(modelView);
        }
        getNumberLight() {
            return this.root.getNumberLights();
        }
        getPolygonMeshes() {
            return this.meshes;
        }
        getNodes() {
            return this.nodes;
        }
        addTexture(textureName, path) {
            this.textures.set(textureName, path);
        }
        getTextures() {
            return this.textures;
        }
    }
    exports.Scenegraph = Scenegraph;
});
//# sourceMappingURL=Scenegraph.js.map