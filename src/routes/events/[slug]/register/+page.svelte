<script lang="ts">
	import { page } from '$app/state';
	import { ArrowRight, ShieldAlert, FileText, Check, Upload, X } from 'lucide-svelte';
	import { upload } from '@vercel/blob/client';
	import WaiverModal from '$lib/components/WaiverModal.svelte';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	const canceled = $derived(page.url.searchParams.get('canceled') !== null);

	let waiverModal: WaiverModal;
	// Seeded from the failed-submit values so a server-side rejection on another field does
	// not make the competitor read the waiver a second time. The initial read is deliberate:
	// this form is a plain POST, so a rejected submit remounts the page with fresh values,
	// and after that the modal owns this state.
	// svelte-ignore state_referenced_locally
	let waiverAgreed = $state(form?.values?.waiverAck ?? false);

	// These have to be bound, not one-way `value={...}` attributes. Agreeing in the modal
	// flips waiverAgreed, which re-runs the attribute effects and clobbers whatever the
	// competitor had already typed. Same seeding rule as above: the initial read is the
	// point, since a rejected POST remounts the page with the previous values.
	// svelte-ignore state_referenced_locally
	let values = $state({
		builderName: form?.values?.builderName ?? '',
		email: form?.values?.email ?? '',
		phone: form?.values?.phone ?? '',
		teamName: form?.values?.teamName ?? '',
		botName: form?.values?.botName ?? '',
		weaponType: form?.values?.weaponType ?? '',
		notes: form?.values?.notes ?? ''
	});
	// svelte-ignore state_referenced_locally
	let ageAgreed = $state(form?.values?.ageAck ?? false);
	// svelte-ignore state_referenced_locally
	let hazardPneumatic = $state(form?.values?.hazardPneumatic ?? false);
	// svelte-ignore state_referenced_locally
	let hazardHighMass = $state(form?.values?.hazardHighMass ?? false);
	// svelte-ignore state_referenced_locally
	let hazardDocs = $state<{ name: string; url: string }[]>(restoreDocs(form?.values?.hazardDocs));
	let uploading = $state(false);
	let uploadError = $state('');
	const isHazard = $derived(hazardPneumatic || hazardHighMass);

	function restoreDocs(raw: string | undefined): { name: string; url: string }[] {
		try {
			const docs = JSON.parse(raw || '[]');
			return Array.isArray(docs)
				? docs.filter((doc) => doc && typeof doc.name === 'string' && typeof doc.url === 'string')
				: [];
		} catch {
			return [];
		}
	}

	async function uploadDocuments(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		uploadError = '';
		if (hazardDocs.length + files.length > 5) {
			uploadError = 'Upload no more than 5 documents.';
			input.value = '';
			return;
		}
		uploading = true;
		try {
			for (const file of files) {
				if (!['application/pdf', 'image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
					throw new Error('Choose PDF, PNG, JPEG, or WebP files up to 10 MB each.');
				}
				const name = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'document';
				const extension = name.match(/\.[A-Za-z0-9]{1,10}$/)?.[0] ?? '';
				const safeName = name.slice(0, name.length - extension.length).slice(0, 80 - extension.length) + extension;
				const blob = await upload(`hazard-docs/${crypto.randomUUID()}-${safeName}`, file, {
					access: 'public',
					handleUploadUrl: '/api/upload/hazard'
				});
				hazardDocs = [...hazardDocs, { name: file.name.trim().slice(0, 200), url: blob.url }];
			}
		} catch (e) {
			uploadError = e instanceof Error ? e.message : 'Could not upload document. Please try again.';
		} finally {
			uploading = false;
			input.value = '';
		}
	}

	// Gating the submit button is a JS-only affordance. Rendering it disabled on the server
	// would trap anyone without JS on a button that can never enable, so it only starts
	// gating once the client has mounted and the modal is actually usable.
	let jsReady = $state(false);
	onMount(() => {
		jsReady = true;
	});
</script>

<svelte:head>
	<title>Register | {data.event.name} | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Register to Compete</h1>
	<p>{data.event.name}</p>
</section>

<section class="section">
	<div class="container">
		<div class="register-layout">
			<form class="register-form card" method="POST">
				{#if form?.error}
					<div class="form-error">{form.error}</div>
				{/if}
				{#if canceled}
					<div class="form-notice">Payment canceled, you can try again.</div>
				{/if}

				<div class="form-group">
					<label for="builderName">Builder Name</label>
					<input
						id="builderName"
						name="builderName"
						type="text"
						bind:value={values.builderName}
						required
					/>
				</div>

				<div class="form-group">
					<label for="email">Email</label>
					<input id="email" name="email" type="email" bind:value={values.email} required />
				</div>

				<div class="form-group">
					<label for="phone">Phone</label>
					<input id="phone" name="phone" type="tel" bind:value={values.phone} />
				</div>

				<div class="form-group">
					<label for="teamName">Team or School</label>
					<input id="teamName" name="teamName" type="text" bind:value={values.teamName} />
				</div>

				<div class="form-group">
					<label for="botName">Bot Name</label>
					<input id="botName" name="botName" type="text" bind:value={values.botName} required />
				</div>

				<div class="form-group">
					<label for="weaponType">Weapon Type</label>
					<input id="weaponType" name="weaponType" type="text" bind:value={values.weaponType} />
				</div>

				<div class="form-group">
					<label for="notes">Notes</label>
					<textarea id="notes" name="notes" rows="4" bind:value={values.notes}></textarea>
				</div>

				<fieldset class="hazard-block">
					<legend class="waiver-heading">Hazard Bot</legend>
					<p class="waiver-prompt">
						Declare these systems so event staff can review the required technical documentation before your bot competes.
						{#if data.event.rulesPdfUrl}
							<a href={data.event.rulesPdfUrl} target="_blank" rel="noopener noreferrer">Read the event rules (PDF).</a>
						{/if}
					</p>
					<label class="ack-row">
						<input type="checkbox" name="hazardPneumatic" bind:checked={hazardPneumatic} />
						<span><strong>Pneumatics (&le;150 psi):</strong> Full documentation required: component datasheets for all reservoirs, lines, regulators, and valves, plus schematics showing relief valves and safety pressure factors. Must have an accessible manual bleed/vent valve.</span>
					</label>
					<label class="ack-row">
						<input type="checkbox" name="hazardHighMass" bind:checked={hazardHighMass} />
						<span><strong>High-mass inertia weapon (&gt;50% of bot weight):</strong> Engineering documentation required: retention shaft verification, bearing load margins, and FEA/burst containment calculations at full operational RPM.</span>
					</label>
					{#if isHazard}
						<div class="form-group hazard-upload">
							<label for="hazardFiles"><Upload size={16} /> Technical documents</label>
							<p class="waiver-prompt">At least one document is required. Up to 5 PDF, PNG, JPEG, or WebP files, 10 MB each.</p>
							<input id="hazardFiles" type="file" accept="application/pdf,image/png,image/jpeg,image/webp" multiple disabled={uploading || hazardDocs.length >= 5} onchange={uploadDocuments} />
						</div>
						<ul class="hazard-docs">
							{#each hazardDocs as doc, i}
								<li>
									<FileText size={16} /><span>{doc.name}</span>
									<button type="button" class="remove-doc" aria-label={`Remove ${doc.name}`} disabled={uploading} onclick={() => (hazardDocs = hazardDocs.filter((_, index) => index !== i))}><X size={16} /></button>
								</li>
							{/each}
						</ul>
						{#if uploading}<p class="waiver-prompt" role="status">Uploading documents...</p>{/if}
						{#if uploadError}<p class="form-error" role="alert">{uploadError}</p>{/if}
					{/if}
					<input type="hidden" name="hazardDocs" value={JSON.stringify(hazardDocs)} />
				</fieldset>

				<div class="waiver-block">
					<h2 class="waiver-heading">Competitor Waiver</h2>

					{#if waiverAgreed}
						<p class="waiver-agreed">
							<Check size={16} />
							<span>Waiver agreed.</span>
							<button type="button" class="waiver-relink" onclick={() => waiverModal.open()}>
								Review again
							</button>
						</p>
						<!-- Set only once the modal's agree button has been used. The server
						     re-checks this, so removing it by hand just fails the POST. -->
						<input type="hidden" name="waiverAck" value="on" />
					{:else}
						<p class="waiver-prompt">
							You must read and agree to the competitor waiver before registering.
						</p>
						<button type="button" class="btn btn-secondary waiver-open" onclick={() => waiverModal.open()}>
							<FileText size={16} />
							Read and Agree to the Waiver
						</button>
						<noscript>
							<p class="waiver-prompt">
								The waiver viewer needs JavaScript. The full text is below.
								{#if data.waiverPdfUrl}
									A PDF copy is also available.
								{/if}
							</p>
							{#if data.waiverPdfUrl}
								<p class="waiver-prompt">
									<a href={data.waiverPdfUrl} target="_blank" rel="noopener noreferrer">
										Download the waiver PDF
									</a>
								</p>
							{/if}
							<div class="waiver-text-fallback">{data.waiverText}</div>
							<label class="ack-row">
								<input type="checkbox" name="waiverAck" required />
								<span>I have read and agree to the waiver above.</span>
							</label>
						</noscript>
					{/if}

					<label class="ack-row">
						<input type="checkbox" name="ageAck" bind:checked={ageAgreed} required />
						<span>I am 18 years of age or older.</span>
					</label>

					<p class="waiver-note">
						You will still sign the full liability waiver in person at check-in.
					</p>
				</div>

				<button type="submit" class="btn btn-primary submit-btn" disabled={uploading || (jsReady && (!waiverAgreed || (isHazard && hazardDocs.length === 0)))}>
					Continue to Payment
					<ArrowRight size={16} />
				</button>
			</form>

			<div class="register-sidebar">
				<div class="sidebar-card card">
					<h3>{data.event.name}</h3>
					{#if data.event.competitorPrice}
						<p class="sidebar-price">{data.event.competitorPrice}</p>
					{/if}
					{#if data.event.competitorNote}
						<p class="sidebar-note">{data.event.competitorNote}</p>
					{/if}
					<div class="sidebar-warning">
						<ShieldAlert size={18} />
						<span>You will be redirected to Stripe to complete payment.</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<WaiverModal
	bind:this={waiverModal}
	pdfUrl={data.waiverPdfUrl}
	text={data.waiverText}
	onagree={() => (waiverAgreed = true)}
/>

<style>
	.hazard-block {
		min-width: 0;
		margin: 0 0 1.5rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
	}

	.hazard-upload {
		margin-top: 1rem;
	}

	.hazard-upload label,
	.hazard-docs li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.hazard-docs {
		list-style: none;
		padding: 0;
		font-size: 0.8125rem;
	}

	.hazard-docs li {
		margin-top: 0.5rem;
	}

	.hazard-docs span {
		overflow-wrap: anywhere;
		flex: 1;
	}

	.remove-doc {
		display: inline-flex;
		padding: 0.25rem;
		border: none;
		background: none;
		color: var(--text-secondary);
		cursor: pointer;
	}

	.register-layout {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 2rem;
		max-width: 900px;
		margin: 0 auto;
		align-items: start;
	}

	.register-form {
		padding: 2rem;
	}

	.form-error {
		padding: 0.75rem 1rem;
		margin-bottom: 1.25rem;
		border-radius: var(--radius-md);
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.2);
		color: #ef4444;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.form-notice {
		padding: 0.75rem 1rem;
		margin-bottom: 1.25rem;
		border-radius: var(--radius-md);
		background: rgba(235, 171, 33, 0.1);
		border: 1px solid rgba(235, 171, 33, 0.2);
		color: var(--gold);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		font-size: 0.8125rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		font-size: 0.9375rem;
		font-family: inherit;
		transition: all 0.25s ease;
		box-sizing: border-box;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--gold);
		box-shadow: 0 0 0 3px rgba(235, 171, 33, 0.1), 0 0 20px rgba(235, 171, 33, 0.05);
		background: rgba(17, 24, 39, 0.8);
	}

	.form-group textarea {
		resize: vertical;
		min-height: 100px;
	}

	.waiver-block {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
	}

	.waiver-heading {
		margin: 0 0 0.75rem;
		font-size: 0.9375rem;
		font-weight: 600;
	}

	.waiver-text-fallback {
		max-height: 260px;
		overflow-y: auto;
		margin-top: 0.75rem;
		padding: 0.875rem 1rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		white-space: pre-wrap;
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	.waiver-prompt {
		margin: 0 0 0.75rem;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.waiver-open {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.waiver-agreed {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0;
		font-size: 0.8125rem;
		color: var(--text-primary);
	}

	.waiver-relink {
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		font-size: 0.75rem;
		color: var(--text-secondary);
		text-decoration: underline;
		cursor: pointer;
	}

	.waiver-relink:hover {
		color: var(--text-primary);
	}

	.submit-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.ack-row {
		display: flex;
		align-items: flex-start;
		gap: 0.625rem;
		margin-top: 0.875rem;
		cursor: pointer;
	}

	.ack-row input {
		margin-top: 0.2rem;
		flex-shrink: 0;
	}

	.ack-row span {
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--text-primary);
	}

	.waiver-note {
		margin: 0.875rem 0 0;
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.submit-btn {
		width: 100%;
		justify-content: center;
		gap: 0.5rem;
	}

	.sidebar-card {
		padding: 1.5rem;
	}

	.sidebar-card h3 {
		font-size: 1.0625rem;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.sidebar-price {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--gold);
		margin-bottom: 0.25rem;
	}

	.sidebar-note {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.sidebar-warning {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
		font-size: 0.8125rem;
		color: var(--text-muted);
	}

	.sidebar-warning :global(svg) {
		flex-shrink: 0;
		color: var(--gold);
	}

	@media (max-width: 768px) {
		.register-layout {
			grid-template-columns: 1fr;
		}

		.register-form {
			padding: 1.5rem 1rem;
		}

		.sidebar-card {
			padding: 1.5rem 1rem;
		}
	}
</style>
