import { ShaderLocationsVault } from "%COMMON/ShaderLocationsVault";
import { RenderableMesh } from "%COMMON/RenderableMesh";
import { IVertexData } from "%COMMON/IVertexData";
import { Mesh } from "%COMMON/PolygonMesh";
import * as WebGLUtils from "%COMMON/WebGLUtils";
import { SGNode } from "SGNode";
import { Stack } from "%COMMON/Stack";
import { mat4, vec4, vec3 } from "gl-matrix";
import { Material } from "%COMMON/Material";

/**
 * This is a scene graph renderer implementation that works specifically with WebGL.
 * @author Amit Shesh
 */
export class ScenegraphRenderer {
  protected gl: WebGLRenderingContext;
  /**
   * A table of shader locations and variable names
   */
  protected shaderLocations: ShaderLocationsVault;
  /**
   * A table of shader variables -> vertex attribute names in each mesh
   */
  protected shaderVarsToVertexAttribs: Map<string, string>;

  /**
   *
   * A map to store all the textures
   */
  protected textures: Map<string, WebGLTexture>;
  /**
   * A table of renderers for individual meshes
   */
  protected meshRenderers: Map<String, RenderableMesh<IVertexData>>;

  private keyframeBuffers: Map<string, WebGLBuffer>;

  public constructor(
    gl: WebGLRenderingContext,
    shaderLocations: ShaderLocationsVault,
    shaderVarsToAttribs: Map<string, string>
  ) {
    this.gl = gl;
    this.shaderVarsToVertexAttribs = shaderVarsToAttribs;
    this.meshRenderers = new Map<String, RenderableMesh<IVertexData>>();
    this.shaderLocations = shaderLocations;
    this.keyframeBuffers = new Map<string, number>();
  }

  /**
   * Add a mesh to be drawn later.
   * The rendering context should be set before calling this function, as this function needs it
   * This function creates a new
   * {@link RenderableMesh} object for this mesh
   * @param name the name by which this mesh is referred to by the scene graph
   * @param mesh the {@link PolygonMesh} object that represents this mesh
   * @throws Exception
   */
  public addMesh<K extends IVertexData>(
    meshName: string,
    mesh: Mesh.PolygonMesh<K>
  ): void {
    if (meshName in this.meshRenderers) return;

    //verify that the mesh has all the vertex attributes as specified in the map
    if (mesh.getVertexCount() <= 0) return;
    let vertexData: K = mesh.getVertexAttributes()[0];
    for (let [s, a] of this.shaderVarsToVertexAttribs) {
      if (!vertexData.hasData(a))
        throw new Error("Mesh does not have vertex attribute " + a);
    }
    let renderableMesh: RenderableMesh<K> = new RenderableMesh<K>(
      this.gl,
      name
    );

    renderableMesh.initMeshForRendering(this.shaderVarsToVertexAttribs, mesh);

    this.meshRenderers.set(meshName, renderableMesh);
  }

  public addTexture(name: string, path: string): void {
    let image: WebGLTexture;
    let imageFormat: string = path.substring(path.indexOf(".") + 1);
    image = WebGLUtils.loadTexture(this.gl, path);

    this.textures.set(name, image);
  }

  /**
   * Begin rendering of the scene graph from the root
   * @param root
   * @param modelView
   */
  public draw(root: SGNode, modelView: Stack<mat4>): void {
    root.draw(this, modelView);
  }

  public dispose(): void {
    for (let mesh of this.meshRenderers.values()) {
      mesh.cleanup();
    }
  }

  /**
   * Draws a specific mesh.
   * If the mesh has been added to this renderer, it delegates to its correspond mesh renderer
   * This function first passes the material to the shader. Currently it uses the shader variable
   * "vColor" and passes it the ambient part of the material. When lighting is enabled, this
   * method must be overriden to set the ambient, diffuse, specular, shininess etc. values to the
   * shader
   * @param name
   * @param material
   * @param transformation
   */
  public drawMesh(
    meshName: string,
    material: Material,
    textureName: string,
    transformation: mat4
  ) {
    if (this.meshRenderers.has(meshName)) {
      //get the color
      let loc = this.shaderLocations.getUniformLocation("modelview");
      this.gl.uniformMatrix4fv(loc, false, transformation);

      let normalMatrix: mat4 = mat4.clone(transformation);
      mat4.transpose(normalMatrix, normalMatrix);
      mat4.invert(normalMatrix, normalMatrix);

      this.gl.uniformMatrix4fv(
        this.shaderLocations.getUniformLocation("normalmatrix"),
        false,
        normalMatrix
      );

      this.gl.uniform3fv(
        this.shaderLocations.getUniformLocation("material.diffuse"),
        material.getDiffuse()
      );

      this.gl.uniform3fv(
        this.shaderLocations.getUniformLocation("material.ambient"),
        material.getAmbient()
      );

      this.gl.uniform3fv(
        this.shaderLocations.getUniformLocation("material.specular"),
        material.getSpecular()
      );
      this.gl.uniform1f(
        this.shaderLocations.getUniformLocation("material.shininess"),
        material.getShininess()
      );

      this.meshRenderers.get(meshName).draw(this.shaderLocations);
    }
  }

  private bufferKeyframes(keyframe: string, vertices: number[][]) {
    const vbo = this.gl.createBuffer();
    const points = [];
    vertices.forEach(v => {
      points.push(v[0]);
      points.push(v[1]);
      points.push(v[2]);
    });
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(points),
      this.gl.STATIC_DRAW
    );
    this.keyframeBuffers.set(keyframe, vbo);
  }

  public drawKeyframe(keyframe: string, vertices: number[][], transform: mat4) {
    let loc: WebGLUniformLocation = this.shaderLocations.getUniformLocation(
      "vColor"
    );
    //set the color for all vertices to be drawn for this object
    let color: vec4 = vec4.fromValues(1, 1, 0, 1);
    this.gl.uniform4fv(loc, color);
    loc = this.shaderLocations.getUniformLocation("modelview");
    this.gl.uniformMatrix4fv(loc, false, transform);
    if (!this.keyframeBuffers.has(keyframe)) {
      this.bufferKeyframes(keyframe, vertices);
    }
    const vbo = this.keyframeBuffers.get(keyframe);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    const positionLocation = this.shaderLocations.getAttribLocation(
      "vPosition"
    );
    //tell webgl that the position attribute can be found as 2-floats-per-vertex with a gap of 20 bytes
    //(2 floats per position, 3 floats per color = 5 floats = 20 bytes
    this.gl.vertexAttribPointer(
      positionLocation,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    //tell webgl to enable this vertex attribute array, so that when it draws it will use this
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.drawArrays(this.gl.LINE_LOOP, 0, vertices.length);
  }
}
