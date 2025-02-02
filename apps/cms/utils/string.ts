export const snakeToCamelCase = (str: string) => {
  return str.replace(/^_*(.)|_+(.)/g, (s, c, d) => (c ? c.toUpperCase() : ' ' + d.toUpperCase()))
}

