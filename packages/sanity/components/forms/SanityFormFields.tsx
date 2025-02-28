import type { Component, JSX } from "solid-js"
import { Dynamic, For} from 'solid-js/web'

type FieldList = {
  [key: string]: Component<any>
}


export default function SanityFormFields({ fields, fieldList }: { fields: any[], fieldList: FieldList }) {
  return (
    <>
      <For each={fields}>
        {(field) => {
          if(!fieldList[field._type]) {
            console.warn(`Field of type ${field._type} not found`)
            return null
          }
          return (
            <Dynamic
              component={fieldList[field._type]}
              {...field}
            />
          )
        }}
      </For>
    </>
  )
}