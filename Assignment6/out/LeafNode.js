define(["require", "exports", "./SGNode", "gl-matrix", "%COMMON/Light"], function (require, exports, SGNode_1, gl_matrix_1, Light_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This node represents the leaf of a scene graph. It is the only type of node that has
     * actual geometry to render.
     * @author Amit Shesh
     */
    class LeafNode extends SGNode_1.SGNode {
        constructor(instanceOf, graph, name) {
            super(graph, name);
            this.meshName = instanceOf;
        }
        /*
         *Set the material of each vertex in this object
         */
        setMaterial(mat) {
            this.material = mat;
        }
        /**
         * Set texture ID of the texture to be used for this leaf
         * @param name
         */
        setTextureName(name) {
            this.textureName = name;
        }
        /*
         * gets the material
         */
        getMaterial() {
            return this.material;
        }
        clone() {
            let newclone = new LeafNode(this.meshName, this.scenegraph, this.name);
            newclone.setMaterial(this.getMaterial());
            return newclone;
        }
        /**
         * Delegates to the scene graph for rendering. This has two advantages:
         * <ul>
         *     <li>It keeps the leaf light.</li>
         *     <li>It abstracts the actual drawing to the specific implementation of the scene graph renderer</li>
         * </ul>
         * @param context the generic renderer context {@link sgraph.IScenegraphRenderer}
         * @param modelView the stack of modelview matrices
         * @throws IllegalArgumentException
         */
        draw(context, modelView) {
            if (this.meshName.length > 0) {
                context.drawMesh(this.meshName, this.material, this.textureName, modelView.peek());
            }
        }
        getLights(modelView) {
            const transformedLights = this.lights.map(light => {
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
            return transformedLights;
        }
        getNumberLights() {
            return this.lights.length;
        }
    }
    exports.LeafNode = LeafNode;
});
//# sourceMappingURL=LeafNode.js.map