define(["require", "exports", "./Scenegraph", "./GroupNode", "%COMMON/ObjImporter", "./TransformNode", "gl-matrix", "./LeafNode", "%COMMON/Material", "./KeyframeNode", "%COMMON/Light"], function (require, exports, Scenegraph_1, GroupNode_1, ObjImporter_1, TransformNode_1, gl_matrix_1, LeafNode_1, Material_1, KeyframeNode_1, Light_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScenegraphJSONImporter;
    (function (ScenegraphJSONImporter) {
        /**
         * This function parses a scenegraph specified in JSON format, and produces a scene graph
         * @param producer the vertex producer to load all the meshes used in the scene graph
         * @param contents the JSON string
         * @return a promise of a scene graph. The caller waits for the promise
         */
        function importJSON(producer, contents) {
            return new Promise((resolve, reject) => {
                let jsonTree = JSON.parse(contents);
                let scenegraph = new Scenegraph_1.Scenegraph();
                let root;
                let scaleInstances = true;
                if (!("instances" in jsonTree)) {
                    throw new Error("No meshes in the scene graph!");
                }
                if ("scaleinstances" in jsonTree) {
                    if (jsonTree["scaleinstances"] == "false")
                        scaleInstances = false;
                }
                handleImages(scenegraph, jsonTree);
                handleInstances(scenegraph, jsonTree["instances"], scaleInstances, producer).then((scenegraph) => {
                    if (!("root" in jsonTree)) {
                        throw new Error("No root in the scene graph!");
                    }
                    root = handleNode(scenegraph, jsonTree["root"]);
                    scenegraph.makeScenegraph(root);
                    resolve(scenegraph);
                });
            });
        }
        ScenegraphJSONImporter.importJSON = importJSON;
        function handleLights(obj) {
            const result = [];
            if ("lights" in obj) {
                const lightsObj = obj["lights"];
                for (let light of lightsObj) {
                    const l = new Light_1.Light();
                    l.setAmbient(light["ambient"]);
                    l.setDiffuse(light["diffuse"]);
                    l.setSpecular(light["specular"]);
                    l.setPosition(light["position"]);
                    if ("spotdirection" in light) {
                        l.setSpotDirection(light["spotdirection"]);
                        l.setSpotAngle(light["spotcutoff"]);
                    }
                    else {
                        l.setSpotDirection([1, 0, 0]);
                        l.setSpotAngle(360);
                    }
                    result.push(l);
                }
            }
            return result;
        }
        function handleNode(scenegraph, obj) {
            let result = null;
            if (!("type" in obj)) {
                throw new Error("No type of node!");
            }
            if ("name" in obj) {
                console.log("Processing: " + obj["name"]);
            }
            switch (obj["type"]) {
                case "transform":
                    result = handleTransformNode(scenegraph, obj);
                    break;
                case "keyframe":
                    result = handleKeyframeNode(scenegraph, obj);
                    break;
                case "group":
                    result = handleGroupNode(scenegraph, obj);
                    break;
                case "object":
                    result = handleLeafNode(scenegraph, obj);
                    break;
                default:
                    throw new Error("Unknown node type");
            }
            result.setLights(handleLights(obj));
            return result;
        }
        ScenegraphJSONImporter.handleNode = handleNode;
        function handleTransformNode(scenegraph, obj) {
            let result;
            let nodeName = "t";
            let transform = gl_matrix_1.mat4.create();
            if ("name" in obj) {
                nodeName = obj["name"];
            }
            result = new TransformNode_1.TransformNode(scenegraph, nodeName);
            if (!("child" in obj)) {
                throw new Error("No child for a transform node");
            }
            if (!("transform" in obj)) {
                throw new Error("No transform property for a transform node");
            }
            for (let op of Object(obj["transform"])) {
                if ("translate" in op) {
                    let values = convertToArray(op["translate"]);
                    if (values.length != 3) {
                        throw new Error("3 values needed for translate");
                    }
                    let translateBy = gl_matrix_1.vec3.fromValues(values[0], values[1], values[2]);
                    gl_matrix_1.mat4.translate(transform, transform, translateBy);
                }
                else if ("scale" in op) {
                    let values = convertToArray(op["scale"]);
                    if (values.length != 3) {
                        throw new Error("3 values needed for scale");
                    }
                    let scaleBy = gl_matrix_1.vec3.fromValues(values[0], values[1], values[2]);
                    gl_matrix_1.mat4.scale(transform, transform, scaleBy);
                }
                else if ("rotate" in op) {
                    let values = convertToArray(op["rotate"]);
                    if (values.length != 4) {
                        throw new Error("4 values needed for rotate");
                    }
                    let rotateAngle = values[0];
                    let rotateAxis = gl_matrix_1.vec3.fromValues(values[1], values[2], values[3]);
                    gl_matrix_1.mat4.rotate(transform, transform, gl_matrix_1.glMatrix.toRadian(rotateAngle), rotateAxis);
                }
            }
            result.addChild(handleNode(scenegraph, obj["child"]));
            result.setTransform(transform);
            return result;
        }
        ScenegraphJSONImporter.handleTransformNode = handleTransformNode;
        function handleKeyframeNode(scenegraph, obj) {
            let result;
            let nodeName = "t";
            let transform = gl_matrix_1.mat4.create();
            if ("name" in obj) {
                nodeName = obj["name"];
            }
            result = new KeyframeNode_1.KeyframeNode(scenegraph, nodeName);
            if (!("child" in obj)) {
                throw new Error("No child for a transform node");
            }
            if (!("transform" in obj)) {
                throw new Error("No transform property for a transform node");
            }
            for (let op of Object(obj["transform"])) {
                if ("translate" in op) {
                    let values = convertToArray(op["translate"]);
                    if (values.length != 3) {
                        throw new Error("3 values needed for translate");
                    }
                    let translateBy = gl_matrix_1.vec3.fromValues(values[0], values[1], values[2]);
                    gl_matrix_1.mat4.translate(transform, transform, translateBy);
                }
                else if ("scale" in op) {
                    let values = convertToArray(op["scale"]);
                    if (values.length != 3) {
                        throw new Error("3 values needed for scale");
                    }
                    let scaleBy = gl_matrix_1.vec3.fromValues(values[0], values[1], values[2]);
                    gl_matrix_1.mat4.scale(transform, transform, scaleBy);
                }
                else if ("rotate" in op) {
                    let values = convertToArray(op["rotate"]);
                    if (values.length != 4) {
                        throw new Error("4 values needed for rotate");
                    }
                    let rotateAngle = values[0];
                    let rotateAxis = gl_matrix_1.vec3.fromValues(values[1], values[2], values[3]);
                    gl_matrix_1.mat4.rotate(transform, transform, gl_matrix_1.glMatrix.toRadian(rotateAngle), rotateAxis);
                }
            }
            result.addChild(handleNode(scenegraph, obj["child"]));
            result.setTransform(transform);
            result.setKeyFrames(obj["keyframes"]);
            return result;
        }
        ScenegraphJSONImporter.handleKeyframeNode = handleKeyframeNode;
        function convertToArray(obj) {
            let result = [];
            for (let n in obj) {
                result.push(parseFloat(obj[n]));
            }
            return result;
        }
        ScenegraphJSONImporter.convertToArray = convertToArray;
        function handleGroupNode(scenegraph, obj) {
            let result;
            let nodeName = "g";
            if ("name" in obj) {
                nodeName = obj["name"];
            }
            result = new GroupNode_1.GroupNode(scenegraph, nodeName);
            for (let child of obj["children"]) {
                let node = handleNode(scenegraph, child);
                result.addChild(node);
            }
            return result;
        }
        ScenegraphJSONImporter.handleGroupNode = handleGroupNode;
        function handleLeafNode(scenegraph, obj) {
            let result;
            let nodeName = "g";
            if ("name" in obj) {
                nodeName = obj["name"];
            }
            let material = new Material_1.Material(); //all black by default
            result = new LeafNode_1.LeafNode(obj["instanceof"], scenegraph, nodeName);
            if ("material" in obj) {
                if ("color" in obj["material"]) {
                    material.setAmbient([
                        obj["material"]["color"][0],
                        obj["material"]["color"][1],
                        obj["material"]["color"][2]
                    ]);
                }
                else {
                    material.setAmbient([
                        obj["material"]["ambient"][0],
                        obj["material"]["ambient"][1],
                        obj["material"]["ambient"][2]
                    ]);
                    material.setDiffuse([
                        obj["material"]["diffuse"][0],
                        obj["material"]["diffuse"][1],
                        obj["material"]["diffuse"][2]
                    ]);
                    material.setSpecular([
                        obj["material"]["specular"][0],
                        obj["material"]["specular"][1],
                        obj["material"]["specular"][2]
                    ]);
                    material.setShininess(obj["material"]["shininess"]);
                }
                result.setMaterial(material);
            }
            if ("texture" in obj) {
                result.setTextureName(obj["texture"]);
            }
            else {
                result.setTextureName("white");
            }
            return result;
        }
        ScenegraphJSONImporter.handleLeafNode = handleLeafNode;
        function handleInstances(scenegraph, obj, scaleAndCenter, producer) {
            return new Promise(resolve => {
                let nameUrls = new Map();
                for (let n of Object.keys(obj)) {
                    let path = obj[n]["path"];
                    nameUrls.set(obj[n]["name"], path);
                }
                //import them
                ObjImporter_1.ObjImporter.batchDownloadMesh(nameUrls, producer, scaleAndCenter).then((meshMap) => {
                    for (let [n, mesh] of meshMap) {
                        scenegraph.addPolygonMesh(n, mesh);
                    }
                    resolve(scenegraph);
                });
            });
        }
        ScenegraphJSONImporter.handleInstances = handleInstances;
        function handleImages(scenegraph, obj) {
            if ("images" in obj) {
                const images = obj["images"];
                images.forEach(image => scenegraph.addTexture(image["name"], image["path"]));
            }
            scenegraph.addTexture("white", "textures/white.png");
        }
        ScenegraphJSONImporter.handleImages = handleImages;
    })(ScenegraphJSONImporter = exports.ScenegraphJSONImporter || (exports.ScenegraphJSONImporter = {}));
});
//# sourceMappingURL=ScenegraphJSONImporter.js.map