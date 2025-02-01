// import { createEffect } from "solid-js";
// import { ctrl } from "../stores/controllerStore";
import { useLocation } from "@solidjs/router";
import { setCtrlPage } from "../stores/controllerStore";

export const useLocationCallback = () => {
  // createEffect(() => {
  //   console.log(ctrl.page, ctrl.state, ctrl.to);
  // });
};

export const setLocationCallback = () => {
  const location = useLocation();
  setCtrlPage(location.pathname);
};
