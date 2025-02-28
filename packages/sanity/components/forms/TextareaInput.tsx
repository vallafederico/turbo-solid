import { BaseInputProps } from "../../types"

type TextareaInputProps = {
  inputClass?: string
} & BaseInputProps

export default function TextareaInput({ label, placeholder, required, class: className, inputClass, ...rest }: TextareaInputProps) {


  return (
    <label for={label} class={className} {...rest}> 
      {label}
      <textarea rows={3} name={label} placeholder={placeholder} required={required} class={inputClass} />
    </label>
  )
} 