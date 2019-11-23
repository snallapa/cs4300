import { View } from "./View";
import * as WebGLUtils from "%COMMON/WebGLUtils";
import { RTView } from "./RTView";
import { Controller } from "./Controller";

/**
 * This is the main function of our web application. This function is called at the end of this file. In the HTML file, this script is loaded in the head so that this function is run.
 */
function main(): void {
  let view: View;
  let controller: Controller;
  //retrieve <canvas> element
  var canvas: HTMLCanvasElement = <HTMLCanvasElement>(
    document.querySelector("#glCanvas")
  );
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element");
    return;
  }

  //get the rendering context for webgl
  let gl: WebGLRenderingContext = WebGLUtils.setupWebGL(canvas, {
    antialias: false,
    alpha: false,
    depth: true,
    stencil: false
  });

  // Only continue if WebGL is available and working
  if (gl == null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  view = new View(gl);

  controller = new Controller(view);
  controller.go();

  var tick = function() {
    view.animate();
    view.draw();

    //this line sets up the animation
    requestAnimationFrame(tick);
  };

  //call tick the first time
  tick();

  window.onbeforeunload = ev => view.freeMeshes();

  //set up the ray tracer view
  let raytracerView: RTView = new RTView();
  raytracerView.initScenegraph();
}

function init(gl: WebGLRenderingContext) {}

function draw(gl: WebGLRenderingContext) {}

function getVShader(): string {
  return `attribute vec4 vPosition;
    uniform vec4 vColor;
    uniform mat4 proj;
    varying vec4 outColor;
    
    void main()
    {
        gl_Position = proj * vPosition;
        outColor = vColor;
    }
    `;
}

function getFShader(): string {
  return `precision mediump float;
    varying vec4 outColor;

    void main()
    {
        gl_FragColor = outColor;
    }
    `;
}

main();
