import type { Money } from "../types";

export function formatMoney(money: Money, locale = "en-CA"): string {
	const amount = Number.parseFloat(money.amount);
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: money.currencyCode,
	}).format(amount);
}
