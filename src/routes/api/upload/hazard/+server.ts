import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { botPhotoPathname, hazardDocumentPathname } from '$lib/server/blob';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Configure per-IP rate limiting as a Vercel WAF rule on /api/upload/hazard.
// Serverless instances do not share memory, so an in-memory limiter is insufficient.
// Also issues bot photo tokens so registration uploads share that one WAF rule.
export const POST: RequestHandler = async ({ request }) => {
	const invalidPathname = new Error('Invalid document pathname.');
	try {
		const body: HandleUploadBody = await request.json();
		const result = await handleUpload({
			body,
			request,
			token: BLOB_READ_WRITE_TOKEN,
			onBeforeGenerateToken: async (pathname) => {
				const isPhoto = botPhotoPathname.test(pathname);
				if (!isPhoto && !hazardDocumentPathname.test(pathname)) {
					throw invalidPathname;
				}
				return {
					allowedContentTypes: isPhoto
						? ['image/png', 'image/jpeg', 'image/webp']
						: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
					maximumSizeInBytes: 10 * 1024 * 1024,
					addRandomSuffix: false,
					allowOverwrite: false,
					validUntil: Date.now() + 5 * 60 * 1000
				};
			}
		});
		return json(result);
	} catch (e) {
		console.error('Hazard document upload failed', e);
		return json({ error: e === invalidPathname ? invalidPathname.message : 'Could not upload document.' }, { status: 400 });
	}
};
