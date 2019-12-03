import { vec4, mat4, vec3, glMatrix, mat3 } from "gl-matrix";
import * as WebGLUtils from "%COMMON/WebGLUtils";
import { Features } from "./Controller";
import { Stack } from "%COMMON/Stack";
import { Scenegraph } from "./Scenegraph";
import { VertexPNT, VertexPNTProducer } from "./VertexPNT";
import { ShaderLocationsVault } from "%COMMON/ShaderLocationsVault";
import { ScenegraphRenderer } from "./ScenegraphRenderer";
import { ScenegraphJSONImporter } from "./ScenegraphJSONImporter";
import { KeyframeNode } from "KeyframeNode";
import { cone, sphere } from "./Scene";

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
    ScenegraphJSONImporter.importJSON(new VertexPNTProducer(), cone()).then(
      (s: Scenegraph<VertexPNT>) => {
        this.scenegraph = s;

        this.initShaders(
          this.getPhongVShader(),
          this.getPhongFShader(this.scenegraph.getNumberLight())
        );
        let shaderVarsToVertexAttribs: Map<string, string> = new Map<
          string,
          string
        >();
        shaderVarsToVertexAttribs.set("vPosition", "position");
        shaderVarsToVertexAttribs.set("vNormal", "normal");
        shaderVarsToVertexAttribs.set("vTexCoord", "texcoord");

        let renderer: ScenegraphRenderer = new ScenegraphRenderer(
          this.gl,
          this.shaderLocations,
          shaderVarsToVertexAttribs
        );
        const textureMap = this.scenegraph.getTextures();
        for (const key of textureMap.keys()) {
          renderer.addTexture(key, textureMap.get(key));
        }
        this.scenegraph.setRenderer(renderer);
      }
    );
    //set it up
  }

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
      // mat4.lookAt(
      //   this.modelview.peek(),
      //   vec3.fromValues(0, 0, -10),
      //   vec3.fromValues(0, 0, 0),
      //   vec3.fromValues(0, 1, 0)
      // );
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
      this.shaderLocations.getUniformLocation("projection"),
      false,
      this.proj
    );

    //lights
    const lights = this.scenegraph.getLights(this.modelview);

    for (let i = 0; i < lights.length; i++) {
      let ambientLocation: string = "light[" + i + "].ambient";
      let diffuseLocation: string = "light[" + i + "].diffuse";
      let specularLocation: string = "light[" + i + "].specular";
      let lightPositionLocation: string = "light[" + i + "].position";
      let spotDirection: string = "light[" + i + "].direction";
      let spotAngle: string = "light[" + i + "].angle";
      this.gl.uniform3fv(
        this.shaderLocations.getUniformLocation(diffuseLocation),
        lights[i].getDiffuse()
      );
      this.gl.uniform3fv(
        this.shaderLocations.getUniformLocation(ambientLocation),
        lights[i].getAmbient()
      );

      this.gl.uniform3fv(
        this.shaderLocations.getUniformLocation(specularLocation),
        lights[i].getSpecular()
      );
      this.gl.uniform4fv(
        this.shaderLocations.getUniformLocation(lightPositionLocation),
        lights[i].getPosition()
      );
      this.gl.uniform4fv(
        this.shaderLocations.getUniformLocation(spotDirection),
        lights[i].getSpotDirection()
      );
      this.gl.uniform1f(
        this.shaderLocations.getUniformLocation(spotAngle),
        glMatrix.toRadian(lights[i].getSpotCutoff() / 2)
      );
    }
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

  public getPhongVShader(): string {
    return `
        attribute vec4 vPosition;
        attribute vec4 vNormal;
        attribute vec2 vTexCoord;
        
        uniform mat4 projection;
        uniform mat4 modelview;
        uniform mat4 normalmatrix;
        uniform mat4 texturematrix;
        varying vec3 fNormal;
        varying vec4 fPosition;
        varying vec4 fTexCoord;
        
        void main()
        {
            vec3 lightVec,viewVec,reflectVec;
            vec3 normalView;
            vec3 ambient,diffuse,specular;
        
            fPosition = modelview * vPosition;
            gl_Position = projection * fPosition;
        
        
            vec4 tNormal = normalmatrix * vNormal;
            fNormal = normalize(tNormal.xyz);

            fTexCoord = texturematrix * vec4(vTexCoord.s,vTexCoord.t,0,1);
        
        
        }
        
    `;
  }

  public getPhongFShader(numLights: number): string {
    return (
      `precision mediump float;

        struct MaterialProperties
        {
            vec3 ambient;
            vec3 diffuse;
            vec3 specular;
            float shininess;
        };
        
        struct LightProperties
        {
            vec3 ambient;
            vec3 diffuse;

            vec3 specular;
            vec4 position;
            vec4 direction;
            float angle;
        };
        
        
        varying vec3 fNormal;
        varying vec4 fPosition;
        varying vec4 fTexCoord;

        uniform sampler2D image;
        
        
        uniform MaterialProperties material;
        uniform LightProperties light[` +
      numLights +
      `];
        
        void main()
        {
            vec3 lightVec,viewVec,reflectVec;
            vec3 normalView;
            vec3 ambient,diffuse,specular;
            float nDotL,rDotV;
            vec4 result;
        
        
            result = vec4(0,0,0,1);
        ` +
      `for (int i=0;i<` +
      numLights +
      `;i++)
            {
                if (light[i].position.w!=0.0)
                    lightVec = normalize(light[i].position.xyz - fPosition.xyz);
                else
                    lightVec = normalize(-light[i].position.xyz);
        
                vec3 tNormal = fNormal;
                normalView = normalize(tNormal.xyz);
                nDotL = dot(normalView,lightVec);
        
                viewVec = -fPosition.xyz;
                viewVec = normalize(viewVec);
        
                reflectVec = reflect(-lightVec,normalView);
                reflectVec = normalize(reflectVec);
        
                rDotV = max(dot(reflectVec,viewVec),0.0);
        
                ambient = material.ambient * light[i].ambient;
                diffuse = material.diffuse * light[i].diffuse * max(nDotL,0.0);
                if (nDotL>0.0)
                    specular = material.specular * light[i].specular * pow(rDotV,material.shininess);
                else
                    specular = vec3(0,0,0);
                float d = dot(-lightVec.xyz, normalize(light[i].direction.xyz));
                float s = 0.0;
                if (acos(d)>light[i].angle)
                  s = 0.0;
                else
                  s = 1.0;
                result = result + s * vec4(ambient+diffuse+specular,1.0);
            }
            result = result * texture2D(image,fTexCoord.st);
            gl_FragColor = result;
        }
        
    `
    );
  }
}