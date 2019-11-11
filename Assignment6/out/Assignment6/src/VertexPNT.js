define(["require", "exports", "gl-matrix"], function (require, exports, gl_matrix_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * This class represents the attributes of a single vertex, when the position, normal and texture
     * coordinate of the vertex is known. It is useful in building PolygonMesh objects for many
     * examples.
     *
     * It implements the IVertexData interface so that it can be converted into an
     * array of floats, to work with WebGL buffers
     */
    class VertexPNT {
        constructor() {
            this.position = gl_matrix_1.vec4.fromValues(0, 0, 0, 1);
            this.texcoord = gl_matrix_1.vec4.fromValues(0, 0, 0, 1);
        }
        hasData(attribName) {
            switch (attribName) {
                case "position":
                case "normal":
                case "texcoord":
                    return true;
                default:
                    return false;
            }
        }
        getData(attribName) {
            let result;
            switch (attribName) {
                case "position":
                    result = [this.position[0], this.position[1], this.position[2], this.position[3]];
                    break;
                case "normal":
                    result = [this.normal[0], this.normal[1], this.normal[2], this.normal[3]];
                    break;
                case "texcoord":
                    result = [this.texcoord[0], this.texcoord[1]];
                    break;
                default:
                    throw new Error("No attribute: " + attribName + " found!");
            }
            return result;
        }
        setData(attribName, data) {
            switch (attribName) {
                case "position":
                    this.position = gl_matrix_1.vec4.fromValues(0, 0, 0, 1);
                    for (let i = 0; i < data.length; i++) {
                        this.position[i] = data[i];
                    }
                    break;
                case "normal":
                    this.normal = gl_matrix_1.vec4.fromValues(0, 0, 0, 0);
                    for (let i = 0; i < data.length; i++) {
                        this.normal[i] = data[i];
                    }
                    break;
                case "texcoord":
                    this.texcoord = gl_matrix_1.vec4.fromValues(0, 0, 0, 1);
                    for (let i = 0; i < data.length; i++) {
                        this.texcoord[i] = data[i];
                    }
                    break;
                default:
                    throw new Error("Attribute: " + attribName + " unsupported!");
            }
        }
        getAllAttributes() {
            return ["position", "color", "texcoord"];
        }
    }
    exports.VertexPNT = VertexPNT;
    class VertexPNTProducer {
        produce() {
            return new VertexPNT();
        }
    }
    exports.VertexPNTProducer = VertexPNTProducer;
});
//# sourceMappingURL=VertexPNT.js.map