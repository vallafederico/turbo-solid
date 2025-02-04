import { access, readFile, writeFile } from "fs/promises";
import { TEMPLATES } from "../templates";

export const updateComponentProps = async (
  componentPath: string,
  fields: string[]
) => {
  const name = componentPath.split("/").pop()?.split(".")[0] || "";

  try {
    await access(componentPath);
    let content = await readFile(componentPath, { encoding: "utf-8" });
    const updates = TEMPLATES.componentUpdate(name, fields);

    content = content.replace(
      /interface\s+\w+Props\s*{[^}]*}/,
      updates.interface
    );
    content = content.replace(/function\s+\w+\(\{[^}]*\}/, updates.props);

    await writeFile(componentPath, content);
  } catch {
    await writeFile(componentPath, TEMPLATES.component(name, fields));
  }
};
