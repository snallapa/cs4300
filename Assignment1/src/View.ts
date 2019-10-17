import { vec3, vec4, mat4, glMatrix, vec2 } from "gl-matrix";
import * as WebGLUtils from "%COMMON/WebGLUtils";

export class View {
  private gl: WebGLRenderingContext;
  private shaderProgram: WebGLProgram;
  private vbo: WebGLBuffer;
  private ibo: WebGLBuffer;
  private pacmanIndices: number;
  private cometIndices: number;
  private proj: mat4;
  private modelView: mat4;
  private pacmanCenter: vec2;
  private cometCenter: vec2;
  private pacmanRadius: number;
  private dims: vec2;
  private excludedSlices: number;
  private angle: number;
  private direction: number;
  private cometLargeRadius: number;
  private cometSmallRadius: number;
  private time: number;
  private cometCount: number;
  private offset: number;
  private appeared: boolean;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.dims = vec2.fromValues(0, 0);
    //pacman related variables
    this.pacmanCenter = vec2.fromValues(200, 200);
    this.pacmanRadius = 100;
    this.angle = 0;
    this.direction = 1;

    //comet related variables
    this.cometCenter = vec2.fromValues(500, 200);
    this.cometLargeRadius = 100;
    this.cometSmallRadius = 80;
    this.time = 0;
    this.cometCount = 0;
    this.offset = 0;
    this.appeared = false;
  }

  public setDimensions(width: number, height: number): void {
    this.dims = vec2.fromValues(width, height);
  }

  public init(vShaderSource: string, fShaderSource: string): void {
    //create and set up the shader
    this.shaderProgram = WebGLUtils.createShaderProgram(
      this.gl,
      vShaderSource,
      fShaderSource
    );

    let vData: vec2[] = [];
    let iData: number[] = [];

    // Sets the vertices and indices for pacman
    let pacManSlices: number = 45;

    //push the pacmanCenter of the circle as the first vertex
    vData.push(vec2.fromValues(0, 0));
    for (let i: number = 0; i < pacManSlices; i++) {
      let theta: number = (i * 2 * Math.PI) / pacManSlices;
      vData.push(vec2.fromValues(Math.cos(theta), Math.sin(theta)));
    }

    vData.push(vec2.fromValues(1, 0));

    //we will use TRIANGLES as our draw mode as this allowed to me to draw the
    //mouth in a separate drawElements call more easily
    //therefore we need to put the indices as (0,1,2) (0,2,3) etc
    for (let i: number = 1; i < pacManSlices + 1; i++) {
      iData.push(0);
      iData.push(i);
      iData.push(i + 1);
    }
    this.pacmanIndices = iData.length;

    //these are the indices that are specific to the mouth
    //40 degres and each triangle has 3 indices
    this.excludedSlices = (40 / 360) * pacManSlices * 3;
    //enable the current program
    this.gl.useProgram(this.shaderProgram);
    let verticesOffset = vData.length;

    //add the vertices for the comet
    let cometSlices: number = 60;

    //push the center of the circle as the first vertex
    const ratio: number = this.cometLargeRadius / this.cometSmallRadius;
    for (let i: number = 0; i < cometSlices; i++) {
      let theta: number = (i * 2 * Math.PI) / cometSlices;
      vData.push(
        vec2.fromValues(ratio * Math.cos(theta), ratio * Math.sin(theta))
      );
      vData.push(vec2.fromValues(Math.cos(theta), Math.sin(theta)));
    }
    //this is just to make it a nice circle
    vData.push(vec2.fromValues(ratio, 0));
    vData.push(vec2.fromValues(1, 0));

    //we will use TRIANGLE_STRIP to draw the comet
    //(which is why the vertices were put the way they were above)
    //the offset is because I decided to use one vertex array to avoid buffering vertices
    for (let i: number = 0; i < vData.length - verticesOffset; i++) {
      iData.push(i + verticesOffset);
    }

    this.cometIndices = iData.length - this.pacmanIndices;

    //buffer indices and vertices
    let vertexData: Float32Array = new Float32Array(
      (function*() {
        for (let v of vData) {
          yield v[0];
          yield v[1];
        }
      })()
    );

    let indexData: Uint8Array = Uint8Array.from(iData);

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
    this.gl.clearColor(1, 1, 1, 1);

    this.proj = mat4.ortho(
      mat4.create(),
      0,
      this.dims[0],
      0,
      this.dims[1],
      -1,
      1
    );
    this.gl.viewport(0, 0, this.dims[0], this.dims[1]);
  }

  public drawPacman() {
    let color: vec4 = vec4.create();
    color[0] = 1;
    color[1] = 1;
    color[2] = 0;

    //this draws the body sans mouth
    this.modelView = mat4.create();
    mat4.translate(
      this.modelView,
      this.modelView,
      vec3.fromValues(this.pacmanCenter[0], this.pacmanCenter[1], 0)
    );
    mat4.scale(
      this.modelView,
      this.modelView,
      vec3.fromValues(this.pacmanRadius, this.pacmanRadius, this.pacmanRadius)
    );

    this.gl.useProgram(this.shaderProgram);

    let projectionLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "proj"
    );
    this.gl.uniformMatrix4fv(projectionLocation, false, this.proj);

    let modelViewLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "modelView"
    );
    this.gl.uniformMatrix4fv(modelViewLocation, false, this.modelView);
    let colorLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "vColor"
    );
    this.gl.uniform4fv(colorLocation, color);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.pacmanIndices - this.excludedSlices * 2,
      this.gl.UNSIGNED_BYTE,
      this.excludedSlices
    );

    //this draws and animates the upper mouth
    this.modelView = mat4.create();
    mat4.translate(
      this.modelView,
      this.modelView,
      vec3.fromValues(this.pacmanCenter[0], this.pacmanCenter[1], 0)
    );
    mat4.scale(
      this.modelView,
      this.modelView,
      vec3.fromValues(this.pacmanRadius, this.pacmanRadius, this.pacmanRadius)
    );
    mat4.rotate(
      this.modelView,
      this.modelView,
      glMatrix.toRadian(this.angle),
      vec3.fromValues(0, 0, 1)
    );

    this.gl.uniformMatrix4fv(modelViewLocation, false, this.modelView);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.excludedSlices,
      this.gl.UNSIGNED_BYTE,
      0
    );

    //this draws and animates the lower mouth
    this.modelView = mat4.create();
    mat4.translate(
      this.modelView,
      this.modelView,
      vec3.fromValues(this.pacmanCenter[0], this.pacmanCenter[1], 0)
    );
    mat4.scale(
      this.modelView,
      this.modelView,
      vec3.fromValues(this.pacmanRadius, this.pacmanRadius, this.pacmanRadius)
    );
    //angle is negated so it will mirror the upper mouth
    mat4.rotate(
      this.modelView,
      this.modelView,
      glMatrix.toRadian(-1 * this.angle),
      vec3.fromValues(0, 0, 1)
    );

    this.gl.uniformMatrix4fv(modelViewLocation, false, this.modelView);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.excludedSlices,
      this.gl.UNSIGNED_BYTE,
      this.pacmanIndices - this.excludedSlices
    );
  }

  public drawComet() {
    let color: vec4 = vec4.create();a
    color[0] = 0;
    color[1] = 0;
    color[2] = 0;

    this.modelView = mat4.create();
    mat4.translate(
      this.modelView,
      this.modelView,
      vec3.fromValues(this.cometCenter[0], this.cometCenter[1], 0)
    );
    mat4.scale(
      this.modelView,
      this.modelView,
      vec3.fromValues(
        this.cometSmallRadius,
        this.cometSmallRadius,
        this.cometSmallRadius
      )
    );

    this.gl.useProgram(this.shaderProgram);

    let projectionLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "proj"
    );
    this.gl.uniformMatrix4fv(projectionLocation, false, this.proj);

    let modelViewLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "modelView"
    );
    this.gl.uniformMatrix4fv(modelViewLocation, false, this.modelView);

    this.gl.uniformMatrix4fv(modelViewLocation, false, this.modelView);
    let colorLocation: WebGLUniformLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "vColor"
    );
    this.gl.uniform4fv(colorLocation, color);

    //we use the count and offset to draw the part of the ring thats disappearing/reappearing
    this.gl.drawElements(
      this.gl.TRIANGLE_STRIP,
      this.cometCount,
      this.gl.UNSIGNED_BYTE,
      this.pacmanIndices + this.offset
    );
  }

  public draw(): void {
    //clear the window
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.drawPacman();
    this.drawComet();
  }

  public animatePacman() {
    //when the angle reaches 40 degrees it should go down again
    if (this.angle == 0) {
      this.direction = 1;
    } else if (this.angle == 40) {
      this.direction = -1;
    }
    this.angle += this.direction;
  }

  public animateComet() {
    //the time was just to slow down the animation (1000 is arbitrary just to keep it small)
    this.time = (this.time + 1) % 1000;
    if (this.time % 2 == 0) {
      //we use 2 because the strip uses 2 indices at a time it will look cleaner
      if (this.appeared) {
        this.offset += 2;
        this.cometCount = this.cometIndices - this.offset;
        this.appeared = this.offset < this.cometIndices;
      } else {
        this.cometCount += 2;
        this.offset = 0;
        this.appeared = this.cometCount >= this.cometIndices;
      }
    }
  }

  public animate(): void {
    this.animatePacman();
    this.animateComet();
    this.draw();
  }
}
3