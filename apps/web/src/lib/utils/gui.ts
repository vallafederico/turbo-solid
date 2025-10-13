import GUI from "lil-gui";
import { isServer } from "solid-js/web";

const guiKey = "GUI_STATE";

interface GuiConfig {
  guiHidden: boolean;
}

interface GuiObject {
  [key: string]: any;
  show: () => void;
}

let g: GUI;
if (!isServer) {
  g = new GUI();
  g.close();
}

const config: GuiConfig = {
  // guiHidden: process.env.NODE_ENV === "production",
  guiHidden: true,
};

// localstorage utils
// if (isClient) {
//   const utilsObj = {
//     save: () => {
//       const store = JSON.stringify(Gui);
//       localStorage.setItem(guiKey, store);
//     },
//     clear: () => {
//       localStorage.removeItem(guiKey);
//     },
//   };

//   const store = g.addFolder("***");
//   store.add(utilsObj, "save");
//   store.add(utilsObj, "clear");
//   g.close();
// }

const createObservableObject = (obj: GuiObject): GuiObject => {
  return new Proxy(obj, {
    set(target: GuiObject, prop: string | symbol, value: any): boolean {
      target[prop as string] = value;
      if (!isServer) {
        add(target, prop as string, value);
      }
      return true;
    },
  });
};

/* ---  add utils */
function add(
  target: GuiObject,
  prop: string,
  value: any,
  addTo: GUI = g,
): void {
  if (isServer) return;

  switch (typeof value) {
    case "number":
      addNumber(target, prop, value, addTo);
      break;
    case "object":
      addObject(target, prop, value, addTo);
      break;
    case "boolean":
      addBoolean(target, prop, value, addTo);
      break;
    case "function":
      addFunction(target, prop, value, addTo);
      break;
    default:
      console.warn(typeof value, "NOTHING ADDED, NO TYPE");
      break;
  }
}

function addNumber(
  target: GuiObject,
  prop: string,
  value: number,
  addTo: GUI,
): void {
  const minmax = value < 1 ? [0, 1] : [0, 100];
  addTo.add(target, prop, minmax[0], minmax[1]);
}

function addBoolean(
  target: GuiObject,
  prop: string,
  value: boolean,
  addTo: GUI,
): void {
  addTo.add(target, prop);
}

function addFunction(
  target: GuiObject,
  prop: string,
  value: Function,
  addTo: GUI,
): void {
  addTo.add(target, prop);
}

function addObject(
  target: GuiObject,
  prop: string,
  value: object,
  addTo: GUI = g,
): void {
  const folder = g.addFolder(prop);
  folder.close();
  for (const key in value) {
    add(value as GuiObject, key, (value as any)[key], folder);
  }
}

/* ---  general controllers */
let { guiHidden } = config;

if (!isServer) {
  if (guiHidden) g.hide();
}

// * exports
export const Gui: GuiObject = createObservableObject({} as GuiObject);

Gui.show = () => {
  if (isServer) return;

  if (guiHidden) {
    g.show();
    guiHidden = false;
  } else {
    g.hide();
    guiHidden = true;
  }
};

// queueMicrotask(() => {
//   if (!isClient) return;
//   const state = localStorage.getItem(guiKey);
//   console.log(state);

//   if (state) {
//     const parsed = JSON.parse(state);
//     for (const key in parsed) {
//       g.removeItem(key);
//       Gui[key] = parsed[key];
//     }

//     console.log(Gui);
//   }
// });

// ---------
// Gui.bro = 10;
// Gui.obj = {
//   a: 1,
//   b: 2,
//   c: 3,
// };
// Gui.bool = true;
// Gui.func = () => {
//   console.log("func");
// };
