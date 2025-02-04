import { watch } from "fs";
import { join } from "path";
import { readFile, writeFile, access } from "fs/promises";

console.log("SANITY SYNC WATCHING ...");

/* -- TODOS
- [x] import and update in index.ts
- [x] delete index.ts

- [ ] create component in apps/web
- [ ] sync on chanhge component props and type

*/

const ENTRYPOINTS = ["../../apps/cms/schemas/slices"];
// const DESTINATIONS = ["../../apps/web/src/components/slices"];

const processedFiles = new Set<string>();

for (const entrypoint of ENTRYPOINTS) {
  const path = join(process.cwd(), entrypoint);
  const files = watch(
    path,
    { recursive: true },
    async (eventType, filename) => {
      if (!filename) return;
      const filePath = join(process.cwd(), entrypoint, filename);

      try {
        await access(filePath);
        if (eventType === "rename" && !processedFiles.has(filename)) {
          await handleNewFile(filePath, filename);
        } else if (processedFiles.has(filename)) {
          handleModifiedFile(filePath);
        }
        processedFiles.add(filename);
      } catch {
        processedFiles.delete(filename);
        await handleDeletedFile(filename);
        console.log(`File deleted: ${filename.split("/").pop()}`);
      }
    }
  );
}

const handleNewFile = async (filePath: string, filename: string) => {
  const sliceName = filename.split(".")[0];

  // Create the slice file
  const sliceTemplate = createSliceTemplate(sliceName);
  await writeFile(filePath, sliceTemplate);
  console.log(`Created schema file: ${filePath}`);

  // Update index.ts
  const indexPath = join(process.cwd(), ENTRYPOINTS[0], "index.ts");
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

const handleModifiedFile = (filePath: string) => {
  console.log(`File modified: ${filePath.split("/").pop()}`);
};

const handleDeletedFile = async (filename: string) => {
  const sliceName = filename.split(".")[0];
  const indexPath = join(process.cwd(), ENTRYPOINTS[0], "index.ts");

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

/* Templates */
const createSliceTemplate = (name: string) => {
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
}
`;
};

const createSliceComponentTemplate = (name: string) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return `import { createPreview } from '../../utils/preview';

interface SliceNameProps {}

export default function ${capitalizedName}Slice({ data }) {
  return <div>Hello</div>;
}
`;
};
