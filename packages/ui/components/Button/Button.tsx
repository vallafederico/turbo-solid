export default function Button({ label = "Button" }: { label: string }) {
	return (
		<button type="button" class="bg-blue-500 text-white px-4 py-2 rounded-md">
			{label}
		</button>
	);
}
