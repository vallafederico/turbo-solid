import type { ModuleRegistry } from "@local/modules";
import { CurrentPageModule } from "./current-page";
import { GridModule } from "./grid";
import { SliderModule } from "./slider";

export const persistentModules: ModuleRegistry = {
  grid: GridModule,
  "current-page": CurrentPageModule,
};

export const pageModules: ModuleRegistry = {
  slider: SliderModule,
};
