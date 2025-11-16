import { scroll, usePageTransition } from "@local/animation";
import { Nav } from "./Nav";

const GlobalLayout = ({ children, ...props }: { children: any }) => {
	usePageTransition();

	return (
		<>
			<Nav />
		
			<main use:scroll>{children}</main>
		</>
	);
};

export default GlobalLayout;
