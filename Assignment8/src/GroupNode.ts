import { SGNode } from "./SGNode";
import { Scenegraph } from "./Scenegraph";
import { ScenegraphRenderer } from "./ScenegraphRenderer";
import { Stack } from "%COMMON/Stack";
import { mat4, vec4 } from "gl-matrix";
import { IVertexData } from "%COMMON/IVertexData";
import { Light } from "%COMMON/Light";
import { Ray } from "Ray";
import { HitRecord } from "HitRecord";

/**
 * This class represents a group node in the scenegraph. A group node is simply a logical grouping
 * of other nodes. It can have an arbitrary number of children. Its children can be nodes of any type
 * @author Amit Shesh
 */

export class GroupNode extends SGNode {
  /**
   * A list of its children
   */
  protected children: SGNode[];

  public constructor(graph: Scenegraph<IVertexData>, name: string) {
    super(graph, name);
    this.children = [];
  }

  /**
   * Searches recursively into its subtree to look for node with specified name.
   * @param name name of node to be searched
   * @return the node whose name this is if it exists within this subtree, null otherwise
   */
  public getNode(name: string): SGNode {
    let n: SGNode = super.getNode(name);
    if (n != null) {
      return n;
    }

    let i: number = 0;
    let answer: SGNode = null;

    while (i < this.children.length && answer == null) {
      answer = this.children[i].getNode(name);
      i++;
    }
    return answer;
  }

  /**
   * Sets the reference to the scene graph object for this node, and then recurses down
   * to children for the same
   * @param graph a reference to the scenegraph object of which this tree is a part
   */
  public setScenegraph(graph: Scenegraph<IVertexData>): void {
    super.setScenegraph(graph);
    this.children.forEach(child => child.setScenegraph(graph));
  }

  /**
   * To draw this node, it simply delegates to all its children
   * @param context the generic renderer context {@link ScenegraphRenderer}
   * @param modelView the stack of modelview matrices
   */
  public draw(context: ScenegraphRenderer, modelView: Stack<mat4>): void {
    this.children.forEach(child => child.draw(context, modelView));
  }

  public rayObject(ray: Ray, modelview: Stack<mat4>): HitRecord {
    let hits = this.children.map(child => child.rayObject(ray, modelview));
    hits = hits.filter(hit => !!hit && hit.getT() > 0);
    let minHit = hits[0];
    hits.forEach(hit => {
      if (hit.getT() < minHit.getT()) {
        minHit = hit;
      }
    });
    return minHit;
  }

  public getLights(modelView: Stack<mat4>): Light[] {
    let transformedLights = this.lights.map(light => {
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
    this.children.forEach(child => {
      transformedLights = transformedLights.concat(child.getLights(modelView));
    });
    return transformedLights;
  }
  /**
   * Makes a deep copy of the subtree rooted at this node
   * @return a deep copy of the subtree rooted at this node
   */
  public clone(): SGNode {
    let newc: SGNode[] = [];

    this.children.forEach(child => newc.push(child.clone()));

    let newgroup: GroupNode = new GroupNode(this.scenegraph, name);

    this.children.forEach(child => newgroup.addChild(child));
    return newgroup;
  }

  /**
   * Since a group node is capable of having children, this method overrides the default one
   * in {@link sgraph.AbstractNode} and adds a child to this node
   * @param child
   * @throws IllegalArgumentException this class does not throw this exception
   */
  public addChild(child: SGNode): void {
    this.children.push(child);
    child.setParent(this);
  }

  /**
   * Get a list of all its children, for convenience purposes
   * @return a list of all its children
   */

  public getChildren(): SGNode[] {
    return this.children;
  }

  public getNumberLights(): number {
    return (
      this.lights.length +
      this.children.map(c => c.getNumberLights()).reduce((a, b) => a + b, 0)
    );
  }
}