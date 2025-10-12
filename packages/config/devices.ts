// MAKE INTO VIEWPORT CLASS AT SAME POINT

// import fs from "node:fs";
// import path from "node:path";

// export type Device = {
// 	width: number;
// 	columns: number;
// 	gutter: number;
// 	margin: number;
// };

// export const maxScalingWidth = 2600;

// export const devices: Record<string, Device> = {
// 	xl: {
// 		width: 1440,
// 		columns: 12,
// 		gutter: 10,
// 		margin: 10,
// 	},
// 	lg: {
// 		width: 1024,
// 		columns: 12,
// 		gutter: 10,
// 		margin: 10,
// 	},
// 	md: {
// 		width: 768,
// 		columns: 6,
// 		gutter: 10,
// 		margin: 10,
// 	},
// 	sm: {
// 		width: 480,
// 		columns: 6,
// 		gutter: 10,
// 		margin: 10,
// 	},
// };

// export type Devices = (typeof devices)[keyof typeof devices];

// export function generateDevicesCss(outputPath: string) {
// 	const lines: string[] = [`.devices-info {`];
// 	for (const [key, device] of Object.entries(devices)) {
// 		const isLargest = Object.keys(devices).indexOf(key) === 0;
// 		const isSmallest =
// 			Object.keys(devices).indexOf(key) === Object.keys(devices).length - 1;

// 		if (isLargest) {
// 			lines.push(`
//           @theme {
//             ${Object.entries(devices).map(([key, device], index) => {
// 							return `
//                   --spacing-cols-${index}: calc(var(--grid-column-width) * ${device.columns} + var(--grid-gutter) * ${device.columns - 1});
//                 `;
// 						})}
//           }     
//         `);
// 		}

// 		lines.push(
// 			`
//       @media screen and (${isLargest ? "min-width" : "max-width"}: ${device.width}px) {

//         html {
//           --margin: ${device.margin / 10}rem;
//           --column-count: ${device.columns};
//           --gutter: ${device.gutter / 10}rem;
//         }
      
//       }
//       `,
// 			// `  --${key}-columns: ${device.columns};`,
// 			// `  --${key}-gutter: ${device.gutter}px;`,
// 			// `  --${key}-margin: ${device.margin}px;`,
// 		);
// 	}
// 	lines.push("}");

// 	const cssContent = lines.join("\n");
// 	fs.writeFileSync(path.resolve(outputPath), cssContent, "utf8");
// 	return cssContent;
// }
