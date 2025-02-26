export const getTypeForField = (type: string) => {
  switch (type) {
    case "string":
    case "text":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "any";
  }
};
