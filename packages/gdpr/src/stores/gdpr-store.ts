import { createStore } from "solid-js/store"

export const [gdprStore, setGdprStore] = createStore<{
  statistics: boolean,
  marketing: boolean,
  preferences: boolean
}>({
  statistics: false,
  marketing: false,
  preferences: false,
})