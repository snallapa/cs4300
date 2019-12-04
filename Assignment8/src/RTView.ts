import { HitRecord } from "./HitRecord";
import { Ray } from "./Ray";
import { Scenegraph } from "./Scenegraph";
import { VertexPNT, VertexPNTProducer } from "./VertexPNT";
import { ScenegraphRenderer } from "./ScenegraphRenderer";
import { ScenegraphJSONImporter } from "./ScenegraphJSONImporter";
import { sphere, cone, cylinder, hogwartsOfficial, box } from "./Scene";
import { Stack } from "%COMMON/Stack";
import { mat4, vec3, vec4, glMatrix, mat3 } from "gl-matrix";
import { Material } from "%COMMON/Material";
import { RayTextureObject } from "./RayTextureObject";

export class RTView {
  private canvas: HTMLCanvasElement;
  private scenegraph: Scenegraph<VertexPNT>;
  private modelview: Stack<mat4>;
  private textures: Map<string, RayTextureObject>;
  private backgroundColor: vec3;
  private DEPTH_LEVEL: number = 10;

  constructor() {
    this.textures = new Map<string, RayTextureObject>();
    this.canvas = <HTMLCanvasElement>document.querySelector("#raytraceCanvas");
    if (!this.canvas) {
      console.log("Failed to retrieve the <canvas> element");
      return;
    }
    //button clicks
    let button: HTMLButtonElement = <HTMLButtonElement>(
      document.querySelector("#savebutton")
    );
    button.addEventListener("click", ev => this.saveCanvas());
    this.modelview = new Stack<mat4>();
    // this.backgroundColor = vec3.fromValues(0.7, 0.7, 0.7);
    this.backgroundColor = vec3.fromValues(0, 0, 0);
  }

  public initScenegraph(): void {
    ScenegraphJSONImporter.importJSON(new VertexPNTProducer(), sphere()).then(
      (s: Scenegraph<VertexPNT>) => {
        this.scenegraph = s;
        const textureMap = this.scenegraph.getTextures();
        const promises = [];
        for (const key of textureMap.keys()) {
          const name = key;
          const src = textureMap.get(key);
          let textureObject = new RayTextureObject(name, src);
          this.textures.set(name, textureObject);
          promises.push(textureObject.load());
        }
        Promise.all(promises).then(() => {
          this.fillCanvas();
        });
      }
    );
    //set it up
  }

  private saveCanvas(): void {
    let link = document.createElement("a");
    link.href = this.canvas.toDataURL("image/png");
    link.download = "result.png";
    link.click();
  }

  private raytrace(width: number, height: number, modelview: Stack<mat4>) {
    let imageData: ImageData = this.canvas
      .getContext("2d")
      .createImageData(width, height);
    const theta = glMatrix.toRadian(60);
    for (let y: number = 0; y < height; y++) {
      for (let x: number = 0; x < width; x++) {
        const r = new Ray(
          vec4.fromValues(0, 0, 0, 1),
          vec4.fromValues(
            x - width / 2,
            y - height / 2,
            (-0.5 * height) / Math.tan(theta / 2),
            0
          )
        );
        let color: vec3;
        const hit = this.raycast(r, modelview);
        if (!!hit) {
          color = this.shade(hit, modelview, r, 0);

          // color = vec3.fromValues(1, 1, 1);
        } else {
          color = this.backgroundColor;
        }
        //set color
        imageData.data[4 * ((height - y) * width + x)] = color[0] * 255;
        imageData.data[4 * ((height - y) * width + x) + 1] = color[1] * 255;
        imageData.data[4 * ((height - y) * width + x) + 2] = color[2] * 255;
        imageData.data[4 * ((height - y) * width + x) + 3] = 255;
      }
    }
    this.canvas.getContext("2d").putImageData(imageData, 0, 0);
  }

  private shade(
    hit: HitRecord,
    modelview: Stack<mat4>,
    ray: Ray,
    bounce: number
  ): vec3 {
    const lights = this.scenegraph.getLights(modelview);
    let result: vec3 = vec3.fromValues(0, 0, 0);
    lights.forEach(light => {
      const fPosition = vec3.fromValues(
        hit.getIntersection()[0],
        hit.getIntersection()[1],
        hit.getIntersection()[2]
      );
      const shadowDirection = vec4.sub(
        vec4.create(),
        light.getPosition(),
        hit.getIntersection()
      );
      let shadow = 1;
      const shadowStart = vec4.add(
        vec4.create(),
        hit.getIntersection(),
        vec4.scale(vec4.create(), shadowDirection, 0.001)
      );
      const shadowRay = new Ray(shadowStart, shadowDirection);
      const shadowHit = this.raycast(shadowRay, modelview);
      if (!!shadowHit) {
        const tL = vec4.div(
          vec4.create(),
          vec4.sub(vec4.create(), light.getPosition(), shadowRay.getStart()),
          shadowRay.getDirection()
        );
        let possible = [tL[0], tL[1], tL[2]];
        possible = possible.filter(t => !isNaN(t));
        if (shadowHit.getT() < possible[0]) {
          shadow = 0;
        }
      }
      let lightVec: vec3;
      if (light.getPosition()[3] != 0) {
        lightVec = vec3.normalize(
          vec3.create(),
          vec3.sub(
            vec3.create(),
            vec3.fromValues(
              light.getPosition()[0],
              light.getPosition()[1],
              light.getPosition()[2]
            ),
            fPosition
          )
        );
      } else {
        lightVec = vec3.normalize(
          vec3.create(),
          vec3.scale(
            vec3.create(),
            vec3.fromValues(
              light.getPosition()[0],
              light.getPosition()[1],
              light.getPosition()[2]
            ),
            -1
          )
        );
      }

      const normalView = vec3.normalize(
        vec3.create(),
        vec3.fromValues(
          hit.getNormal()[0],
          hit.getNormal()[1],
          hit.getNormal()[2]
        )
      );
      const nDotL = vec3.dot(normalView, lightVec);

      const viewVec = vec3.normalize(
        vec3.create(),
        vec3.scale(vec3.create(), fPosition, -1)
      );
      const minusLightVec = vec3.scale(vec3.create(), lightVec, -1);
      const reflectVec = vec3.subtract(
        vec3.create(),
        minusLightVec,
        vec3.scale(
          vec3.create(),
          normalView,
          2 * vec3.dot(normalView, minusLightVec)
        )
      );

      vec3.normalize(reflectVec, reflectVec);
      const rDotV = Math.max(0, vec3.dot(reflectVec, viewVec));
      const ambient = vec3.multiply(
        vec3.create(),
        hit.getMaterial().getAmbient(),
        light.getAmbient()
      );

      const diffuse = vec3.multiply(
        vec3.create(),
        hit.getMaterial().getDiffuse(),
        vec3.scale(vec3.create(), light.getDiffuse(), Math.max(nDotL, 0))
      );
      let specular = vec3.fromValues(0, 0, 0);

      if (nDotL > 0) {
        specular = vec3.multiply(
          vec3.create(),
          hit.getMaterial().getSpecular(),
          vec3.scale(
            vec3.create(),
            light.getSpecular(),
            Math.pow(rDotV, hit.getMaterial().getShininess())
          )
        );
      }
      const d = vec3.dot(
        minusLightVec,
        vec3.normalize(
          vec3.create(),
          vec3.fromValues(
            light.getSpotDirection()[0],
            light.getSpotDirection()[1],
            light.getSpotDirection()[2]
          )
        )
      );
      if (Math.acos(d) <= glMatrix.toRadian(light.getSpotCutoff() / 2)) {
        vec3.add(result, result, ambient);
        vec3.add(result, result, diffuse);
        vec3.add(result, result, specular);
      }
      vec3.scale(result, result, shadow);
    });

    const tCoord = hit.getTcoord();
    const u = tCoord[0];
    const v = tCoord[1];
    const textureObject = this.textures.get(hit.getTexture());
    const textureColor = textureObject.getColor(u, v);
    vec3.multiply(
      result,
      result,
      vec3.fromValues(
        textureColor[0] / 255,
        textureColor[1] / 255,
        textureColor[2] / 255
      )
    );

    const material = hit.getMaterial();
    if (material.getReflection() > 0) {
      const normal = vec4.normalize(
        vec4.create(),
        vec4.fromValues(
          hit.getNormal()[0],
          hit.getNormal()[1],
          hit.getNormal()[2],
          0
        )
      );
      const twoDot = 2 * vec4.dot(normal, ray.getDirection());
      const reflectionDirection = vec4.sub(
        vec4.create(),
        ray.getDirection(),
        vec4.scale(vec4.create(), normal, twoDot)
      );
      const reflectionStart = vec4.add(
        vec4.create(),
        hit.getIntersection(),
        vec4.scale(vec4.create(), normal, 0.0001)
      );
      const reflectionRay = new Ray(reflectionStart, reflectionDirection);
      const reflectionHit = this.raycast(reflectionRay, modelview);

      if (bounce < this.DEPTH_LEVEL) {
        let reflectionColor;
        if (!!reflectionHit) {
          reflectionColor = this.shade(
            reflectionHit,
            modelview,
            reflectionRay,
            bounce + 1
          );
        } else {
          reflectionColor = this.backgroundColor;
        }
        return vec3.add(
          vec3.create(),
          vec3.scale(vec3.create(), result, material.getAbsorption()),
          vec3.scale(vec3.create(), reflectionColor, material.getReflection())
        );
      }
    }

    return result;
  }

  private raycast(r: Ray, modelview: Stack<mat4>): HitRecord | null {
    return this.scenegraph.rayDraw(r, modelview);
  }

  public fillCanvas(): void {
    let width: number = Number(this.canvas.getAttribute("width"));
    let height: number = Number(this.canvas.getAttribute("height"));
    this.modelview.push(mat4.create());
    this.modelview.push(mat4.clone(this.modelview.peek()));
    // mat4.lookAt(
    //   this.modelview.peek(),
    //   vec3.fromValues(100, 100, 120),
    //   vec3.fromValues(70, 30, -10),
    //   vec3.fromValues(0, 1, 0)
    // );
    mat4.lookAt(
      this.modelview.peek(),
      vec3.fromValues(0, 20, -50),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 1, 0)
    );
    this.raytrace(width, height, this.modelview);
  }
}
