import { getTypeForField } from "../../utils/getTypeForField";

interface Field {
  name: string;
  type: string;
}

export const SLICE_TEMPLATES = {
  slice: (name: string) => {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    return `import {createPreview} from '../../utils/preview'

export default {
    name: '${name}',
    icon: null,
    type: 'object',
    fields: [
        {
        name: 'text',
        type: 'text',
        rows: 1,
        },
    ],
    preview: createPreview('{${capitalizedName}}'),
}`;
  },

  component: (name: string, fields: Field[]) => {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    return `interface ${capitalizedName}Props {
    ${fields.map((field) => `${field.name}: ${getTypeForField(field.type)}`).join(";\n    ")};
}

export default function ${capitalizedName}({ ${fields.map((f) => f.name).join(", ")} }: ${capitalizedName}Props) {
  return (
    <div>
      <h2>${capitalizedName} Slice</h2>
    </div>
  )
}`;
  },

  componentUpdate: (name: string, fields: Field[]) => {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    return {
      interface: `interface ${capitalizedName}Props {
    ${fields.map((field) => `${field.name}: ${getTypeForField(field.type)}`).join(";\n    ")};
}`,
      props: `function ${capitalizedName}({ ${fields.map((f) => f.name).join(", ")} }`,
    };
  },
};
