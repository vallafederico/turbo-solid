import { SLICE_TEMPLATES } from "./templates/slices";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { parseSchemaFields } from "../utils/parseSchema";
import { updateComponentProps } from "../utils/updateComponent";

type NewFileHandler = (params: {
  filePath: string;
  filename: string;
  sliceName: string;
  capitalizedName: string;
  destination: string;
  entry: string;
}) => Promise<void>;

export const handleNewFile = async (
  filePath: string,
  filename: string,
  destination: string,
  entry: string,
  handler?: NewFileHandler
) => {
  const sliceName = filename.split(".")[0];
  const capitalizedName =
    sliceName.charAt(0).toUpperCase() + sliceName.slice(1);

  await writeFile(filePath, SLICE_TEMPLATES.slice(sliceName));
  console.log(`Created schema file: ${filePath}`);

  try {
    if (handler) {
      await handler({
        filePath,
        filename,
        sliceName,
        capitalizedName,
        destination,
        entry,
      });
    } else {
      // Default component creation behavior
      const componentDir = join(process.cwd(), destination);
      await mkdir(componentDir, { recursive: true });
      const componentPath = join(componentDir, `${capitalizedName}.tsx`);

      const fields = await parseSchemaFields(filePath);
      await updateComponentProps(componentPath, fields);
      console.log(`Created/updated component file: ${componentPath}`);

      // Create or update target folder index.ts
      const targetIndexPath = join(componentDir, "index.ts");
      let targetIndexContent = "";

      try {
        targetIndexContent = await readFile(targetIndexPath, {
          encoding: "utf-8",
        });
      } catch (error) {
        // File doesn't exist, create new content
        targetIndexContent = "export const SLICE_LIST = {};\n";
      }

      // Add import if it doesn't exist
      const importStatement = `import ${capitalizedName} from "./${capitalizedName}";`;
      if (!targetIndexContent.includes(importStatement)) {
        targetIndexContent = `${importStatement}\n${targetIndexContent}`;
      }

      // Update or add to SLICE_LIST
      if (targetIndexContent.includes("export const SLICE_LIST")) {
        // If SLICE_LIST exists, add new entry if not present
        if (!targetIndexContent.includes(`${sliceName}: ${capitalizedName}`)) {
          targetIndexContent = targetIndexContent.replace(
            /export const SLICE_LIST = {/,
            `export const SLICE_LIST = {\n  ${sliceName}: ${capitalizedName},`
          );
        }
      } else {
        // Create new SLICE_LIST
        targetIndexContent += `\nexport const SLICE_LIST = {\n  ${sliceName}: ${capitalizedName},\n};\n`;
      }

      await writeFile(targetIndexPath, targetIndexContent);
      console.log(`Updated target index.ts with ${sliceName}`);

      // Update main index.ts
      const indexPath = join(process.cwd(), entry, "index.ts");
      let indexContent = await readFile(indexPath, { encoding: "utf-8" });

      // Add import
      const mainImportStatement = `import ${sliceName} from './${sliceName}'`;
      indexContent = indexContent.replace(
        /^(import.*\n)*/,
        `$&${mainImportStatement}\n`
      );

      // Add to array
      indexContent = indexContent.replace(
        /const globalPageSlices = \[(.*?)\]/s,
        `const globalPageSlices = [$1, ${sliceName}]`
      );

      await writeFile(indexPath, indexContent);
      console.log(`Updated index.ts with ${sliceName}`);
    }
  } catch (error) {
    console.error(`Error handling new file:`, error);
  }
};

type ModifiedFileHandler = (params: {
  filePath: string;
  filename: string;
  sliceName: string;
  capitalizedName: string;
  destination: string;
}) => Promise<void>;

type DeletedFileHandler = (params: {
  filename: string;
  sliceName: string;
  entry: string;
}) => Promise<void>;

export const handleModifiedFile = async (
  filePath: string,
  destination: string,
  handler?: ModifiedFileHandler
) => {
  console.log(`File modified: ${filePath.split("/").pop()}`);

  try {
    const filename = filePath.split("/").pop() || "";
    const sliceName = filename.split(".")[0];
    const capitalizedName =
      sliceName.charAt(0).toUpperCase() + sliceName.slice(1);

    if (handler) {
      await handler({
        filePath,
        filename,
        sliceName,
        capitalizedName,
        destination,
      });
    } else {
      // Default behavior
      const componentPath = join(
        process.cwd(),
        destination,
        `${capitalizedName}.tsx`
      );
      const fields = await parseSchemaFields(filePath);
      await updateComponentProps(componentPath, fields);
      console.log(`Updated component props for: ${componentPath}`);
    }
  } catch (error) {
    console.error(`Error handling modified file:`, error);
  }
};

export const handleDeletedFile = async (
  filename: string,
  entry: string,
  handler?: DeletedFileHandler
) => {
  const sliceName = filename.split(".")[0];

  try {
    if (handler) {
      await handler({
        filename,
        sliceName,
        entry,
      });
    } else {
      // Default behavior
      const indexPath = join(process.cwd(), entry, "index.ts");
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
    }
  } catch (error) {
    console.error(`Error handling deleted file:`, error);
  }
};
