import { vec4, mat4 } from "gl-matrix";

export class Ray {
  private start: vec4;
  private direction: vec4;

  constructor(start: vec4, direction: vec4) {
    this.start = start;
    this.direction = direction;
  }

  public getStart(): vec4 {
    return this.start;
  }

  public getDirection(): vec4 {
    return this.direction;
  }

  public transform(transformation: mat4): Ray {
    return new Ray(
      vec4.transformMat4(vec4.create(), this.start, transformation),
      vec4.transformMat4(vec4.create(), this.direction, transformation)
    );
  }

  public point(t: number): vec4 {
    return vec4.add(
      vec4.create(),
      this.start,
      vec4.scale(vec4.create(), this.direction, t)
    );
  }
}
