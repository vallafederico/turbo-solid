import { JSX } from "solid-js"
import { BaseInputProps } from "../../types"

type TextInputProps = {
  autocomplete?: string
  inputClass?: string
  validation?: 'email' | 'url' | 'number' | 'none' | ''

} & BaseInputProps

export default function TextInput({ class: className, label, autocomplete,  placeholder, required, validation, inputClass, ...rest }: TextInputProps) {

  const autocompleteValidation = {
    'email': 'email',
    'url': 'url',
    'number': 'number',
    'none': 'off',
  } as Record<string, string>

  const fieldType = validation === 'none' ? 'text' : validation
  const auto = validation === 'none' ? (autocomplete ? autocompleteValidation[autocomplete] : 'off') : validation

  return (
    <label for={label} class={className}>
      {label}
      <input type={fieldType}
      name={label}    
      placeholder={placeholder}
      required={required}
      class={inputClass}
      autocomplete={auto}
      />
    </label>
  )
}
