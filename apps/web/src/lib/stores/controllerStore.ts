import { createStore } from "solid-js/store";

// interface Controller {
//   page: string;
//   state: "idle" | "loading" | "to";
//   to: "string" | null;
// }

const [ctrl, setCtrl] = createStore({
  // global router
  page: "home",
  state: "loading",
  to: null,
  // app
  init: false,
});

const setCtrlTransition = (to: string | null) => {
  setCtrl({
    page: ctrl.page,
    state: "to",
    to,
  });
};

const setCtrlPage = (page: string) => {
  setCtrl({
    page,
    state: "idle",
    to: null,
  });
};

export { ctrl, setCtrl };
export { setCtrlTransition, setCtrlPage };
