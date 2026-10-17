/** Escapes one CSV field per RFC 4180 and joins a row. */
export function toCsvRow(fields: (string | number | null | undefined)[]): string {
	return fields
		.map((field) => {
			const raw = field === null || field === undefined ? '' : String(field);
			const value = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
			return `"${value.replace(/"/g, '""')}"`;
		})
		.join(',');
}
