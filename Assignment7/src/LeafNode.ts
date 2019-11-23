import { SGNode } from "./SGNode";
import { Scenegraph } from "./Scenegraph";
import { Material } from "%COMMON/Material";
import { Stack } from "%COMMON/Stack";
import { ScenegraphRenderer } from "./ScenegraphRenderer";
import { mat4, vec4 } from "gl-matrix";
import { IVertexData } from "%COMMON/IVertexData";
import { Light } from "%COMMON/Light";
import { Ray } from "Ray";
import { HitRecord } from "./HitRecord";

/**
 * This node represents the leaf of a scene graph. It is the only type of node that has
 * actual geometry to render.
 * @author Amit Shesh
 */

export class LeafNode extends SGNode {
  /**
   * The name of the object instance that this leaf contains. All object instances are stored
   * in the scene graph itself, so that an instance can be reused in several leaves
   */
  protected meshName: string;
  /**
   * The material associated with the object instance at this leaf
   */
  protected material: Material;

  protected textureName: string;

  protected textureMatrix: mat4;

  public constructor(
    instanceOf: string,
    graph: Scenegraph<IVertexData>,
    name: string
  ) {
    super(graph, name);
    this.meshName = instanceOf;
  }

  /*
   *Set the material of each vertex in this object
   */
  public setMaterial(mat: Material): void {
    this.material = mat;
  }

  /**
   * Set texture ID of the texture to be used for this leaf
   * @param name
   */
  public setTextureName(name: string): void {
    this.textureName = name;
  }

  public setTextureMatrix(textureMatrix: mat4): void {
    this.textureMatrix = textureMatrix;
  }

  /*
   * gets the material
   */
  public getMaterial(): Material {
    return this.material;
  }

  public clone(): SGNode {
    let newclone: SGNode = new LeafNode(
      this.meshName,
      this.scenegraph,
      this.name
    );
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
  public draw(context: ScenegraphRenderer, modelView: Stack<mat4>): void {
    if (this.meshName.length > 0) {
      context.drawMesh(
        this.meshName,
        this.material,
        this.textureName,
        modelView.peek(),
        this.textureMatrix
      );
    }
  }

  public rayObject(r: Ray, modelView: Stack<mat4>): HitRecord {
    if (this.meshName === "box") {
      const objRay = r.transform(mat4.invert(mat4.create(), modelView.peek()));
      const s = objRay.getStart();
      const v = objRay.getDirection();
      const x1 = (-0.5 - s[0]) / v[0];
      const x2 = (0.5 - s[0]) / v[0];
      const y1 = (-0.5 - s[1]) / v[1];
      const y2 = (0.5 - s[1]) / v[1];
      const z1 = (-0.5 - s[2]) / v[2];
      const z2 = (0.5 - s[2]) / v[2];

      const lower = Math.max(
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.min(z1, z2)
      );
      const upper = Math.min(
        Math.max(x1, x2),
        Math.max(y1, y2),
        Math.max(z1, z2)
      );
      if (upper < lower || !Number.isFinite(upper) || !Number.isFinite(lower)) {
        return null;
      } else {
        let hit: HitRecord;
        if (lower > 0 && upper > 0) {
          hit = new HitRecord(lower);
        } else if (upper > 0) {
          hit = new HitRecord(upper);
        } else {
          return null;
        }

        hit.setTexture(this.textureName);
        hit.setMaterial(this.material);
        hit.setIntersection(r.point(hit.getT()));
        const objPoint = objRay.point(hit.getT());
        let normalx: number = 0,
          normaly: number = 0,
          normalz: number = 0;
        if (objPoint[0] === 0.5) {
          normalx = 1;
        }
        if (objPoint[0] === -0.5) {
          normalx = -1;
        }
        if (objPoint[1] === 0.5) {
          normaly = 1;
        }
        if (objPoint[1] === -0.5) {
          normaly = -1;
        }
        if (objPoint[2] === 0.5) {
          normalz = 1;
        }
        if (objPoint[2] === -0.5) {
          normalz = -1;
        }
        console.log();
        const normal: vec4 = vec4.normalize(
          vec4.create(),
          vec4.transformMat4(
            vec4.create(),
            vec4.fromValues(normalx, normaly, normalz, 0),
            mat4.invert(
              mat4.create(),
              mat4.transpose(mat4.create(), modelView.peek())
            )
          )
        );
        hit.setNormal(normal);
        return hit;
      }
    }
    if (this.meshName === "sphere") {
      const objRay = r.transform(mat4.invert(mat4.create(), modelView.peek()));
      const s = objRay.getStart();
      const v = objRay.getDirection();
      const A = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
      const B = 2 * (s[0] * v[0] + s[1] * v[1] + s[2] * v[2]);
      const C = s[0] * s[0] + s[1] * s[1] + s[2] * s[2] - 1;
      const discriminant = B * B - 4 * A * C;
      if (discriminant < 0) {
        return null;
      } else {
        const t1 = (-B + Math.sqrt(discriminant)) / (2 * A);
        const t2 = (-B - Math.sqrt(discriminant)) / (2 * A);
        let t;
        if (t1 > 0 && t2 > 0) {
          t = Math.min(t1, t2);
        } else if (t1 > 0) {
          t = t2;
        } else if (t2 > 0) {
          t = t1;
        } else {
          return null;
        }
        const hit = new HitRecord(t);
        hit.setTexture(this.textureName);
        hit.setMaterial(this.material);
        hit.setIntersection(r.point(hit.getT()));
        const objPoint = objRay.point(hit.getT());
        const normal: vec4 = vec4.normalize(
          vec4.create(),
          vec4.transformMat4(
            vec4.create(),
            objPoint,
            mat4.invert(
              mat4.create(),
              mat4.transpose(mat4.create(), modelView.peek())
            )
          )
        );
        hit.setNormal(normal);
        return hit;
      }
    }
  }

  public getLights(modelView: Stack<mat4>): Light[] {
    const transformedLights = this.lights.map(light => {
      const newPosition = vec4.transformMat4(
        vec4.create(),
        light.getPosition(),
        modelView.peek()
      );
      const newDirection = vec4.transformMat4(
        vec4.create(),
        light.getSpotDirection(),
        modelView.peek()
      );
      const l = new Light();
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

  public getNumberLights(): number {
    return this.lights.length;
  }
}
