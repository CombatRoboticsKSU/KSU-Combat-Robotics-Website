<script lang="ts">
	import { enhance } from '$app/forms';
	import { upload } from '@vercel/blob/client';
	import { tick } from 'svelte';
	import type { PageData } from './$types';
	let { registration, open }: { registration: PageData['registrations'][number]; open: boolean } = $props();
	// Keep entered fields and attachments in place after a validation error.
	// svelte-ignore state_referenced_locally
	let values = $state({ ...registration, hazardDocs: [...registration.hazardDocs] });
	let busy = $state(false);
	let uploading = $state(false);
	let uploadError = $state('');
	async function addFiles(event: Event, photo: boolean) {
		const input = event.currentTarget as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		uploadError = '';
		if (!photo && values.hazardDocs.length + files.length > 5) { uploadError = 'Upload no more than five technical documents.'; input.value = ''; return; }
		uploading = true;
		try {
			for (const file of files) {
				const allowed = photo ? ['image/png', 'image/jpeg', 'image/webp'] : ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
				if (!allowed.includes(file.type) || file.size > 10 * 1024 * 1024) throw new Error('Choose a supported file up to 10 MB.');
				const name = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80) || 'upload';
				const blob = await upload(`${photo ? 'bot-photos' : 'hazard-docs'}/${crypto.randomUUID()}-${name}`, file, { access: 'public', handleUploadUrl: '/api/upload/hazard' });
				if (photo) values.botPhotoUrl = blob.url;
				else values.hazardDocs = [...values.hazardDocs, { name: file.name.trim().slice(0, 200), url: blob.url }];
			}
		} catch (e) { uploadError = e instanceof Error ? e.message : 'Upload failed. Try again.'; }
		finally { uploading = false; input.value = ''; }
	}
</script>

<form method="POST" action="?/save" class="entry card" use:enhance={() => {
	busy = true;
	return async ({ result, update }) => {
		try {
			await update({ reset: false });
			if (result.type === 'success') {
				await tick();
				values = { ...registration, hazardDocs: [...registration.hazardDocs] };
			}
		} finally { busy = false; }
	};
}}>
	<h2>{registration.botName}</h2>
	<p class="muted">Registered email: {registration.email}. Contact event staff to change this address.</p>
	<input type="hidden" name="id" value={registration.id} />
	<input type="hidden" name="revision" value={values.revision} />
	<input type="hidden" name="botPhotoUrl" value={values.botPhotoUrl} />
	<input type="hidden" name="hazardDocs" value={JSON.stringify(values.hazardDocs)} />
	<fieldset disabled={!open || busy || uploading}>
		<div class="fields">
			<label>Builder name<input name="builderName" bind:value={values.builderName} required maxlength="200" autocomplete="name" /></label>
			<label>Phone<input name="phone" type="tel" bind:value={values.phone} maxlength="200" autocomplete="tel" /></label>
			<label>Team name<input name="teamName" bind:value={values.teamName} maxlength="200" /></label>
			<label>Bot name<input name="botName" bind:value={values.botName} required maxlength="200" /></label>
			<label>Weapon type<input name="weaponType" bind:value={values.weaponType} maxlength="200" /></label>
		</div>
		<label>Notes<textarea name="notes" bind:value={values.notes} rows="4" maxlength="5000"></textarea></label>
		<div class="attachments">
			<h3>Bot photo</h3>
			<img src={values.botPhotoUrl} alt="Current bot" class="bot-photo" />
			<label>Replace bot photo<input type="file" accept="image/png,image/jpeg,image/webp" onchange={e => addFiles(e, true)} /></label>
			<p class="muted">PNG, JPEG or WebP, up to 10 MB.</p>
			<h3>Hazard Bot details</h3>
			<label class="checkbox"><input name="hazardPneumatic" type="checkbox" bind:checked={values.hazardPneumatic} /> Uses pneumatics</label>
			<label class="checkbox"><input name="hazardHighMass" type="checkbox" bind:checked={values.hazardHighMass} /> Weapon exceeds 50% of robot weight</label>
			<p class="muted">Changes to a Hazard Bot’s weapon, photo, hazard declarations, or technical documents require a new technical review.</p>
			<ul>{#each values.hazardDocs as doc, i}<li><a href={doc.url} target="_blank" rel="noreferrer">{doc.name}</a> <button type="button" onclick={() => values.hazardDocs = values.hazardDocs.filter((_, index) => index !== i)}>Remove attachment</button></li>{/each}</ul>
			<label>Add technical documents<input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" multiple onchange={e => addFiles(e, false)} /></label>
			<p class="muted">Up to five PDFs or images, 10 MB each. At least one is required for a Hazard Bot.</p>
		</div>
	</fieldset>
	{#if uploadError}<p role="alert">{uploadError}</p>{/if}
	{#if uploading}<p role="status">Uploading…</p>{/if}
	<button class="btn btn-primary" disabled={!open || busy || uploading}>{busy ? 'Saving…' : 'Save registration'}</button>
</form>

<style>
	.entry{padding:1.5rem;margin-top:1.5rem}h2{margin-bottom:.5rem}h3{margin:1.25rem 0 .75rem}.muted{color:var(--text-secondary);line-height:1.6;font-size:.9rem}fieldset{border:0;padding:0;margin:1rem 0}.fields{display:grid;grid-template-columns:1fr 1fr;gap:1rem}label{display:grid;gap:.5rem;margin-bottom:1rem;font-weight:600}input,textarea{width:100%;box-sizing:border-box;background:var(--bg-secondary);color:var(--text-primary);border:1px solid var(--border-color,#475569);border-radius:8px;padding:.75rem;font:inherit}input:focus-visible,textarea:focus-visible{outline:2px solid var(--gold);outline-offset:2px}.checkbox{display:flex;align-items:center}.checkbox input{width:auto}.bot-photo{width:140px;height:120px;object-fit:cover;border-radius:8px;margin-bottom:1rem}li{margin:.75rem 0;overflow-wrap:anywhere}li button{margin-left:.5rem;padding:.4rem;cursor:pointer}button:disabled{opacity:.6;cursor:default}@media(max-width:600px){.fields{grid-template-columns:1fr}.entry{padding:1.125rem}}
</style>
