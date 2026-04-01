<script lang="ts">
	import { enhance } from '$app/forms';
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import { untrack } from 'svelte';

	let { data, form } = $props();

	// ── Sponsors ──────────────────────────────────────────────────
	let showSponsorForm = $state(false);
	let editingSponsor = $state<typeof data.sponsors[0] | null>(null);
	let sponsorImage = $state('');

	function openNewSponsor() {
		editingSponsor = null;
		sponsorImage = '';
		showSponsorForm = true;
	}

	function openEditSponsor(s: typeof data.sponsors[0]) {
		editingSponsor = s;
		sponsorImage = s.image;
		showSponsorForm = true;
	}

	function closeSponsorForm() {
		showSponsorForm = false;
		editingSponsor = null;
	}

	// ── Donations ────────────────────────────────────────────────
	let showDonationForm = $state(false);
	let editingDonation = $state<typeof data.donations[0] | null>(null);

	function openNewDonation() {
		editingDonation = null;
		showDonationForm = true;
	}

	function openEditDonation(d: typeof data.donations[0]) {
		editingDonation = d;
		showDonationForm = true;
	}

	function closeDonationForm() {
		showDonationForm = false;
		editingDonation = null;
	}

	// ── Letter ───────────────────────────────────────────────────
	let letterUrlValue = $state(untrack(() => data.letterUrl));
	let letterUploading = $state(false);
	let letterUploadError = $state('');

	async function uploadLetter(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		letterUploading = true;
		letterUploadError = '';
		try {
			const fd = new FormData();
			fd.append('file', file);
			fd.append('folder', 'documents');
			const res = await fetch('/api/upload', { method: 'POST', body: fd });
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.message ?? 'Upload failed');
			}
			const { url } = await res.json();
			letterUrlValue = url;
		} catch (err: any) {
			letterUploadError = err.message;
		} finally {
			letterUploading = false;
			input.value = '';
		}
	}
</script>

<svelte:head>
	<title>Sponsors | Admin</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<h1>Sponsors</h1>
	</div>

	{#if form?.success}
		<div class="alert-success">Saved successfully!</div>
	{/if}

	<!-- ── Sponsors ─────────────────────────────────────────────── -->
	<div class="section-header">
		<h2>Current Sponsors</h2>
		<button class="btn-admin primary" onclick={openNewSponsor}>+ Add Sponsor</button>
	</div>

	{#if showSponsorForm}
		<div class="form-card">
			<h3>{editingSponsor ? 'Edit Sponsor' : 'New Sponsor'}</h3>
			<form
				method="POST"
				action={editingSponsor ? '?/updateSponsor' : '?/createSponsor'}
				use:enhance={() => { return ({ result }) => { if (result.type !== 'failure') closeSponsorForm(); } }}
			>
				{#if editingSponsor}
					<input type="hidden" name="id" value={editingSponsor.id} />
				{/if}
				<div class="field-group">
					<label class="field-label" for="sName">Sponsor Name</label>
					<input id="sName" name="name" type="text" class="field-input" value={editingSponsor?.name ?? ''} required />
				</div>
				<div class="field-group">
					<label class="field-label" for="sLink">Website URL</label>
					<input id="sLink" name="link" type="url" class="field-input" value={editingSponsor?.link ?? ''} placeholder="https://" />
				</div>
				<div class="field-group">
					<ImageUpload bind:value={sponsorImage} name="image" folder="sponsors" label="Logo Image" />
				</div>
				<div class="field-group">
					<label class="field-label" for="sSortOrder">Sort Order</label>
					<input id="sSortOrder" name="sortOrder" type="number" class="field-input field-input-sm" value={editingSponsor?.sortOrder ?? 0} />
				</div>
				<div class="form-actions">
					<button type="submit" class="btn-admin primary">{editingSponsor ? 'Save Changes' : 'Add Sponsor'}</button>
					<button type="button" class="btn-admin ghost" onclick={closeSponsorForm}>Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	{#if data.sponsors.length === 0}
		<div class="empty-state">No sponsors yet.</div>
	{:else}
		<div class="items-list">
			{#each data.sponsors as sponsor}
				<div class="list-item">
					<div class="item-img-wrap">
						{#if sponsor.image}
							<img src={sponsor.image} alt={sponsor.name} />
						{:else}
							<div class="img-placeholder">No image</div>
						{/if}
					</div>
					<div class="item-info">
						<span class="item-name">{sponsor.name}</span>
						{#if sponsor.link}
							<a href={sponsor.link} target="_blank" rel="noopener noreferrer" class="item-sub">{sponsor.link}</a>
						{/if}
					</div>
					<div class="item-actions">
						<button class="btn-admin ghost sm" onclick={() => openEditSponsor(sponsor)}>Edit</button>
						<form method="POST" action="?/deleteSponsor" use:enhance>
							<input type="hidden" name="id" value={sponsor.id} />
							<button type="submit" class="btn-admin danger sm" onclick={(e) => { if (!confirm(`Delete ${sponsor.name}?`)) e.preventDefault(); }}>Delete</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- ── Donations ─────────────────────────────────────────────── -->
	<div class="section-header" style="margin-top: 3rem;">
		<h2>Recent Donations</h2>
		<button class="btn-admin primary" onclick={openNewDonation}>+ Add Donor</button>
	</div>

	{#if showDonationForm}
		<div class="form-card">
			<h3>{editingDonation ? 'Edit Donor' : 'New Donor'}</h3>
			<form
				method="POST"
				action={editingDonation ? '?/updateDonation' : '?/createDonation'}
				use:enhance={() => { return ({ result }) => { if (result.type !== 'failure') closeDonationForm(); } }}
			>
				{#if editingDonation}
					<input type="hidden" name="id" value={editingDonation.id} />
				{/if}
				<div class="field-group">
					<label class="field-label" for="dName">Donor Name</label>
					<input id="dName" name="name" type="text" class="field-input" value={editingDonation?.name ?? ''} required />
				</div>
				<div class="field-group">
					<label class="field-label" for="dSortOrder">Sort Order</label>
					<input id="dSortOrder" name="sortOrder" type="number" class="field-input field-input-sm" value={editingDonation?.sortOrder ?? 0} />
				</div>
				<div class="form-actions">
					<button type="submit" class="btn-admin primary">{editingDonation ? 'Save Changes' : 'Add Donor'}</button>
					<button type="button" class="btn-admin ghost" onclick={closeDonationForm}>Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	{#if data.donations.length === 0}
		<div class="empty-state">No donations listed yet.</div>
	{:else}
		<div class="items-list">
			{#each data.donations as donor}
				<div class="list-item">
					<div class="item-info">
						<span class="item-name">{donor.name}</span>
					</div>
					<div class="item-actions">
						<button class="btn-admin ghost sm" onclick={() => openEditDonation(donor)}>Edit</button>
						<form method="POST" action="?/deleteDonation" use:enhance>
							<input type="hidden" name="id" value={donor.id} />
							<button type="submit" class="btn-admin danger sm" onclick={(e) => { if (!confirm(`Remove ${donor.name}?`)) e.preventDefault(); }}>Delete</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- ── Sponsorship Letter ─────────────────────────────────────── -->
	<div class="section-header" style="margin-top: 3rem;">
		<h2>Sponsorship Letter / Packet</h2>
	</div>
	<div class="form-card">
		<p class="help-text" style="margin-bottom: 1.25rem;">PDF linked from the "View Sponsorship Packet" button on the sponsors page.</p>

		{#if letterUrlValue}
			<div class="letter-current">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
				<a href={letterUrlValue} target="_blank" rel="noopener noreferrer" class="letter-link">Current PDF</a>
			</div>
		{/if}

		{#if letterUploadError}
			<div class="alert-error" style="margin-bottom: 1rem;">{letterUploadError}</div>
		{/if}

		<div class="field-group">
			<label class="field-label" for="letterFileInput">Upload New PDF</label>
			<input id="letterFileInput" type="file" accept="application/pdf" onchange={uploadLetter} disabled={letterUploading} hidden />
			<button type="button" class="upload-btn {letterUploading ? 'uploading' : ''}" onclick={() => document.getElementById('letterFileInput')?.click()} disabled={letterUploading}>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
				{letterUploading ? 'Uploading…' : 'Choose PDF'}
			</button>
		</div>

		<form method="POST" action="?/updateLetter" use:enhance>
			<input type="hidden" name="letterUrl" bind:value={letterUrlValue} />
			<button type="submit" class="btn-admin primary" disabled={!letterUrlValue}>Save</button>
		</form>
	</div>
</div>

<style>
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 2.5rem;
		border-bottom: 1px solid rgba(255,255,255,0.05);
		padding-bottom: 1.5rem;
	}

	.page-header h1 {
		font-size: 1.875rem;
		font-weight: 700;
		color: #fff;
	}

	.alert-success {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.3);
		color: #4ade80;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.section-header h2 {
		font-size: 1.125rem;
		font-weight: 600;
		color: #fff;
	}

	.form-card {
		background: #1e293b;
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.form-card h3 {
		font-size: 1rem;
		font-weight: 600;
		color: #fff;
		margin-bottom: 1.25rem;
	}

	.field-group {
		margin-bottom: 1.25rem;
	}

	.field-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: #cbd5e1;
		margin-bottom: 0.5rem;
	}

	.field-input {
		width: 100%;
		background: rgba(255,255,255,0.05);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 0.5rem;
		padding: 0.625rem 0.875rem;
		color: #fff;
		font-size: 0.9375rem;
		box-sizing: border-box;
		transition: border-color 0.2s;
	}

	.field-input:focus {
		outline: none;
		border-color: var(--gold);
	}

	.field-input-sm {
		max-width: 120px;
	}

	.form-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.items-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.list-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: #1e293b;
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 0.75rem;
		padding: 0.875rem 1rem;
	}

	.item-img-wrap {
		width: 72px;
		height: 48px;
		background: white;
		border-radius: 0.375rem;
		overflow: hidden;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.item-img-wrap img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.img-placeholder {
		font-size: 0.6875rem;
		color: #94a3b8;
	}

	.item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}

	.item-name {
		font-weight: 600;
		color: #fff;
		font-size: 0.9375rem;
	}

	.item-sub {
		font-size: 0.8125rem;
		color: var(--text-muted);
		text-decoration: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-sub:hover {
		color: var(--gold);
	}

	.item-actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.empty-state {
		color: var(--text-muted);
		font-size: 0.9375rem;
		padding: 2rem;
		text-align: center;
		background: #1e293b;
		border: 1px dashed rgba(255,255,255,0.08);
		border-radius: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.help-text {
		font-size: 0.8125rem;
		color: var(--text-muted);
	}

	.letter-current {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.letter-link {
		color: var(--gold);
		text-decoration: none;
	}

	.letter-link:hover { text-decoration: underline; }

	.alert-error {
		background: rgba(239,68,68,0.1);
		border: 1px solid rgba(239,68,68,0.3);
		color: #f87171;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
	}

	.upload-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		background: rgba(255,255,255,0.06);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 0.5rem;
		color: var(--text-secondary);
		font-size: 0.9375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.upload-btn:hover:not(:disabled) {
		background: rgba(255,255,255,0.1);
		color: #fff;
	}

	.upload-btn.uploading, .upload-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Buttons */
	.btn-admin {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.625rem 1.25rem;
		border-radius: 0.5rem;
		font-size: 0.9375rem;
		font-weight: 600;
		cursor: pointer;
		border: 1px solid transparent;
		transition: all 0.2s;
		background: transparent;
		text-decoration: none;
	}

	.btn-admin.primary {
		background: var(--gold);
		color: #000;
		border-color: var(--gold);
	}

	.btn-admin.primary:hover { background: #d4981a; }

	.btn-admin.ghost {
		background: rgba(255,255,255,0.06);
		color: var(--text-secondary);
		border-color: rgba(255,255,255,0.1);
	}

	.btn-admin.ghost:hover {
		background: rgba(255,255,255,0.1);
		color: #fff;
	}

	.btn-admin.danger {
		background: rgba(239,68,68,0.1);
		color: #f87171;
		border-color: rgba(239,68,68,0.2);
	}

	.btn-admin.danger:hover {
		background: rgba(239,68,68,0.2);
	}

	.btn-admin.sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
	}
</style>
