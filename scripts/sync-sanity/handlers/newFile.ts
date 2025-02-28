import { join } from "path";
import { writeFile, mkdir, readFile } from "fs/promises";
import { TEMPLATES } from "../templates";
import { parseSchemaFields } from "../utils/parseSchema";
import { updateComponentProps } from "../utils/updateComponent";

export const handleNewFile = async (
  filePath: string,
  filename: string,
  destination: string,
  entry: string
) => {
  // ... existing handleNewFile code ...
};
