import { blobStoreOrigin, botPhotoPathname, hazardDocumentPathname } from './blob';

export function readCompetitorEdits(form: FormData) {
	const text = (key: string) => typeof form.get(key) === 'string' ? String(form.get(key)).trim() : '';
	const values = {
		builderName: text('builderName'), phone: text('phone'), teamName: text('teamName'), botName: text('botName'),
		weaponType: text('weaponType'), notes: text('notes'), botPhotoUrl: text('botPhotoUrl'),
		hazardPneumatic: form.get('hazardPneumatic') === 'on', hazardHighMass: form.get('hazardHighMass') === 'on',
		hazardDocs: [] as { name: string; url: string }[]
	};
	if (!values.builderName || !values.botName) throw new Error('Builder name and bot name are required.');
	for (const key of ['builderName', 'phone', 'teamName', 'botName', 'weaponType'] as const) {
		if (values[key].length > 200) throw new Error('Names and contact fields must be 200 characters or fewer.');
	}
	if (values.notes.length > 5000) throw new Error('Notes must be 5,000 characters or fewer.');
	try {
		const photo = new URL(values.botPhotoUrl);
		if (photo.origin !== blobStoreOrigin || !botPhotoPathname.test(photo.pathname.slice(1))) throw new Error();
		const docs: unknown = JSON.parse(text('hazardDocs') || '[]');
		if (!Array.isArray(docs) || docs.length > 5) throw new Error();
		values.hazardDocs = docs.map(doc => {
			if (!doc || typeof doc.name !== 'string' || typeof doc.url !== 'string') throw new Error();
			const url = new URL(doc.url);
			if (!doc.name.trim() || doc.name.length > 200 || url.origin !== blobStoreOrigin || !hazardDocumentPathname.test(url.pathname.slice(1))) throw new Error();
			return { name: doc.name.trim(), url: url.href };
		});
	} catch { throw new Error('Use a valid uploaded bot photo and up to five technical documents.'); }
	if ((values.hazardPneumatic || values.hazardHighMass) && !values.hazardDocs.length) throw new Error('Hazard Bots require at least one technical document.');
	return values;
}

