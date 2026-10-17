const zeroDecimalCurrencies = new Set([
	'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga',
	'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'
]);

export function formatPrice(amount: number, currency: string) {
	const exponent = zeroDecimalCurrencies.has(currency.toLowerCase()) ? 0 : 2;
	return new Intl.NumberFormat(undefined, { style: 'currency', currency })
		.format(amount / 10 ** exponent);
}
