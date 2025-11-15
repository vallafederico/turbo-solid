import { Title } from "@solidjs/meta";
// import DomGroupElement from "~/gl/domGroup/DomGroupElement";
import DomQuadElement from "~/gl/_/domQuad/DomQuadElement";
import Section from "../../../components/Section";

export default function WebGl() {
	return (
		<div class="min-h-[100vh]">
			<Title>Home</Title>

			<Section class="flex gap-6 h-screen flex-center px-margin-1">
				<DomQuadElement />
			</Section>
			<Section class="flex gap-6 h-screen flex-center px-margin-1">
				<DomQuadElement />
			</Section>
			<Section class="flex gap-6 h-screen flex-center px-margin-1">
				<DomQuadElement />
			</Section>
		</div>
	);
}
