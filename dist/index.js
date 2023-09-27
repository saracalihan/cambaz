"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const Attributes = {
  OnClick: "clicked",
};
const ReservedComponentKeys = {
  Template: "template",
  render: "render",
};
class Component {
  html;
  constructor() {
    // chech component has reserved keys
    let props = Object.getOwnPropertyNames(this);
    console.log({ props });
    this.html = this.render();
  }
  render() {
    let el = document.createElement("div");
    el.innerHTML = this.template();
    let onClicks = el.querySelectorAll(`[${Attributes.OnClick}]`);
    onClicks.forEach((el) => {
      let methodName = el.getAttribute(Attributes.OnClick);
      if (!methodName || methodName === "null") {
        return;
      }
      el.addEventListener("click", () => {
        // @ts-ignore
        if (typeof this[methodName] !== "function") {
          return;
        }
        // @ts-ignore
        this[methodName]();
      });
    });
    return el;
  }
  template() {
    throw new Error("Method not implemented.");
  }
}
class AppComponent extends Component {
  /**
   *
   */
  constructor() {
    super();
  }
  count = 0;
  increseCount() {
    console.log("increseCount girdi");
    this.count++;
  }
  template() {
    return `
      <h1>Welcome To Cambaz</h1>
      <p> count is <strong> {{ count }} </strong> </p>
      <button clicked="increseCount"> count++ </button>
    `;
  }
}
class App {
  static init(selector, componentCtor) {
    if (!selector) {
      logger_1.default.error(`Entry selector cant be empty!`);
      return;
    }
    if (!componentCtor) {
      logger_1.default.error(`Entry component cant be empty!`);
      return;
    }
    let app = document.getElementById(selector);
    if (!app) {
      logger_1.default.error(
        `Entry component not found wit this selector: "${selector}"`
      );
      return;
    }
    let component = new componentCtor();
    console.log(component);
    app.appendChild(component.html);
  }
}
// @ts-ignore
window.onload = () => {
  setTimeout(() => {
    App.init("app", AppComponent);
  }, 100);
};
