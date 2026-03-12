import { put, del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
	'image/svg+xml',
	'video/mp4',
	'video/webm'
];

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Unauthorized');
	}

	const form = await request.formData();
	const file = form.get('file') as File | null;
	const folder = (form.get('folder') as string) || 'uploads';

	if (!file || !(file instanceof File)) {
		throw error(400, 'No file provided');
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		throw error(400, `File type ${file.type} not allowed`);
	}

	if (file.size > MAX_SIZE) {
		throw error(400, 'File too large (max 10 MB)');
	}

	const ext = file.name.split('.').pop() || 'bin';
	const safeName = file.name
		.replace(/\.[^.]+$/, '')
		.replace(/[^a-zA-Z0-9_-]/g, '_')
		.slice(0, 60);
	const pathname = `${folder}/${safeName}-${Date.now()}.${ext}`;

	const blob = await put(pathname, file, {
		access: 'public',
		token: BLOB_READ_WRITE_TOKEN
	});

	return json({ url: blob.url });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Unauthorized');
	}

	const { url } = await request.json();
	if (!url) throw error(400, 'No URL provided');

	await del(url, { token: BLOB_READ_WRITE_TOKEN });
	return json({ success: true });
};
