import { watch } from "fs";
import { join } from "path";
import { readFile, writeFile, access, mkdir } from "fs/promises";

import { TEMPLATES } from "./templates";
import { parseSchemaFields } from "./utils/parseSchema";
import { updateComponentProps } from "./utils/updateComponent";

/* -- TODOS
- [x] import and update in index.ts
- [x] delete index.ts

- [x] create component in apps/web
- [x] sync on chanhge component props and type
- [ ] move to web/apps

*/

/////////////////////////////// config

import { SANITY_SYNC_ENABLED, SANITY_SYNC_FOLDERS } from "../../config";

if (!SANITY_SYNC_ENABLED) {
  console.log("␖ SANITY SYNC DISABLED");
  process.exit(0);
}

console.log("␖ SANITY SYNC WATCHING");

const FILES = SANITY_SYNC_FOLDERS.map((folder) => ({
  entry: `../../${folder.entry}`,
  target: `../../${folder.target}`,
}));

/////////////////////////////// run

const processedFiles = new Set<string>();

// Watch each entry point
for (const { entry, target } of FILES) {
  const path = join(process.cwd(), entry);
  const files = watch(
    path,
    { recursive: true },
    async (eventType, filename) => {
      if (!filename || filename === "index.ts") return;
      const filePath = join(process.cwd(), entry, filename);

      try {
        await access(filePath);
        if (eventType === "rename" && !processedFiles.has(filename)) {
          await handleNewFile(filePath, filename, target, entry);
        } else if (processedFiles.has(filename)) {
          await handleModifiedFile(filePath, target);
        }
        processedFiles.add(filename);
      } catch {
        processedFiles.delete(filename);
        await handleDeletedFile(filename, entry);
        console.log(`File deleted: ${filename.split("/").pop()}`);
      }
    }
  );
}

const handleNewFile = async (
  filePath: string,
  filename: string,
  destination: string,
  entry: string
) => {
  const sliceName = filename.split(".")[0];
  const capitalizedName =
    sliceName.charAt(0).toUpperCase() + sliceName.slice(1);

  await writeFile(filePath, TEMPLATES.slice(sliceName));
  console.log(`Created schema file: ${filePath}`);

  try {
    const componentDir = join(process.cwd(), destination);
    await mkdir(componentDir, { recursive: true });
    const componentPath = join(componentDir, `${capitalizedName}.tsx`);

    const fields = await parseSchemaFields(filePath);
    await updateComponentProps(componentPath, fields);
    console.log(`Created/updated component file: ${componentPath}`);
  } catch (error) {
    console.error(`Error with component file:`, error);
  }

  // Update index.ts
  const indexPath = join(process.cwd(), entry, "index.ts");
  try {
    let indexContent = await readFile(indexPath, { encoding: "utf-8" });

    // Add import
    const importStatement = `import ${sliceName} from './${sliceName}'`;
    indexContent = indexContent.replace(
      /^(import.*\n)*/,
      `$&${importStatement}\n`
    );

    // Add to array
    indexContent = indexContent.replace(
      /const globalPageSlices = \[(.*?)\]/s,
      `const globalPageSlices = [$1, ${sliceName}]`
    );

    await writeFile(indexPath, indexContent);
    console.log(`Updated index.ts with ${sliceName}`);
  } catch (error) {
    console.error(`Error updating index.ts:`, error);
  }
};

const handleModifiedFile = async (filePath: string, destination: string) => {
  console.log(`File modified: ${filePath.split("/").pop()}`);

  try {
    const filename = filePath.split("/").pop() || "";
    const sliceName = filename.split(".")[0];
    const capitalizedName =
      sliceName.charAt(0).toUpperCase() + sliceName.slice(1);
    const componentPath = join(
      process.cwd(),
      destination,
      `${capitalizedName}.tsx`
    );

    const fields = await parseSchemaFields(filePath);
    await updateComponentProps(componentPath, fields);
    console.log(`Updated component props for: ${componentPath}`);
  } catch (error) {
    console.error(`Error updating component props:`, error);
  }
};

const handleDeletedFile = async (filename: string, entry: string) => {
  const sliceName = filename.split(".")[0];
  const indexPath = join(process.cwd(), entry, "index.ts");

  try {
    let indexContent = await readFile(indexPath, { encoding: "utf-8" });

    // Remove import
    indexContent = indexContent.replace(
      new RegExp(`import ${sliceName} from '\\.\\/${sliceName}'\\n`),
      ""
    );

    // Remove from array
    indexContent = indexContent.replace(
      new RegExp(`(${sliceName}\\s*,\\s*)|(,\\s*${sliceName})`),
      ""
    );

    await writeFile(indexPath, indexContent);
    console.log(`Removed ${sliceName} from index.ts`);
  } catch (error) {
    console.error(`Error updating index.ts:`, error);
  }
};
