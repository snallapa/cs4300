import { View } from "View";
import { mat4 } from "gl-matrix";
import { Material } from "%COMMON/Material";

export interface Features {}
export class Controller implements Features {
  private view: View;

  constructor(view: View) {
    this.view = view;
    this.view.setFeatures(this);
  }

  public go(): void {
    this.view.initScenegraph();
    this.view.draw();
  }
}
