define(["require", "exports", "./View", "%COMMON/WebGLUtils", "./Controller"], function (require, exports, View_1, WebGLUtils, Controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var numFrames = 0;
    var lastTime = -1;
    /**
     * This is the main function of our web application. This function is called at the end of this file. In the HTML file, this script is loaded in the head so that this function is run.
     */
    function main() {
        let gl;
        let view;
        let controller;
        window.onload = ev => {
            console.log("Here I am");
            //retrieve <canvas> element
            var canvas = document.querySelector("#glCanvas");
            if (!canvas) {
                console.log("Failed to retrieve the <canvas> element");
                return;
            }
            //get the rendering context for webgl
            gl = WebGLUtils.setupWebGL(canvas, { 'antialias': true, 'alpha': false, 'depth': true, 'stencil': false });
            // Only continue if WebGL is available and working
            if (gl == null) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                return;
            }
            console.log("Window loaded");
            view = new View_1.View(gl);
            controller = new Controller_1.Controller(view);
            controller.go();
            var tick = function () {
                if (lastTime == -1) {
                    lastTime = new Date().getTime();
                }
                numFrames = numFrames + 1;
                if (numFrames >= 100) {
                    let currentTime = new Date().getTime();
                    let frameRate = 1000 * numFrames / (currentTime - lastTime);
                    lastTime = currentTime;
                    document.getElementById('frameratedisplay').innerHTML = "Frame rate: " + frameRate.toFixed(1);
                    numFrames = 0;
                }
                view.animate();
                view.draw();
                //this line sets up the animation
                requestAnimationFrame(tick);
            };
            //call tick the first time
            tick();
        };
        window.onbeforeunload = ev => view.freeMeshes();
    }
    function init(gl) {
    }
    function draw(gl) {
    }
    main();
});
//# sourceMappingURL=Assignment6.js.map