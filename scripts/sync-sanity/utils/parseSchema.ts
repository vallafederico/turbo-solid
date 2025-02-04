import { readFile } from "fs/promises";

export const parseSchemaFields = async (schemaPath: string) => {
  const content = await readFile(schemaPath, { encoding: "utf-8" });
  const fieldsMatch = content.match(/fields:\s*\[([\s\S]*?)\]/);

  if (!fieldsMatch) return [];

  const fieldsContent = fieldsMatch[1];
  const fieldMatches = fieldsContent.matchAll(
    /{[\s\S]*?name:\s*'([^']*)'[\s\S]*?}/g
  );

  return Array.from(fieldMatches).map((match) => match[1]);
};
