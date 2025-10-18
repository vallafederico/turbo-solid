import { Flex } from "@sanity/ui";

export default function WindowControls() {
	const CONTROLS = [
		{ bg: "#ff5f57", title: "Close" },
		{ bg: "#ffbd2e", title: "Minimize" },
		{ bg: "#28c940", title: "Maximize" },
	];

	return (
		<Flex
			align="center"
			style={{
				gap: 6,

				paddingRight: 16,
			}}
		>
			{CONTROLS.map((c, i) => (
				<span
					key={i}
					title={c.title}
					style={{
						display: "inline-block",
						width: 11,
						height: 11,
						borderRadius: "50%",
						background: c.bg,
						border: "0.5px solid #bfbfbf",
						boxSizing: "border-box",
						boxShadow:
							i === 0
								? "0 0.5px 0.5px #c14545"
								: i === 2
									? "0 0.5px 0.5px #30993d"
									: "0 0.5px 0.5px #bfa350",
					}}
				/>
			))}
		</Flex>
	);
}
