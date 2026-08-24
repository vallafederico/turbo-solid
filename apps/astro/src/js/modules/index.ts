import type { ModuleRegistry } from "@local/modules";
import { CurrentPageModule } from "./current-page";
import { SliderModule } from "./slider";

export const persistentModules: ModuleRegistry = {
  "current-page": CurrentPageModule,
};

export const pageModules: ModuleRegistry = {
  slider: SliderModule,
};
