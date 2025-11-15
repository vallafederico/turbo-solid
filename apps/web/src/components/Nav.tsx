import { A } from "@solidjs/router";
import { For } from "solid-js";
import { RollingText } from "./animation/RollingText";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
	{
		to: "/_/about",
		text: "About",
	},
	{
		to: "/_/animation",
		text: "Animation",
	},
	{
		to: "/_/components",
		text: "Components",
	},
	{
		to: "/_/webgl",
		text: "WebGl",
	},
	{
		to: "/_/data-loading",
		text: "Data",
	},
	{
		to: "/_/content",
		text: "CMS Content",
	},
];

export const Nav = () => {
	return (
		<nav class="px-margin-1 pointer-events-none fixed top-0 left-0 z-100 flex w-screen items-center justify-between py-6">
			<A aria-label="homepage" class="pointer-events-auto z-20" href="/">
				<p>LOGO</p>
			</A>

			{/* desktop menu */}
			<ul class="pointer-events-auto hidden justify-between md:flex">
				<For each={NAV_LINKS}>
					{({ to, text }) => (
						<li>
							<A href={to}>
								<RollingText class="px-3">{text}</RollingText>
							</A>
						</li>
					)}
				</For>
			</ul>

			{/* mobile menu */}
			<MobileMenu>
				<ul class="flex flex-col gap-4">
					<For each={NAV_LINKS}>
						{({ to, text }) => (
							<li>
								<A href={to}>{text}</A>
							</li>
						)}
					</For>
				</ul>
			</MobileMenu>
		</nav>
	);
};

//
