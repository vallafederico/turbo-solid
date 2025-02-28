import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { PAGE_TEMPLATES } from "./src/templates/pages";

type NewPageHandler = (params: {
  filePath: string;
  filename: string;
  pageName: string;
  capitalizedName: string;
  destination: string;
  entry: string;
}) => Promise<void>;

export const handleNewPage = async (
  filePath: string,
  filename: string,
  destination: string,
  entry: string,
  handler?: NewPageHandler
) => {
  const pageName = filename.split(".")[0];
  const capitalizedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  await writeFile(filePath, PAGE_TEMPLATES.page(pageName, capitalizedName));
  console.log(`Created page schema file: ${filePath}`);

  try {
    if (handler) {
      await handler({
        filePath,
        filename,
        pageName,
        capitalizedName,
        destination,
        entry,
      });
    } else {
      // Update index.ts
      const indexPath = join(process.cwd(), entry, "index.ts");
      let indexContent = await readFile(indexPath, { encoding: "utf-8" });

      // Add import
      const importStatement = `import ${pageName} from './${pageName}'`;
      indexContent = indexContent.replace(
        /^(import.*\n)*/,
        `$&${importStatement}\n`
      );

      // Add to array
      indexContent = indexContent.replace(
        /export default \[(.*?)\]/s,
        `export default [$1, ${pageName}]`
      );

      await writeFile(indexPath, indexContent);
      console.log(`Updated index.ts with ${pageName}`);
    }
  } catch (error) {
    console.error(`Error handling new page:`, error);
  }
};

type DeletedPageHandler = (params: {
  filename: string;
  pageName: string;
  entry: string;
}) => Promise<void>;

export const handleDeletedPage = async (
  filename: string,
  entry: string,
  handler?: DeletedPageHandler
) => {
  const pageName = filename.split(".")[0];

  try {
    if (handler) {
      await handler({
        filename,
        pageName,
        entry,
      });
    } else {
      // Default behavior
      const indexPath = join(process.cwd(), entry, "index.ts");
      let indexContent = await readFile(indexPath, { encoding: "utf-8" });

      // Remove import
      indexContent = indexContent.replace(
        new RegExp(`import ${pageName} from '\\.\\/${pageName}'\\n`),
        ""
      );

      // Remove from array
      indexContent = indexContent.replace(
        new RegExp(`(${pageName}\\s*,\\s*)|(,\\s*${pageName})`),
        ""
      );

      await writeFile(indexPath, indexContent);
      console.log(`Removed ${pageName} from index.ts`);
    }
  } catch (error) {
    console.error(`Error handling deleted page:`, error);
  }
};
