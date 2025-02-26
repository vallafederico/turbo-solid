import { access, readFile, writeFile } from "fs/promises";
import { TEMPLATES } from "../templates";
import type { Field } from "../utils/parseSchema";
import { getTypeForField } from "./getTypeForField";

const parseExistingFields = (content: string): { [key: string]: boolean } => {
  const interfaceMatch = content.match(/interface\s+\w+Props\s*{([^}]*)}/);
  if (!interfaceMatch) return {};

  const fields: { [key: string]: boolean } = {};
  const fieldMatches = [
    ...interfaceMatch[1].matchAll(
      /\s+(\w+)\s*:\s*([^;\n]+?)(?:\s*\/\*\s*autogen\s*\*\/)?\s*(?:;|\n)/g
    ),
  ];

  for (const match of fieldMatches) {
    const [fullMatch, name] = match;
    fields[name] = fullMatch.includes("/* autogen */");
  }

  return fields;
};

export const updateComponentProps = async (
  componentPath: string,
  fields: Field[]
) => {
  const name = componentPath.split("/").pop()?.split(".")[0] || "";

  try {
    await access(componentPath);
    let content = await readFile(componentPath, { encoding: "utf-8" });
    const existingFields = parseExistingFields(content);

    const interfaceContent = fields
      .map((field) => {
        const shouldPreserve =
          field.name in existingFields && !existingFields[field.name];

        if (shouldPreserve) {
          const fieldMatch = content.match(
            new RegExp(`${field.name}\\s*:\\s*([^;]+?)\\s*;`, "m")
          );
          return `${field.name}: ${fieldMatch?.[1]?.trim() || "any"}`;
        }
        return `${field.name}: ${getTypeForField(field.type)} /* autogen */`;
      })
      .join(";\n    ");

    let newContent = content.replace(
      /interface\s+\w+Props\s*{[^}]*}/,
      `interface ${name}Props {\n    ${interfaceContent}\n}`
    );

    newContent = newContent.replace(
      /function\s+\w+\s*\(\s*{\s*[^}]*\s*}/,
      `function ${name}({ ${fields.map((f) => f.name).join(", ")} }`
    );

    await writeFile(componentPath, newContent);
  } catch (error) {
    const template = TEMPLATES.component(name, fields).replace(
      /(\w+)\s*:\s*[^;]+/g,
      "$& /* autogen */"
    );
    await writeFile(componentPath, template);
  }
};
