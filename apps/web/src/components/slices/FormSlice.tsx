import {
  SanityComponents,
  SelectInput,
  TextareaInput,
  TextInput,
} from "@local/sanity";

interface FormSliceProps {
  text: string /* autogen */;
  fields: any /* autogen */;
  textareaInput: any /* autogen */;
}

export default function FormSlice({ text, fields }: FormSliceProps) {
  const fieldList = {
    textInput: TextInput,
    selectInput: SelectInput,
    textareaInput: TextareaInput,
  };

  return (
    <div>
      <h2>{text}</h2>
      <form class="flex flex-col gap-4 [&>input]:w-full [&>label]:flex [&>label]:flex-col [&>label]:gap-1">
        <SanityComponents components={fields} componentList={fieldList} />
      </form>
    </div>
  );
}
