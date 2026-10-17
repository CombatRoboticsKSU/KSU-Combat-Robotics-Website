import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

const storeId = BLOB_READ_WRITE_TOKEN.split('_')[3].toLowerCase();
export const blobStoreOrigin = `https://${storeId}.public.blob.vercel-storage.com`;
export const hazardDocumentPathname = /^hazard-docs\/[0-9a-f-]{36}-[A-Za-z0-9._-]{1,100}$/;
