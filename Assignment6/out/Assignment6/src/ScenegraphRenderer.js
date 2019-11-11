define(["require", "exports", "%COMMON/RenderableMesh", "gl-matrix", "%COMMON/Material", "%COMMON/TextureObject"], function (require, exports, RenderableMesh_1, gl_matrix_1, Material_1, TextureObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This is a scene graph renderer implementation that works specifically with WebGL.
     * @author Amit Shesh
     */
    class ScenegraphRenderer {
        constructor(gl, shaderLocations, shaderVarsToAttribs) {
            this.gl = gl;
            this.shaderVarsToVertexAttribs = shaderVarsToAttribs;
            this.meshRenderers = new Map();
            this.shaderLocations = shaderLocations;
            this.keyframeBuffers = new Map();
            this.textures = new Map();
        }
        /**
         * Add a mesh to be drawn later.
         * The rendering context should be set before calling this function, as this function needs it
         * This function creates a new
         * {@link RenderableMesh} object for this mesh
         * @param name the name by which this mesh is referred to by the scene graph
         * @param mesh the {@link PolygonMesh} object that represents this mesh
         * @throws Exception
         */
        addMesh(meshName, mesh) {
            if (meshName in this.meshRenderers)
                return;
            //verify that the mesh has all the vertex attributes as specified in the map
            if (mesh.getVertexCount() <= 0)
                return;
            let vertexData = mesh.getVertexAttributes()[0];
            for (let [s, a] of this.shaderVarsToVertexAttribs) {
                if (!vertexData.hasData(a))
                    throw new Error("Mesh does not have vertex attribute " + a);
            }
            let renderableMesh = new RenderableMesh_1.RenderableMesh(this.gl, name);
            renderableMesh.initMeshForRendering(this.shaderVarsToVertexAttribs, mesh);
            this.meshRenderers.set(meshName, renderableMesh);
        }
        addTexture(name, path) {
            const texture = new TextureObject_1.TextureObject(this.gl, name, path);
            this.textures.set(name, texture.getTextureID());
        }
        /**
         * Begin rendering of the scene graph from the root
         * @param root
         * @param modelView
         */
        draw(root, modelView) {
            root.draw(this, modelView);
        }
        dispose() {
            for (let mesh of this.meshRenderers.values()) {
                mesh.cleanup();
            }
        }
        /**
         * Draws a specific mesh.
         * If the mesh has been added to this renderer, it delegates to its correspond mesh renderer
         * This function first passes the material to the shader. Currently it uses the shader variable
         * "vColor" and passes it the ambient part of the material. When lighting is enabled, this
         * method must be overriden to set the ambient, diffuse, specular, shininess etc. values to the
         * shader
         * @param name
         * @param material
         * @param transformation
         */
        drawMesh(meshName, material, textureName, transformation) {
            if (this.meshRenderers.has(meshName)) {
                //get the color
                let loc = this.shaderLocations.getUniformLocation("modelview");
                this.gl.uniformMatrix4fv(loc, false, transformation);
                let normalMatrix = gl_matrix_1.mat4.clone(transformation);
                gl_matrix_1.mat4.transpose(normalMatrix, normalMatrix);
                gl_matrix_1.mat4.invert(normalMatrix, normalMatrix);
                this.gl.uniformMatrix4fv(this.shaderLocations.getUniformLocation("normalmatrix"), false, normalMatrix);
                this.gl.uniform3fv(this.shaderLocations.getUniformLocation("material.diffuse"), material.getDiffuse());
                this.gl.uniform3fv(this.shaderLocations.getUniformLocation("material.ambient"), material.getAmbient());
                this.gl.uniform3fv(this.shaderLocations.getUniformLocation("material.specular"), material.getSpecular());
                this.gl.uniform1f(this.shaderLocations.getUniformLocation("material.shininess"), material.getShininess());
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.get(textureName));
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
                // Prevents t-coordinate wrapping (repeating).
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
                this.meshRenderers.get(meshName).draw(this.shaderLocations);
            }
        }
        bufferKeyframes(keyframe, vertices) {
            const vbo = this.gl.createBuffer();
            const points = [];
            vertices.forEach(v => {
                points.push(v[0]);
                points.push(v[1]);
                points.push(v[2]);
            });
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), this.gl.STATIC_DRAW);
            this.keyframeBuffers.set(keyframe, vbo);
        }
        drawKeyframe(keyframe, vertices, transform) {
            const material = new Material_1.Material();
            material.setAmbient([1.0, 1.0, 0]);
            material.setDiffuse([0, 0, 0]);
            material.setSpecular([0, 0, 0]);
            material.setShininess(1);
            this.gl.uniform3fv(this.shaderLocations.getUniformLocation("material.ambient"), material.getAmbient());
            this.gl.uniform3fv(this.shaderLocations.getUniformLocation("material.specular"), material.getSpecular());
            this.gl.uniform1f(this.shaderLocations.getUniformLocation("material.shininess"), material.getShininess());
            let loc = this.shaderLocations.getUniformLocation("modelview");
            this.gl.uniformMatrix4fv(loc, false, transform);
            if (!this.keyframeBuffers.has(keyframe)) {
                this.bufferKeyframes(keyframe, vertices);
            }
            const vbo = this.keyframeBuffers.get(keyframe);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
            const positionLocation = this.shaderLocations.getAttribLocation("vPosition");
            //tell webgl that the position attribute can be found as 2-floats-per-vertex with a gap of 20 bytes
            //(2 floats per position, 3 floats per color = 5 floats = 20 bytes
            this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);
            const normal = this.shaderLocations.getAttribLocation("vNormal");
            //tell webgl that the position attribute can be found as 2-floats-per-vertex with a gap of 20 bytes
            //(2 floats per position, 3 floats per color = 5 floats = 20 bytes
            this.gl.vertexAttribPointer(normal, 3, this.gl.FLOAT, false, 0, 0);
            //tell webgl to enable this vertex attribute array, so that when it draws it will use this
            this.gl.enableVertexAttribArray(positionLocation);
            this.gl.enableVertexAttribArray(normal);
            this.gl.drawArrays(this.gl.LINE_LOOP, 0, vertices.length);
        }
    }
    exports.ScenegraphRenderer = ScenegraphRenderer;
});
//# sourceMappingURL=ScenegraphRenderer.js.map