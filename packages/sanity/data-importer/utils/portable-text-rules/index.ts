// export const imageRule = () => { }

// type PortableTextRulePreset = 'img'

// export const portableTextRule = (htmlTag: PortableTextRulePreset) => {
//   const obj = {}

//   switch (htmlTag) {
//     case 'img':
//       obj[htmlTag] = (el, next, block) => {
//         const imagePath = cleanUrl(`${__dirname}/import-images/${basename(el.src)}`)

//         return existsSync(imagePath) ? createImage(imagePath, richTextImageSchema) : null
//       }
//       break
//     default:
//       break
//   }

//   return obj
// }
