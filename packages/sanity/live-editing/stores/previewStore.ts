import { createSignal } from 'solid-js'

const [isPreviewing, setIsPreviewing] = createSignal(false)

export { isPreviewing, setIsPreviewing }