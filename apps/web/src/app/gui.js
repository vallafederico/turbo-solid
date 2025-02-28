import GUI from "lil-gui";
import { isClient } from "~/lib/utils/isClient";

const guiKey = "GUI_STATE";

let g;
if (isClient) {
  g = new GUI();
  g.close();
}

const config = {
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

const createObservableObject = (obj) => {
  return new Proxy(obj, {
    set(target, prop, value) {
      target[prop] = value;
      if (isClient) {
        add(target, prop, value);
      }
      return true;
    },
  });
};

/* ---  add utils */
function add(target, prop, value, addTo = g) {
  if (!isClient) return;

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

function addNumber(target, prop, value, addTo) {
  const minmax = value < 1 ? [0, 1] : [0, 100];
  addTo.add(target, prop, minmax[0], minmax[1]);
}

function addBoolean(target, prop, value, addTo) {
  addTo.add(target, prop);
}

function addFunction(target, prop, value, addTo) {
  addTo.add(target, prop);
}

function addObject(target, prop, value) {
  const folder = g.addFolder(prop);
  folder.close();
  for (const key in value) {
    add(value, key, value[key], folder);
  }
}

/* ---  general controllers */
let { guiHidden } = config;

if (isClient) {
  if (guiHidden) g.hide();
}

// * exports
export const Gui = createObservableObject({});

Gui.show = () => {
  if (!isClient) return;

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
