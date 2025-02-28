import type { Component, JSX } from "solid-js"
import { Dynamic, For} from 'solid-js/web'

type SliceList = {
  [key: string]: Component<any>
}


export default function PageSlices({ slices, sliceList }: { slices: any[], sliceList: SliceList }) {
  return (
    <>
      <For each={slices}>
        {(slice) => {
          if(!sliceList[slice._type]) {
            console.warn(`Slice of type ${slice._type} not found`)
            return null
          }
          return (
            <Dynamic
              component={sliceList[slice._type]}
              {...slice}
            />
          )
        }}
      </For>
    </>
  )
}