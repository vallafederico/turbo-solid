import { BaseInputProps } from "../../types"
import type { JSX } from "solid-js"

type SelectInputProps = {
  children: JSX.Element
  inputClass?: string
  options: string[]
} & BaseInputProps

export default function SelectInput({ label, placeholder, required, class:className, inputClass, children, options, ...rest }: SelectInputProps) {
  return (
    <label for={label} class={className} {...rest}> 
      {label}
      <select name={label} placeholder={placeholder} required={required} class={inputClass}>
        {
          options.map((option) => (
            <option value={option}>{option}</option>
          ))
        }
      </select>
      </label>
  )
}

