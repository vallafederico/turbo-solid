import { Title } from "@solidjs/meta";
import { animateAlpha } from "~/animation/alpha.js";
import Section from "~/components/Section";

const logEnv = () => {
	"use server";
	console.log("SERVER_ENV", process.env.SERVER_ENV);
	console.log("VITE_CLIENT_ENV", import.meta.env.VITE_CLIENT_ENV);
};

export default function Env() {
	logEnv();

	return (
		<div class="min-h-[100vh] pt-20">
			<Title>Env</Title>
			<Section class="px-margin-1 h-[50vh]">
				<h1 use:animateAlpha>Env</h1>

				<p>SERVER ENV: {import.meta.env.SERVER_ENV}</p>
				<p>CLIENT ENV: {import.meta.env.VITE_CLIENT_ENV}</p>
			</Section>
		</div>
	);
}
