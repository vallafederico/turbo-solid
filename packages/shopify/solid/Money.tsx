import type { Money as MoneyType } from "../types";
import { formatMoney } from "../utils/money";

export type MoneyProps = {
	data?: MoneyType | null;
	locale?: string;
	class?: string;
};

export default function Money(props: MoneyProps) {
	const formatted = () => {
		if (!props.data) return "";
		return formatMoney(props.data, props.locale);
	};

	return <span class={props.class}>{formatted()}</span>;
}
