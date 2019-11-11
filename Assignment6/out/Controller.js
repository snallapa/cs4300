define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Controller {
        constructor(view) {
            this.view = view;
            this.view.setFeatures(this);
        }
        go() {
            this.view.initScenegraph();
            this.view.draw();
        }
    }
    exports.Controller = Controller;
});
//# sourceMappingURL=Controller.js.map