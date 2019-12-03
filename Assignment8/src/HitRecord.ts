import { vec4, vec2, mat3 } from "gl-matrix";
import { Material } from "%COMMON/Material";
import { TextureObject } from "%COMMON/TextureObject";

export class HitRecord {
  private t: number;
  private intersection: vec4;
  private normal: vec4;
  private material: Material;
  private tcoord: vec2;
  private texture: string;

  constructor(t: number) {
    this.t = t;
  }

  public getT(): number {
    return this.t;
  }

  public getIntersection(): vec4 {
    return this.intersection;
  }

  public setIntersection(intersection: vec4) {
    this.intersection = intersection;
  }

  public getNormal(): vec4 {
    return this.normal;
  }

  public setNormal(normal: vec4) {
    this.normal = normal;
  }

  public getMaterial(): Material {
    return this.material;
  }

  public setMaterial(m: Material) {
    this.material = m;
  }

  public getTcoord(): vec2 {
    return this.tcoord;
  }

  public setTcoord(coord: vec2) {
    this.tcoord = coord;
  }

  public getTexture(): string {
    return this.texture;
  }

  public setTexture(texture: string) {
    this.texture = texture;
  }
}
