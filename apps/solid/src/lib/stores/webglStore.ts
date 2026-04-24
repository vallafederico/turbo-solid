import { createStore } from "solid-js/store";

const [webgl, setWebgl] = createStore({
  loaded: false,
});

export { webgl, setWebgl };
