import { View } from "./View";
import * as WebGLUtils from "%COMMON/WebGLUtils";

let lastTime: number = 0;
let numFrames: number = 0;

function main(): void {
  console.log("Here I am");
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
    antialias: true,
    alpha: false,
    depth: false,
    stencil: false
  });

  // Only continue if WebGL is available and working
  if (gl == null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  let view: View = new View(gl);

  let vShaderSource: string;
  let fShaderSource: string;

  vShaderSource = getVShader();

  fShaderSource = getFShader();

  view.init(vShaderSource, fShaderSource);

  //set up animation callback function

  var tick = function() {
    if (lastTime == -1) {
      lastTime = new Date().getTime();
    }
    numFrames = numFrames + 1;
    if (numFrames >= 100) {
      let currentTime: number = new Date().getTime();
      let frameRate: number = (1000 * numFrames) / (currentTime - lastTime);
      lastTime = currentTime;
      document.getElementById("frameratedisplay").innerHTML =
        "Frame rate: " + frameRate.toFixed(1);
      numFrames = 0;
    }
    view.animate();

    //this line sets up the animation
    requestAnimationFrame(tick);
  };

  //call tick the first time
  tick();
}

function init(gl: WebGLRenderingContext) {}

function draw(gl: WebGLRenderingContext) {}

function getVShader(): string {
  return `attribute vec4 vPosition;
    uniform vec4 vColor;
    uniform mat4 proj;
    uniform mat4 modelview;
    varying vec4 outColor;
    
    void main()
    {
        gl_Position = proj * modelview * vPosition;
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
