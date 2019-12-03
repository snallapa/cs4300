import { SGNode } from "./SGNode";
import { Scenegraph } from "./Scenegraph";
import { Material } from "%COMMON/Material";
import { Stack } from "%COMMON/Stack";
import { ScenegraphRenderer } from "./ScenegraphRenderer";
import { mat4, vec4, vec2, vec3 } from "gl-matrix";
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
        let face = "top";
        if (objPoint[0] === 0.5) {
          normalx = 1;
          face = "right";
        }
        if (objPoint[0] === -0.5) {
          normalx = -1;
          face = "left";
        }
        if (objPoint[1] === 0.5) {
          normaly = 1;
          face = "top";
        }
        if (objPoint[1] === -0.5) {
          normaly = -1;
          face = "bottom";
        }
        if (objPoint[2] === 0.5) {
          normalz = 1;
          face = "front";
        }
        if (objPoint[2] === -0.5) {
          normalz = -1;
          face = "back";
        }
        let u: number, v: number;
        switch (face) {
          case "top":
            u = 0.25 + (objPoint[0] + 0.5) / 4;
            v = 0.5 + (objPoint[2] + 0.5) / 4;
            break;
          case "bottom":
            u = 0.25 + (objPoint[0] + 0.5) / 4;
            v = (objPoint[2] + 0.5) / 4;
            break;
          case "left":
            u = (objPoint[2] + 0.5) / 4;
            v = 0.25 + (objPoint[1] + 0.5) / 4;
            break;
          case "right":
            u = 0.5 + (objPoint[2] + 0.5) / 4;
            v = 0.25 + (objPoint[1] + 0.5) / 4;
            break;
          case "front":
            u = 0.25 + (objPoint[0] + 0.5) / 4;
            v = 0.25 + (objPoint[1] + 0.5) / 4;
            break;
          case "back":
            u = 0.75 + (objPoint[0] + 0.5) / 4;
            v = 0.25 + (objPoint[1] + 0.5) / 4;
            break;
        }
        hit.setTcoord(vec2.fromValues(u, v));

        const normal: vec4 = vec4.normalize(
          vec4.create(),
          vec4.transformMat4(
            vec4.create(),
            vec4.fromValues(normalx, normaly, normalz, 0),
            mat4.transpose(
              mat4.create(),
              mat4.invert(mat4.create(), modelView.peek())
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
        const normalV = vec4.fromValues(
          objPoint[0],
          objPoint[1],
          objPoint[2],
          0
        );
        const normal: vec4 = vec4.normalize(
          vec4.create(),
          vec4.transformMat4(
            vec4.create(),
            normalV,
            mat4.invert(
              mat4.create(),
              mat4.transpose(mat4.create(), modelView.peek())
            )
          )
        );
        hit.setTcoord(
          vec2.fromValues(
            Math.atan2(objPoint[0], objPoint[2]) / (2 * Math.PI) + 0.5,
            objPoint[1] * 0.5 + 0.5
          )
        );
        hit.setNormal(normal);
        return hit;
      }
    }

    if (this.meshName === "cylinder") {
      const objRay = r.transform(mat4.invert(mat4.create(), modelView.peek()));
      const s = objRay.getStart();
      const v = objRay.getDirection();
      const a = v[0] * v[0] + v[2] * v[2];
      const b = 2 * s[0] * v[0] + 2 * s[2] * v[2];
      const c = s[0] * s[0] + s[2] * s[2] - 1;
      const discriminant = b * b - 4 * a * c;
      if (discriminant < 0) {
        return null;
      }
      const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

      const y1 = objRay.point(t1)[1];
      const y2 = objRay.point(t2)[1];
      type isT = {
        t: number;
        normal: vec4;
      };
      let ts: isT[] = [];

      const computeNormal = t => {
        const objPoint = objRay.point(t);
        const normalV = vec4.fromValues(
          objPoint[0],
          objPoint[1],
          objPoint[2],
          0
        );
        const A = vec4.fromValues(0, 1, 0, 0);

        const objNormal = vec4.subtract(
          vec4.create(),
          normalV,
          vec4.scale(vec4.create(), A, vec4.dot(normalV, A) / vec4.dot(A, A))
        );
        vec4.normalize(objNormal, objNormal);
        return objNormal;
      };

      if (0 < y1 && y1 < 1 && 0 < y2 && y2 < 1) {
        ts.push({ t: t1, normal: computeNormal(t1) });
        ts.push({ t: t2, normal: computeNormal(t2) });
      } else if (0 < y1 && y1 < 1) {
        if (y2 < 0) {
          ts.push({ t: -s[1] / v[1], normal: vec4.fromValues(0, -1, 0, 0) });
        }
        if (y2 > 1) {
          ts.push({
            t: (1 - s[1]) / v[1],
            normal: vec4.fromValues(0, 1, 0, 0)
          });
        }
        ts.push({ t: t1, normal: computeNormal(t1) });
      } else if (0 < y2 && y2 < 1) {
        if (y1 < 0) {
          ts.push({ t: -s[1] / v[1], normal: vec4.fromValues(0, -1, 0, 0) });
        }
        if (y1 > 1) {
          ts.push({
            t: (1 - s[1]) / v[1],
            normal: vec4.fromValues(0, 1, 0, 0)
          });
        }
        ts.push({ t: t2, normal: computeNormal(t2) });
      } else if ((y1 < 0 && y2 > 1) || (y2 < 0 && y1 > 1)) {
        ts.push({ t: -s[1] / v[1], normal: vec4.fromValues(0, -1, 0, 0) });
        ts.push({
          t: (1 - s[1]) / v[1],
          normal: vec4.fromValues(0, 1, 0, 0)
        });
      }
      ts = ts.filter(o => o.t > 0);

      if (ts.length === 0) {
        return null;
      }
      const { t, normal: objNormal } = ts.reduce(
        (p, c) => (p.t < c.t ? p : c),
        ts[0]
      );

      const hit = new HitRecord(t);
      hit.setTexture(this.textureName);
      hit.setMaterial(this.material);
      hit.setIntersection(r.point(hit.getT()));
      const normal: vec4 = vec4.normalize(
        vec4.create(),
        vec4.transformMat4(
          vec4.create(),
          objNormal,
          mat4.invert(
            mat4.create(),
            mat4.transpose(mat4.create(), modelView.peek())
          )
        )
      );
      const objPoint = objRay.point(t);
      const q = (objPoint[1] + 1)/2;
      const u = Math.atan2(objPoint[2], objPoint[0]) / (2 * Math.PI) + 0.5;
      hit.setTcoord(vec2.fromValues(u, q));
      hit.setNormal(normal);
      return hit;
    }

    if (this.meshName === "cone") {
      const objRay = r.transform(mat4.invert(mat4.create(), modelView.peek()));
      const s = objRay.getStart();
      const v = objRay.getDirection();
      const a = v[0] * v[0] + v[2] * v[2] - v[1] * v[1];
      const b = 2 * s[0] * v[0] + 2 * s[2] * v[2] - 2 * s[1] * v[1];
      const c = s[0] * s[0] + s[2] * s[2] - s[1] * s[1];
      const discriminant = b * b - 4 * a * c;
      const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      const y1 = objRay.point(t1)[1];
      const y2 = objRay.point(t2)[1];
      type isT = {
        t: number;
        normal: vec4;
      };
      let ts: isT[] = [];

      const computeNormal = t => {
        const objPoint = objRay.point(t);
        const m = Math.sqrt(
          objPoint[0] * objPoint[0] + objPoint[2] * objPoint[2]
        );
        const objNormal = vec4.fromValues(
          objPoint[0] / m,
          1,
          objPoint[2] / m,
          0
        );
        vec4.normalize(objNormal, objNormal);
        return objNormal;
      };

      if (-1 < y1 && y1 < 0 && -1 < y2 && y2 < 0) {
        ts.push({ t: t1, normal: computeNormal(t1) });
        ts.push({ t: t2, normal: computeNormal(t2) });
      } else if (-1 < y1 && y1 < 0) {
        if (y2 < -1) {
          ts.push({
            t: -1 - s[1] / v[1],
            normal: vec4.fromValues(0, -1, 0, 0)
          });
        }
        ts.push({ t: t1, normal: computeNormal(t1) });
      } else if (-1 < y2 && y2 < 0) {
        if (y1 < -1) {
          ts.push({
            t: -1 - s[1] / v[1],
            normal: vec4.fromValues(0, -1, 0, 0)
          });
        }
        ts.push({ t: t2, normal: computeNormal(t2) });
      } else if ((y1 < -1 && y2 > 0) || (y2 < -1 && y1 > 0)) {
        ts.push({ t: -1 - s[1] / v[1], normal: vec4.fromValues(0, -1, 0, 0) });
      }
      ts = ts.filter(o => o.t > 0);

      if (ts.length === 0) {
        return null;
      }
      const { t, normal: objNormal } = ts.reduce(
        (p, c) => (p.t < c.t ? p : c),
        ts[0]
      );

      const hit = new HitRecord(t);
      hit.setTexture(this.textureName);
      hit.setMaterial(this.material);
      hit.setIntersection(r.point(hit.getT()));
      const normal: vec4 = vec4.normalize(
        vec4.create(),
        vec4.transformMat4(
          vec4.create(),
          objNormal,
          mat4.invert(
            mat4.create(),
            mat4.transpose(mat4.create(), modelView.peek())
          )
        )
      );
      hit.setNormal(normal);
      const objPoint = objRay.point(t);
      const q = objPoint[1] * -1;
      const u = Math.atan2(objPoint[2], objPoint[0]) / (2 * Math.PI) + 0.5;
      hit.setTcoord(vec2.fromValues(u, q));
      return hit;
    }

    return null;
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
