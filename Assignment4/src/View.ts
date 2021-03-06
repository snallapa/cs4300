import { vec4, mat4, vec3, glMatrix, mat3 } from "gl-matrix";
import * as WebGLUtils from "%COMMON/WebGLUtils";
import { Features } from "./Controller";
import { Stack } from "%COMMON/Stack";
import { Scenegraph } from "./Scenegraph";
import { VertexPNT, VertexPNTProducer } from "./VertexPNT";
import { ShaderLocationsVault } from "%COMMON/ShaderLocationsVault";
import { ScenegraphRenderer } from "./ScenegraphRenderer";
import { Mesh } from "%COMMON/PolygonMesh";
import { ObjImporter } from "%COMMON/ObjImporter";
import { ScenegraphJSONImporter } from "./ScenegraphJSONImporter";
import { LeafNode } from "./LeafNode";
import { TransformNode } from "./TransformNode";
import { KeyframeNode } from "KeyframeNode";
import { Material } from "%COMMON/Material";
import { GroupNode } from "./GroupNode";

/**
 * This class encapsulates the "view", where all of our WebGL code resides. This class, for now, also stores all the relevant data that is used to draw. This can be replaced with a more formal Model-View-Controller architecture with a bigger application.
 */
enum CameraMode {
  Rotate,
  Overhead,
  Front,
  Cockpit
}
export class View {
  //the webgl rendering context. All WebGL functions will be called on this object
  private gl: WebGLRenderingContext;
  //an object that represents a WebGL shader
  private shaderProgram: WebGLProgram;

  //a projection matrix, that encapsulates how what we draw corresponds to what is seen
  private proj: mat4;

  //a modelview matrix, that encapsulates all the transformations applied to our object
  private modelview: Stack<mat4>;

  private scenegraph: Scenegraph<VertexPNT>;
  private shaderLocations: ShaderLocationsVault;

  private time: number;

  private cameraMode: CameraMode;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.time = 0;
    this.modelview = new Stack<mat4>();
    this.scenegraph = null;
    //set the clear color
    this.gl.clearColor(0.9, 0.9, 0.7, 1);

    //Our quad is in the range (-100,100) in X and Y, in the "virtual world" that we are drawing. We must specify what part of this virtual world must be drawn. We do this via a projection matrix, set up as below. In this case, we are going to render the part of the virtual world that is inside a square from (-200,-200) to (200,200). Since we are drawing only 2D, the last two arguments are not useful. The default Z-value chosen is 0, which means we only specify the last two numbers such that 0 is within their range (in this case we have specified them as (-100,100))
    // this.proj = mat4.ortho(mat4.create(), -100, 100, -100, 100, 0.1, 10000);
    this.proj = mat4.perspective(
      mat4.create(),
      glMatrix.toRadian(60),
      1,
      1,
      1000
    );

    //We must also specify "where" the above part of the virtual world will be shown on the actual canvas on screen. This part of the screen where the above drawing gets pasted is called the "viewport", which we set here. The origin of the viewport is left,bottom. In this case we want it to span the entire canvas, so we start at (0,0) with a width and height of 400 each (matching the dimensions of the canvas specified in HTML)
    this.gl.viewport(0, 0, 400, 400);
    this.cameraMode = CameraMode.Front;
    window.addEventListener("keydown", ev => this.keyPress(ev.code));
  }

  public initShaders(vShaderSource: string, fShaderSource: string) {
    //create and set up the shader
    this.shaderProgram = WebGLUtils.createShaderProgram(
      this.gl,
      vShaderSource,
      fShaderSource
    );
    //enable the current program
    this.gl.useProgram(this.shaderProgram);

    this.shaderLocations = new ShaderLocationsVault(
      this.gl,
      this.shaderProgram
    );
  }

  public initScenegraph(): void {
    //make scene graph programmatically
    /*  let meshURLs: Map<string, string> = new Map<string, string>();
          meshURLs.set("box", "models/box.obj");
          meshURLs.set("aeroplane", "models/aeroplane.obj");
          ObjImporter.batchDownloadMesh(meshURLs, new VertexPNTProducer(), (meshMap: Map<string, Mesh.PolygonMesh<VertexPNT>>) => {
                  this.scenegraph = new Scenegraph<VertexPNT>();
                  this.scenegraph.addPolygonMesh("box", meshMap.get("box"));
                  this.scenegraph.addPolygonMesh("aeroplane", meshMap.get("aeroplane"));
                  let groupNode: GroupNode = new GroupNode(this.scenegraph, "root");
                  let transformNode: TransformNode = new TransformNode(this.scenegraph, "box-transform");
                  let transform: mat4 = mat4.create();
                  mat4.scale(transform, transform, vec3.fromValues(50, 50, 50));
                  transformNode.setTransform(transform);
                  let child: SGNode = new LeafNode("box", this.scenegraph, "boxnode");
                  let mat: Material = new Material();
                  mat.setAmbient(vec3.fromValues(1, 0, 0));
                  child.setMaterial(mat);
                  transformNode.addChild(child);
                  groupNode.addChild(transformNode);
      
                  transformNode = new TransformNode(this.scenegraph, "aeroplane-transform");
                  transform = mat4.create();
                  mat4.scale(transform, transform, vec3.fromValues(30, 30, 30));
                  mat4.rotate(transform, transform, glMatrix.toRadian(90), vec3.fromValues(1, 0, 0));
                  mat4.rotate(transform, transform, glMatrix.toRadian(180), vec3.fromValues(0, 1, 0));
                  transformNode.setTransform(transform);
                  child = new LeafNode("aeroplane", this.scenegraph, "aeroplane-node");
                  mat = new Material();
                  mat.setAmbient(vec3.fromValues(1, 1, 0));
                  child.setMaterial(mat);
                  transformNode.addChild(child);
                  groupNode.addChild(transformNode);
      
      
      
                  this.scenegraph.makeScenegraph(groupNode);
                  
  
              this.scenegraph = ScenegraphJSONImporter.importJSON()
              //set it up
  
              let shaderVarsToVertexAttribs: Map<string, string> = new Map<string, string>();
              shaderVarsToVertexAttribs.set("vPosition", "position");
              let renderer: ScenegraphRenderer = new ScenegraphRenderer(this.gl, this.shaderLocations, shaderVarsToVertexAttribs);
  
              this.scenegraph.setRenderer(renderer);
          }); */

    ScenegraphJSONImporter.importJSON(
      new VertexPNTProducer(),
      this.hogwartsOfficial()
    ).then((s: Scenegraph<VertexPNT>) => {
      let shaderVarsToVertexAttribs: Map<string, string> = new Map<
        string,
        string
      >();
      shaderVarsToVertexAttribs.set("vPosition", "position");
      let renderer: ScenegraphRenderer = new ScenegraphRenderer(
        this.gl,
        this.shaderLocations,
        shaderVarsToVertexAttribs
      );
      this.scenegraph = s;
      this.scenegraph.setRenderer(renderer);
    });
    //set it up
  }

  private hogwartsOfficial(): string {
    return `{
        "scaleinstances": "false",
        "instances": [
          {
            "name": "sphere",
            "path": "models/sphere.obj"
          },
          {
            "name": "box",
            "path": "models/box.obj"
          },
          {
            "name": "cylinder",
            "path": "models/cylinder.obj"
          },
          {
            "name": "cone",
            "path": "models/cone.obj"
          },
          {
            "name": "aeroplane",
            "path":"models/aeroplane.obj"
          }
        ],
        "root": {
          "type": "group",
          "name": "Root of scene graph",
          "children": [
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    5.0,
                    25.0,
                    -5.0
                  ]
                },
                {
                  "scale": [
                    10.0,
                    50.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.5,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    5.0,
                    50.0,
                    -5.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    5.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    5.0,
                    55.0,
                    -5.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    10.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    20.0,
                    25.0,
                    -5.0
                  ]
                },
                {
                  "scale": [
                    10.0,
                    50.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.5,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    20.0,
                    50.0,
                    -5.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    5.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    20.0,
                    55.0,
                    -5.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    10.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    12.5,
                    10.0,
                    -27.5
                  ]
                },
                {
                  "scale": [
                    15.0,
                    20.0,
                    35.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.3,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    30.0,
                    10.0,
                    -27.5
                  ]
                },
                {
                  "scale": [
                    20.0,
                    20.0,
                    35.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.1,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    12.5,
                    10.0,
                    -57.5
                  ]
                },
                {
                  "scale": [
                    25.0,
                    20.0,
                    25.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.5,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    12.5,
                    20.0,
                    -57.5
                  ]
                },
                {
                  "scale": [
                    11.0,
                    25.0,
                    11.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    12.5,
                    45.0,
                    -57.5
                  ]
                },
                {
                  "scale": [
                    10.0,
                    40.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    1.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    12.5,
                    85.0,
                    -57.5
                  ]
                },
                {
                  "scale": [
                    10.0,
                    20.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    12.5,
                    30.0,
                    -67.5
                  ]
                },
                {
                  "scale": [
                    4.0,
                    30.0,
                    4.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    0.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    12.5,
                    60.0,
                    -67.5
                  ]
                },
                {
                  "scale": [
                    4.0,
                    10.0,
                    4.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    12.5,
                    30.0,
                    -47.5
                  ]
                },
                {
                  "scale": [
                    4.0,
                    30.0,
                    4.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    0.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    12.5,
                    60.0,
                    -47.5
                  ]
                },
                {
                  "scale": [
                    4.0,
                    10.0,
                    4.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    22.5,
                    30.0,
                    -57.5
                  ]
                },
                {
                  "scale": [
                    4.0,
                    30.0,
                    4.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    0.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    22.5,
                    60.0,
                    -57.5
                  ]
                },
                {
                  "scale": [
                    4.0,
                    10.0,
                    4.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    2.5,
                    30.0,
                    -57.5
                  ]
                },
                {
                  "scale": [
                    4.0,
                    30.0,
                    4.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    0.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    2.5,
                    60.0,
                    -57.5
                  ]
                },
                {
                  "scale": [
                    4.0,
                    10.0,
                    4.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    50.0,
                    10.0,
                    -50.0
                  ]
                },
                {
                  "scale": [
                    50.0,
                    20.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.3,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    47.5,
                    10.0,
                    -35.0
                  ]
                },
                {
                  "scale": [
                    15.0,
                    20.0,
                    20.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.9,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    47.5,
                    25.0,
                    -17.5
                  ]
                },
                {
                  "scale": [
                    15.0,
                    50.0,
                    15.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.5,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    47.5,
                    50.0,
                    -17.5
                  ]
                },
                {
                  "scale": [
                    7.5,
                    10.0,
                    7.5
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    47.5,
                    60.0,
                    -17.5
                  ]
                },
                {
                  "scale": [
                    7.5,
                    10.0,
                    7.5
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    32.5,
                    10.0,
                    -5.0
                  ]
                },
                {
                  "scale": [
                    15.0,
                    20.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.9,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    60.0,
                    10.0,
                    -27.5
                  ]
                },
                {
                  "scale": [
                    10.0,
                    20.0,
                    35.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.1,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    70.0,
                    10.0,
                    -27.5
                  ]
                },
                {
                  "scale": [
                    10.0,
                    20.0,
                    15.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.5,
                    0.9
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    70.0,
                    25.0,
                    -40.0
                  ]
                },
                {
                  "scale": [
                    10.0,
                    50.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.5,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    70.0,
                    50.0,
                    -40.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    5.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    70.0,
                    55.0,
                    -40.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    10.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    70.0,
                    25.0,
                    -15.0
                  ]
                },
                {
                  "scale": [
                    10.0,
                    50.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.5,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    70.0,
                    50.0,
                    -15.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    5.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    70.0,
                    55.0,
                    -15.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    10.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    80.0,
                    10.0,
                    -27.5
                  ]
                },
                {
                  "scale": [
                    10.0,
                    20.0,
                    35.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.1,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    80.0,
                    25.0,
                    -50.0
                  ]
                },
                {
                  "scale": [
                    10.0,
                    50.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.5,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    80.0,
                    50.0,
                    -50.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    5.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    80.0,
                    55.0,
                    -50.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    10.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    80.0,
                    25.0,
                    -5.0
                  ]
                },
                {
                  "scale": [
                    10.0,
                    50.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.5,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    80.0,
                    50.0,
                    -5.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    5.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    80.0,
                    55.0,
                    -5.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    10.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    103.0,
                    10.0,
                    -27.0
                  ]
                },
                {
                  "scale": [
                    36.0,
                    20.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.9,
                    0.1,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    95.0,
                    10.0,
                    -50.0
                  ]
                },
                {
                  "scale": [
                    20.0,
                    20.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.1,
                    0.1,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    113.0,
                    0.0,
                    -50.0
                  ]
                },
                {
                  "scale": [
                    12.5,
                    40.0,
                    12.5
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    113.0,
                    40.0,
                    -50.0
                  ]
                },
                {
                  "scale": [
                    12.5,
                    50.0,
                    12.5
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    131.0,
                    10.0,
                    -50.0
                  ]
                },
                {
                  "scale": [
                    20.0,
                    20.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.1,
                    0.1,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    136.0,
                    25.0,
                    -42.0
                  ]
                },
                {
                  "scale": [
                    10.0,
                    50.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.5,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    136.0,
                    50.0,
                    -42.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    5.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    136.0,
                    55.0,
                    -42.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    10.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    126.0,
                    25.0,
                    -27.0
                  ]
                },
                {
                  "scale": [
                    10.0,
                    50.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.5,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    126.0,
                    50.0,
                    -27.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    5.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cylinder",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    0.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    126.0,
                    55.0,
                    -27.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    10.0,
                    5.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "cone",
                "material": {
                  "color": [
                    1.0,
                    0.0,
                    1.0
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    136.0,
                    10.0,
                    -29.5
                  ]
                },
                {
                  "scale": [
                    10.0,
                    20.0,
                    15.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.9,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "transform",
              "transform": [
                {
                  "translate": [
                    12.5,
                    10.0,
                    -5.0
                  ]
                },
                {
                  "scale": [
                    5.0,
                    20.0,
                    10.0
                  ]
                }
              ],
              "child": {
                "type": "object",
                "instanceof": "box",
                "material": {
                  "color": [
                    0.5,
                    0.9,
                    0.5
                  ]
                }
              }
            },
            {
              "type": "keyframe",
              "name": "plane",
              "keyframes": "models/camerapath.txt",
              "transform": [
                {"scale": [0.3, 0.3, 0.3]},
                {"rotate": [270, 1, 0, 0]}
              ],
              "child": {
                "type": "object",
                "instanceof": "aeroplane",
                "material": {
                  "color": [
                    0.5,
                    0.9,
                    0.5
                  ]
                }
              }
            }
          ]
        }
      }
      `;
  }

  //   private hogwarts(): string {
  //     const obj1 = (xScale: string, zScale: string) => `"child": {
  //         "type": "group",
  //         "children": [{
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0,25,0]},
  //                     {"scale": [${xScale}, 50, ${zScale}]}],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "box",
  //                     "material": {
  //                         "color": [1, 0, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0, 50, 0]},
  //                     {"scale": [${xScale}, 5, ${zScale}]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cylinder",
  //                     "material": {
  //                         "color": [1, 1, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0, 57.5, 0]},
  //                     {"scale": [${xScale}, 20, ${zScale}]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cone",
  //                     "material": {
  //                         "color": [0, 1, 0]
  //                     }
  //                 }
  //             }
  //         ]
  //     }`;
  //     const obj8 = (xScale: string, zScale: string) => `"child": {
  //         "type": "group",
  //         "children": [{
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0,25,0]},
  //                     {"scale": [${xScale}, 50, ${zScale}]}],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "box",
  //                     "material": {
  //                         "color": [1, 0, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0, 50, 0]},
  //                     {"scale": [${xScale}, 10, ${zScale}]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cylinder",
  //                     "material": {
  //                         "color": [1, 1, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0, 60, 0]},
  //                     {"scale": [${xScale}, 20, ${zScale}]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cone",
  //                     "material": {
  //                         "color": [0, 1, 0]
  //                     }
  //                 }
  //             }
  //         ]
  //     }`;
  //     const obj3 = (
  //       xScale: string,
  //       zScale: string,
  //       color: string[] = ["0", "1", "0"]
  //     ) => `"child": {
  //         "type": "transform",
  //         "transform": [
  //             {"translate": [0, 10, 0]},
  //             {"scale": [${xScale}, 20, ${zScale}]}],
  //         "child": {
  //             "type": "object",
  //             "instanceof": "box",
  //             "material": {
  //                 "color": [${color[0]}, ${color[1]}, ${color[2]}]
  //             }
  //         }
  //     }`;
  //     const obj5 = `
  //     "child": {
  //         "type": "group",
  //         "children": [{
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0,10,0]},
  //                     {"scale": [25, 20, 25]}],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "box",
  //                     "material": {
  //                         "color": [1, 0, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0, 26.25, 0]},
  //                     {"scale": [22, 25, 22]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cylinder",
  //                     "material": {
  //                         "color": [1, 1, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0, 40, 0]},
  //                     {"scale": [20, 40, 20]}
  //                ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cylinder",
  //                     "material": {
  //                         "color": [0, 1, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0, 60, 0]},
  //                     {"scale": [20, 40, 20]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cone",
  //                     "material": {
  //                         "color": [0, 1, 1]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [-10, 37.5, 0]},
  //                     {"scale": [8, 30, 8]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cylinder",
  //                     "material": {
  //                         "color": [1, 0, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [10, 37.5, 0]},
  //                     {"scale": [8, 30, 8]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cylinder",
  //                     "material": {
  //                         "color": [1, 0, 0]
  //                     }
  //                 }
  //             }
  //             ,
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0, 37.5, 10]},
  //                     {"scale": [8, 30, 8]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cylinder",
  //                     "material": {
  //                         "color": [1, 0, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0, 37.5, -10]},
  //                     {"scale": [8, 30, 8]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cylinder",
  //                     "material": {
  //                         "color": [1, 0, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [10,50, 0]},
  //                     {"scale": [8, 20, 8]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cone",
  //                     "material": {
  //                         "color": [1, 1, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [-10,50, 0]},
  //                     {"scale": [8, 20, 8]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cone",
  //                     "material": {
  //                         "color": [1, 1, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0,50, 10]},
  //                     {"scale": [8, 20, 8]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cone",
  //                     "material": {
  //                         "color": [1, 1, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0,50, -10]},
  //                     {"scale": [8, 20, 8]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cone",
  //                     "material": {
  //                         "color": [1, 1, 0]
  //                     }
  //                 }
  //             }
  //         ]
  //     }
  //     `;
  //     const obj19 = `"child": {
  //         "type": "group",
  //         "children": [{
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0, 10, 0]},
  //                     {"scale": [25, 40, 25]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cylinder",
  //                     "material": {
  //                         "color": [1, 0, 0]
  //                     }
  //                 }
  //             },
  //             {
  //                 "type": "transform",
  //                 "transform": [
  //                     {"translate": [0, 45, 0]},
  //                     {"scale": [25, 100, 25]}
  //                 ],
  //                 "child": {
  //                     "type": "object",
  //                     "instanceof": "cone",
  //                     "material": {
  //                         "color": [0, 1, 0]
  //                     }
  //                 }
  //             }
  //         ]
  //     }`;
  //     return `
  //     {
  //         "instances": [{
  //                 "name": "box",
  //                 "path": "models/box.obj"
  //             },
  //             {
  //                 "name": "cylinder",
  //                 "path": "models/cylinder.obj"
  //             },
  //             {
  //                 "name": "cone",
  //                 "path": "models/cone.obj"
  //             }
  //         ],

  //         "root": {
  //             "type": "group",
  //             "name": "root",
  //             "children": [{
  //                 "type": "group",
  //                 "name" : "object 1",
  //                 "children": [{
  //                     "type": "transform",
  //                     "transform": [{
  //                         "translate": [5, 0, -5]
  //                     }],
  //                     ${obj1("10", "10")}
  //                 }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 2",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [20, 0, -5]
  //                 }],
  //                 ${obj1("10", "10")}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 3",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [12.5, 0, -27.5]
  //                 }],
  //                 ${obj3("15", "35")}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 4",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [30, 0, -27.5]
  //                 }],
  //                 ${obj3("20", "35", ["0", "0", "1"])}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 5",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [12.5, 0, -57.5]
  //                 }],
  //                 ${obj5}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 6",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [50, 0, -50]
  //                 }],
  //                 ${obj3("50", "10", ["1", "0", "1"])}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 7",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [47.5, 0, -35]
  //                 }],
  //                 ${obj3("15", "20", ["0", "1", "0"])}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 8",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [47.5, 0, -17.5]
  //                 }],
  //                 ${obj8("15", "15")}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 9",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [32.5, 0, -5]
  //                 }],
  //                 ${obj3("15", "10", ["1", "0", "1"])}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 10",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [60, 0, -27.5]
  //                 }],
  //                 ${obj3("10", "35", ["0", "0", "1"])}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 11",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [70, 0, -27.5]
  //                 }],
  //                 ${obj3("10", "15", ["0", "1", "1"])}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 12",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [70, 0, -40]
  //                 }],
  //                 ${obj1("10", "10")}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 13",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [70, 0, -15]
  //                 }],
  //                 ${obj1("10", "10")}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 14",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [80, 0, -27.5]
  //                 }],
  //                 ${obj3("10", "35", ["0", "0", "1"])}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 15",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [80, 0, -5]
  //                 }],
  //                 ${obj1("10", "10")}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 16",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [80, 0, -50]
  //                 }],
  //                 ${obj1("10", "10")}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 17",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [103, 0, -27]
  //                 }],
  //                 ${obj3("36", "10", ["1", "0", "1"])}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 18",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [95, 0, -50]
  //                 }],
  //                 ${obj3("20", "10", ["1", "0", "1"])}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 19",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [113, 0, -50]
  //                 }],
  //                 ${obj19}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 20",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [131, 0, -50]
  //                 }],
  //                 ${obj3("20", "10", ["1", "1", "0"])}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 21",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [136, 0, -41]
  //                 }],
  //                 ${obj1("10", "10")}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 22",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [126, 0, -27]
  //                 }],
  //                 ${obj1("10", "10")}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 23",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [136, 0, -29.5]
  //                 }],
  //                 ${obj3("10", "15", ["1", "1", "0"])}
  //             }]
  //             },
  //             {
  //             "type": "group",
  //             "name" : "object 24",
  //             "children": [{
  //                 "type": "transform",
  //                 "transform": [{
  //                     "translate": [12.5, 0, -5]
  //                 }],
  //                 ${obj3("5", "10", ["1", "1", "0"])}
  //             }]
  //             }
  //         ]
  //         }
  //     }`;
  //   }

  public animate(): void {
    this.time += 1;
    if (this.scenegraph != null) {
      this.scenegraph.animate(this.time);
    }
    this.draw();
  }

  public draw(): void {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

    if (this.scenegraph == null) {
      return;
    }

    this.gl.useProgram(this.shaderProgram);

    while (!this.modelview.isEmpty()) this.modelview.pop();
    const perspectiveCamera = mat4.perspective(
      mat4.create(),
      glMatrix.toRadian(60),
      1,
      1,
      1000
    );
    const orthoCamera = mat4.ortho(
      mat4.create(),
      -100,
      100,
      -100,
      100,
      0.1,
      10000
    );
    /*
     *In order to change the shape of this triangle, we can either move the vertex positions above, or "transform" them
     * We use a modelview matrix to store the transformations to be applied to our triangle.
     * Right now this matrix is identity, which means "no transformations"
     */
    this.modelview.push(mat4.create());
    this.modelview.push(mat4.clone(this.modelview.peek()));

    if (this.cameraMode === CameraMode.Front) {
      this.proj = perspectiveCamera;
      mat4.lookAt(
        this.modelview.peek(),
        vec3.fromValues(100, 100, 120),
        vec3.fromValues(70, 30, -10),
        vec3.fromValues(0, 1, 0)
      );
    } else if (this.cameraMode === CameraMode.Overhead) {
      this.proj = orthoCamera;
      mat4.lookAt(
        this.modelview.peek(),
        vec3.fromValues(50, 200, -40),
        vec3.fromValues(50, 50, -40),
        vec3.fromValues(0, 0, -1)
      );
    } else if (this.cameraMode === CameraMode.Cockpit) {
      this.proj = perspectiveCamera;
      const nodes = this.scenegraph.getNodes();
      const planeNode = <KeyframeNode>nodes.get("plane");
      mat4.lookAt(
        this.modelview.peek(),
        vec3.fromValues(0, 0, -2),
        vec3.fromValues(0, 0, -100),
        vec3.fromValues(0, 1, 0)
      );

      const planeTransformation = planeNode.getAnimationTransform();
      let planeInverse: mat4 = mat4.create();
      mat4.invert(planeInverse, planeTransformation);
      mat4.multiply(this.modelview.peek(), this.modelview.peek(), planeInverse);
    } else {
      this.proj = perspectiveCamera;
      mat4.lookAt(
        this.modelview.peek(),
        vec3.fromValues(
          130 * Math.cos(this.time / 50) + 70,
          90,
          130 * Math.sin(this.time / 50) - 10
        ),
        vec3.fromValues(70, 30, -10),
        vec3.fromValues(0, 1, 0)
      );
    }

    this.gl.uniformMatrix4fv(
      this.shaderLocations.getUniformLocation("proj"),
      false,
      this.proj
    );

    this.scenegraph.draw(this.modelview);
  }

  public freeMeshes(): void {
    this.scenegraph.dispose();
  }

  public setFeatures(features: Features): void {}

  public keyPress(keyEvent: string): void {
    switch (keyEvent) {
      case "KeyT":
        this.cameraMode = CameraMode.Rotate;
        break;
      case "KeyF":
        this.cameraMode = CameraMode.Front;
        break;
      case "KeyO":
        this.cameraMode = CameraMode.Overhead;
        break;
      case "KeyA":
        this.cameraMode = CameraMode.Cockpit;
    }
  }
}
