import { vec2, vec3, vec4, mat4, glMatrix } from "gl-matrix";
import * as WebGLUtils from "%COMMON/WebGLUtils";
import { Stack } from "%COMMON/Stack";

export class View {
  private gl: WebGLRenderingContext;
  private shaderProgram: WebGLShader;
  private vbo: WebGLBuffer;
  private ibo: WebGLBuffer;
  private numVertices: number;
  private proj: mat4;
  //in order to arrange the transformations in a hierarchical fashion, we use a stack of matrices
  private modelview: Stack<mat4>;
  private time: number;
  private circleIndices: number;
  private quadIndices: number;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.modelview = new Stack<mat4>();
    this.time = 0;
    this.circleIndices = 0;
    this.quadIndices = 0;
  }

  public init(vShaderSource: string, fShaderSource: string): void {
    //create and set up the shader
    console.log("Vertex shader source:\n" + vShaderSource);
    this.shaderProgram = WebGLUtils.createShaderProgram(
      this.gl,
      vShaderSource,
      fShaderSource
    );
    let vData: vec2[] = [];
    let iData: number[] = [];
    let SLICES = 50;
    //pushes the circle to our vertex
    vData.push(vec2.fromValues(0, 0));
    for (let i: number = 0; i < SLICES; i++) {
      let theta: number = (i * 2 * Math.PI) / SLICES;
      vData.push(vec2.fromValues(Math.cos(theta), Math.sin(theta)));
    }

    vData.push(vec2.fromValues(1, 0));

    for (let i: number = 0; i < vData.length; i++) {
      iData.push(i);
    }
    this.circleIndices = vData.length;

    //pushes the quad to our vertex that will be used for ticks and hands
    //Decided to use the same vertex buffer and use the drawElements index
    //offset and count to draw the correct values
    //that is why the offset of circleIndices is used here
    vData.push(vec2.fromValues(-1, -1));
    vData.push(vec2.fromValues(1, -1));
    vData.push(vec2.fromValues(1, 1));
    vData.push(vec2.fromValues(-1, 1));
    iData.push(
      this.circleIndices,
      this.circleIndices + 1,
      this.circleIndices + 2,
      this.circleIndices,
      this.circleIndices + 2,
      this.circleIndices + 3
    );

    this.quadIndices = 6;

    //enable the current program
    this.gl.useProgram(this.shaderProgram);

    let vertexData: Float32Array = new Float32Array(
      (function*() {
        for (let v of vData) {
          yield v[0];
          yield v[1];
        }
      })()
    );

    let indexData: Uint8Array = Uint8Array.from(iData);
    this.numVertices = vertexData.length / 2;

    //create a vertex buffer object
    this.vbo = this.gl.createBuffer();
    //bind the buffer to GL_ARRAY_BUFFER
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    //copy over the vertex data
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData, this.gl.STATIC_DRAW);

    //create a vertex buffer object for indices
    this.ibo = this.gl.createBuffer();
    //bind the buffer to GL_INDEX_BUFFER
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    //copy over the index data
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      indexData,
      this.gl.STATIC_DRAW
    );

    //get the location of the vPosition attribute in the shader program
    let positionLocation: number = this.gl.getAttribLocation(
      this.shaderProgram,
      "vPosition"
    );

    //tell webgl that the position attribute can be found as 2-floats-per-vertex with a gap of 20 bytes
    //(2 floats per position, 3 floats per color = 5 floats = 20 bytes
    this.gl.vertexAttribPointer(
      positionLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    //tell webgl to enable this vertex attribute array, so that when it draws it will use this
    this.gl.enableVertexAttribArray(positionLocation);

    //set the clear color
    this.gl.clearColor(0.66, 0.5, 0.22, 1);

    this.proj = mat4.ortho(mat4.create(), 0, 400, 0, 400, -100, 100);
    this.gl.viewport(0, 0, 400, 400);
  }

  public animate(): void {
    this.time = (this.time + 1) % Number.MAX_VALUE;
    this.draw();
  }

  public draw() {
    this.drawClockBody();
    this.drawClockMarks();
    this.drawClockHands();
  }

  public drawClockBody(): void {
    //clear the window
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.shaderProgram);

    let clockOuterRadius = 150;
    let clockInnerRadius = 140;

    let color: vec4 = vec4.create();
    color[0] = 0;
    color[1] = 0;
    color[2] = 0;
    let colorLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "vColor"
    );
    this.gl.uniform4fv(colorLocation, color);

    let projectionLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "proj"
    );
    this.gl.uniformMatrix4fv(projectionLocation, false, this.proj);

    //we start with an identity matrix
    this.modelview.push(mat4.create());
    mat4.translate(this.modelview.peek(), this.modelview.peek(), [200, 200, 0]);
    this.modelview.push(mat4.clone(this.modelview.peek()));

    mat4.scale(
      this.modelview.peek(),
      this.modelview.peek(),
      vec3.fromValues(clockOuterRadius, clockOuterRadius, clockOuterRadius)
    );
    let modelviewLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "modelview"
    );
    this.gl.uniformMatrix4fv(modelviewLocation, false, this.modelview.peek());

    this.gl.drawElements(
      this.gl.TRIANGLE_FAN,
      this.circleIndices,
      this.gl.UNSIGNED_BYTE,
      0
    );
    this.modelview.pop();

    this.modelview.push(mat4.clone(this.modelview.peek()));
    mat4.scale(
      this.modelview.peek(),
      this.modelview.peek(),
      vec3.fromValues(clockInnerRadius, clockInnerRadius, clockInnerRadius)
    );
    this.gl.uniformMatrix4fv(modelviewLocation, false, this.modelview.peek());
    color[0] = 1;
    color[1] = 1;
    color[2] = 0.8;
    this.gl.uniform4fv(colorLocation, color);

    this.gl.drawElements(
      this.gl.TRIANGLE_FAN,
      this.circleIndices,
      this.gl.UNSIGNED_BYTE,
      0
    );
    this.modelview.pop();
  }

  public drawClockMarks() {
    let modelviewLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "modelview"
    );

    let color: vec4 = vec4.create();
    color[0] = 0;
    color[1] = 0;
    color[2] = 0;

    let colorLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "vColor"
    );
    this.gl.uniform4fv(colorLocation, color);

    //4 big ticks
    for (let i = 0; i < 4; i++) {
      let angle = i * 90;
      this.modelview.push(mat4.clone(this.modelview.peek()));
      mat4.rotate(
        this.modelview.peek(),
        this.modelview.peek(),
        glMatrix.toRadian(angle),
        [0, 0, 1]
      );
      mat4.translate(this.modelview.peek(), this.modelview.peek(), [125, 0, 0]);
      mat4.scale(
        this.modelview.peek(),
        this.modelview.peek(),
        vec3.fromValues(12, 2, 1)
      );
      this.gl.uniformMatrix4fv(modelviewLocation, false, this.modelview.peek());
      this.gl.drawElements(
        this.gl.TRIANGLES,
        this.quadIndices,
        this.gl.UNSIGNED_BYTE,
        this.circleIndices
      );
      this.modelview.pop();
    }

    //8 medium ticks
    for (let i = 0; i < 12; i++) {
      if (i % 3 == 0) {
        //these are the big ticks that have been drawn already so we dont need them
        continue;
      }
      let angle = i * 30;
      this.modelview.push(mat4.clone(this.modelview.peek()));
      mat4.rotate(
        this.modelview.peek(),
        this.modelview.peek(),
        glMatrix.toRadian(angle),
        [0, 0, 1]
      );
      mat4.translate(this.modelview.peek(), this.modelview.peek(), [132, 0, 0]);
      mat4.scale(
        this.modelview.peek(),
        this.modelview.peek(),
        vec3.fromValues(6, 1.5, 1)
      );
      this.gl.uniformMatrix4fv(modelviewLocation, false, this.modelview.peek());
      this.gl.drawElements(
        this.gl.TRIANGLES,
        this.quadIndices,
        this.gl.UNSIGNED_BYTE,
        this.circleIndices
      );
      this.modelview.pop();
    }

    //small ticks
    for (let i = 0; i < 360 / 6; i++) {
      if (i % 5 == 0) {
        //these are the larger ticks already drawn so just skip them
        continue;
      }
      let angle = i * 6;
      this.modelview.push(mat4.clone(this.modelview.peek()));
      mat4.rotate(
        this.modelview.peek(),
        this.modelview.peek(),
        glMatrix.toRadian(angle),
        [0, 0, 1]
      );
      mat4.translate(this.modelview.peek(), this.modelview.peek(), [132, 0, 0]);
      mat4.scale(
        this.modelview.peek(),
        this.modelview.peek(),
        vec3.fromValues(3, 1, 1)
      );
      this.gl.uniformMatrix4fv(modelviewLocation, false, this.modelview.peek());
      this.gl.drawElements(
        this.gl.TRIANGLES,
        this.quadIndices,
        this.gl.UNSIGNED_BYTE,
        this.circleIndices
      );
      this.modelview.pop();
    }
  }

  public drawClockHands() {
    let modelviewLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "modelview"
    );

    let color: vec4 = vec4.create();
    color[0] = 0;
    color[1] = 0;
    color[2] = 0;

    let colorLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "vColor"
    );
    this.gl.uniform4fv(colorLocation, color);

    //hour hand
    this.modelview.push(mat4.clone(this.modelview.peek()));
    const currentTime = new Date();
    const hourAngle =
      0.5 * (currentTime.getHours() * 60 + currentTime.getMinutes());

    //clockwise rotation
    mat4.rotate(
      this.modelview.peek(),
      this.modelview.peek(),
      glMatrix.toRadian(-hourAngle),
      [0, 0, 1]
    );
    //angle is easier to calculate when you rotate to 12'o clock
    mat4.rotate(
      this.modelview.peek(),
      this.modelview.peek(),
      glMatrix.toRadian(90),
      [0, 0, 1]
    );
    const hourHandScale = 30;
    mat4.translate(this.modelview.peek(), this.modelview.peek(), [
      hourHandScale,
      0,
      0
    ]);
    mat4.scale(
      this.modelview.peek(),
      this.modelview.peek(),
      vec3.fromValues(hourHandScale, 3, 1)
    );
    this.gl.uniformMatrix4fv(modelviewLocation, false, this.modelview.peek());
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.quadIndices,
      this.gl.UNSIGNED_BYTE,
      this.circleIndices
    );

    this.modelview.pop();

    //minute hand
    this.modelview.push(mat4.clone(this.modelview.peek()));
    const minuteAngle = 6 * currentTime.getMinutes();

    //clockwise rotation after 12 o'clock poisition
    mat4.rotate(
      this.modelview.peek(),
      this.modelview.peek(),
      glMatrix.toRadian(-minuteAngle),
      [0, 0, 1]
    );
    //angle is easier to calculate when you rotate to 12 o'clock
    mat4.rotate(
      this.modelview.peek(),
      this.modelview.peek(),
      glMatrix.toRadian(90),
      [0, 0, 1]
    );
    const minuteHandScale = 60;
    mat4.translate(this.modelview.peek(), this.modelview.peek(), [
      minuteHandScale,
      0,
      0
    ]);
    mat4.scale(
      this.modelview.peek(),
      this.modelview.peek(),
      vec3.fromValues(minuteHandScale, 3, 1)
    );
    this.gl.uniformMatrix4fv(modelviewLocation, false, this.modelview.peek());
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.quadIndices,
      this.gl.UNSIGNED_BYTE,
      this.circleIndices
    );
    this.modelview.pop();

    //second hand
    this.modelview.push(mat4.clone(this.modelview.peek()));
    const secondAngle = 6 * currentTime.getSeconds();

    //clockwise rotation after 12 o'clock poisition
    mat4.rotate(
      this.modelview.peek(),
      this.modelview.peek(),
      glMatrix.toRadian(-secondAngle),
      [0, 0, 1]
    );
    //angle is easier to calculate when you rotate to 12 o'clock
    mat4.rotate(
      this.modelview.peek(),
      this.modelview.peek(),
      glMatrix.toRadian(90),
      [0, 0, 1]
    );
    const secondHandScale = 60;
    mat4.translate(this.modelview.peek(), this.modelview.peek(), [
      secondHandScale,
      0,
      0
    ]);
    mat4.scale(
      this.modelview.peek(),
      this.modelview.peek(),
      vec3.fromValues(secondHandScale, 1.5, 1)
    );

    color[0] = 1;
    color[1] = 0;
    color[2] = 0;
    this.gl.uniform4fv(colorLocation, color);

    this.gl.uniformMatrix4fv(modelviewLocation, false, this.modelview.peek());
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.quadIndices,
      this.gl.UNSIGNED_BYTE,
      this.circleIndices
    );
    this.modelview.pop();

    //second hand red circle (that one on the middle)
    this.modelview.push(mat4.clone(this.modelview.peek()));
    mat4.scale(
      this.modelview.peek(),
      this.modelview.peek(),
      vec3.fromValues(4, 4, 4)
    );
    this.gl.uniformMatrix4fv(modelviewLocation, false, this.modelview.peek());
    this.gl.drawElements(
      this.gl.TRIANGLE_FAN,
      this.circleIndices,
      this.gl.UNSIGNED_BYTE,
      0
    );
    this.modelview.pop();
  }
}
