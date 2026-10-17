<script lang="ts">
	import { page } from '$app/state';
	import { ArrowLeft, ArrowRight, Calendar, Check, FileText, MapPin, ShieldAlert, Upload, Weight, X } from 'lucide-svelte';
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
	let memberCode = $state('');
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

	const submitBlocked = $derived(uploading || (jsReady && (!waiverAgreed || (isHazard && hazardDocs.length === 0))));
	const submitHint = $derived(
		!jsReady
			? ''
			: uploading
				? 'Waiting for uploads to finish.'
				: !waiverAgreed
					? 'Agree to the waiver to continue.'
					: isHazard && hazardDocs.length === 0
						? 'Upload at least one hazard bot document to continue.'
						: ''
	);

	const venueName = $derived(data.event.location.split(',')[0].trim());
</script>

<svelte:head>
	<title>Register | {data.event.name} | KSU Combat Robotics</title>
</svelte:head>

<section class="reg-hero">
	<div class="hero-pattern" aria-hidden="true"></div>
	<div class="container hero-inner">
		<a href="/events/{data.event.slug}" class="back-link"><ArrowLeft size={16} /> Back to event</a>
		<p class="eyebrow">Register to compete</p>
		<h1>{data.event.name}</h1>
		<ul class="facts">
			<li><Calendar size={17} /><span>{data.event.eventDate}</span></li>
			{#if venueName}
				<li><MapPin size={17} /><span>{venueName}</span></li>
			{/if}
			{#if data.event.weightClass}
				<li><Weight size={17} /><span>{data.event.weightClass}</span></li>
			{/if}
		</ul>
	</div>
</section>

<div class="container reg-layout">
	<aside class="reg-rail">
		<div class="panel summary">
			{#if memberCode.trim()}
				<div class="price">
					<span class="price-value">Free</span>
					<span class="price-label">Club member registration</span>
				</div>
			{:else if data.event.competitorPrice}
				<div class="price">
					<span class="price-value">{data.event.competitorPrice}</span>
					<span class="price-label">Entry fee, per robot</span>
				</div>
			{/if}
			{#if data.event.competitorNote}
				<p class="summary-note">{data.event.competitorNote}</p>
			{/if}
			<div class="summary-info">
				<ShieldAlert size={18} />
				<span>{memberCode.trim() ? 'Member registrations do not require payment.' : 'You will be redirected to Stripe to complete payment.'}</span>
			</div>
		</div>
	</aside>

	<form class="reg-form" method="POST">
		{#if form?.error}
			<div class="form-error" role="alert">{form.error}</div>
		{/if}
		{#if canceled}
			<div class="form-notice">Payment canceled, you can try again.</div>
		{/if}

		<p class="required-hint"><span class="req" aria-hidden="true">*</span> Required</p>

		<section class="form-section">
			<h2 class="section-heading">Builder</h2>
			<div class="field-grid">
				<div class="form-group span-2">
					<label for="builderName">Name <span class="req" aria-hidden="true">*</span></label>
					<input id="builderName" name="builderName" type="text" autocomplete="name" bind:value={values.builderName} required />
				</div>
				<div class="form-group">
					<label for="email">Email <span class="req" aria-hidden="true">*</span></label>
					<input id="email" name="email" type="email" autocomplete="email" bind:value={values.email} required />
				</div>
				<div class="form-group">
					<label for="phone">Phone</label>
					<input id="phone" name="phone" type="tel" autocomplete="tel" bind:value={values.phone} />
				</div>
				<div class="form-group span-2">
					<label for="teamName">Team or school</label>
					<input id="teamName" name="teamName" type="text" bind:value={values.teamName} />
				</div>
			</div>
		</section>

		<section class="form-section">
			<h2 class="section-heading">Robot</h2>
			<div class="field-grid">
				<div class="form-group">
					<label for="botName">Bot name <span class="req" aria-hidden="true">*</span></label>
					<input id="botName" name="botName" type="text" bind:value={values.botName} required />
				</div>
				<div class="form-group">
					<label for="weaponType">Weapon type</label>
					<input id="weaponType" name="weaponType" type="text" placeholder="Vertical spinner, hammer, wedge..." bind:value={values.weaponType} />
				</div>
				<div class="form-group span-2">
					<label for="notes">Notes</label>
					<textarea id="notes" name="notes" rows="3" bind:value={values.notes}></textarea>
				</div>
			</div>
		</section>

		<fieldset class="form-section">
			<legend class="section-heading">Hazard bot</legend>
			<p class="section-intro">
				Check any that apply so event staff can review the required technical documentation before your bot competes.
				{#if data.event.rulesPdfUrl}
					<a href={data.event.rulesPdfUrl} target="_blank" rel="noopener noreferrer">Read the event rules (PDF)</a>
				{/if}
			</p>
			<div class="options">
				<label class="option" class:checked={hazardPneumatic}>
					<input type="checkbox" name="hazardPneumatic" bind:checked={hazardPneumatic} />
					<span class="option-text">
						<span class="option-title">Pneumatics (&le;150 psi)</span>
						<span class="option-detail">Datasheets for all reservoirs, lines, regulators, and valves, plus schematics showing relief valves and safety pressure factors. Must have an accessible manual bleed/vent valve.</span>
					</span>
				</label>
				<label class="option" class:checked={hazardHighMass}>
					<input type="checkbox" name="hazardHighMass" bind:checked={hazardHighMass} />
					<span class="option-text">
						<span class="option-title">High-mass inertia weapon (&gt;50% of bot weight)</span>
						<span class="option-detail">Retention shaft verification, bearing load margins, and FEA/burst containment calculations at full operational RPM.</span>
					</span>
				</label>
			</div>
			{#if isHazard}
				<div class="hazard-upload">
					<label for="hazardFiles" class="upload-label"><Upload size={16} /> Technical documents <span class="req" aria-hidden="true">*</span></label>
					<p class="section-intro">At least one document. Up to 5 PDF, PNG, JPEG, or WebP files, 10 MB each.</p>
					<input id="hazardFiles" type="file" accept="application/pdf,image/png,image/jpeg,image/webp" multiple disabled={uploading || hazardDocs.length >= 5} onchange={uploadDocuments} />
					{#if hazardDocs.length}
						<ul class="hazard-docs">
							{#each hazardDocs as doc, i}
								<li>
									<FileText size={16} /><span>{doc.name}</span>
									<button type="button" class="remove-doc" aria-label={`Remove ${doc.name}`} disabled={uploading} onclick={() => (hazardDocs = hazardDocs.filter((_, index) => index !== i))}><X size={16} /></button>
								</li>
							{/each}
						</ul>
					{/if}
					{#if uploading}<p class="section-intro" role="status">Uploading documents...</p>{/if}
					{#if uploadError}<p class="form-error" role="alert">{uploadError}</p>{/if}
				</div>
			{/if}
			<input type="hidden" name="hazardDocs" value={JSON.stringify(hazardDocs)} />
		</fieldset>

		{#if data.memberCodeEnabled}
			<section class="form-section">
				<h2 class="section-heading">Club members</h2>
				<div class="form-group">
					<label for="memberCode">Member access code</label>
					<input id="memberCode" name="memberCode" type="text" bind:value={memberCode} autocomplete="off" />
				</div>
				<p class="section-intro">Enter the code from Discord to register without paying.</p>
			</section>
		{/if}

		<section class="form-section">
			<h2 class="section-heading">Waiver</h2>

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
				<p class="section-intro">
					You must read and agree to the competitor waiver before registering.
				</p>
				<button type="button" class="btn btn-secondary waiver-open" onclick={() => waiverModal.open()}>
					<FileText size={16} />
					Read and Agree to the Waiver
				</button>
				<noscript>
					<p class="section-intro">
						The waiver viewer needs JavaScript. The full text is below.
						{#if data.waiverPdfUrl}
							A PDF copy is also available.
						{/if}
					</p>
					{#if data.waiverPdfUrl}
						<p class="section-intro">
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
		</section>

		<div class="submit-area">
			<button type="submit" class="btn btn-primary submit-btn" disabled={submitBlocked}>
				{memberCode.trim() ? 'Register as a Member' : 'Continue to Payment'}
				<ArrowRight size={16} />
			</button>
			{#if submitHint}
				<p class="submit-hint" role="status">{submitHint}</p>
			{/if}
		</div>
	</form>
</div>

<WaiverModal
	bind:this={waiverModal}
	pdfUrl={data.waiverPdfUrl}
	text={data.waiverText}
	onagree={() => (waiverAgreed = true)}
/>

<style>
	/* Hero */
	.reg-hero {
		position: relative;
		overflow: hidden;
		background:
			radial-gradient(ellipse 60% 90% at 85% 10%, rgba(235, 171, 33, 0.1) 0%, transparent 60%),
			radial-gradient(ellipse 70% 80% at 0% 100%, rgba(0, 120, 212, 0.18) 0%, transparent 60%),
			linear-gradient(160deg, var(--navy-dark) 0%, var(--navy) 65%, #01325e 100%);
		border-bottom: 1px solid rgba(235, 171, 33, 0.25);
	}

	.hero-pattern {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
		background-size: 48px 48px;
		-webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 70%);
		mask-image: linear-gradient(90deg, transparent 0%, #000 70%);
	}

	.hero-inner {
		position: relative;
		padding-top: 2rem;
		padding-bottom: 2.25rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		margin-bottom: 1.75rem;
	}

	.back-link:hover {
		color: var(--gold);
	}

	.eyebrow {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--gold);
		margin-bottom: 0.375rem;
	}

	.reg-hero h1 {
		font-size: clamp(1.875rem, 4.5vw, 2.75rem);
		font-weight: 800;
		letter-spacing: -0.025em;
		line-height: 1.1;
		text-wrap: balance;
	}

	.facts {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.625rem 1.75rem;
		margin-top: 1.5rem;
		padding-top: 1.125rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.facts li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.facts :global(svg) {
		color: var(--gold);
		flex-shrink: 0;
	}

	/* Layout */
	.reg-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 19rem;
		gap: 2.5rem;
		align-items: start;
		max-width: 1040px;
		padding-top: 2.5rem;
		padding-bottom: 4rem;
	}

	.reg-rail {
		grid-column: 2;
		grid-row: 1;
		position: sticky;
		top: 5rem;
	}

	.reg-form {
		grid-column: 1;
		grid-row: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	/* Summary */
	.panel {
		background: var(--bg-card);
		border: 1px solid rgba(235, 171, 33, 0.25);
		border-radius: var(--radius-md);
	}

	.summary {
		padding: 1.25rem 1.375rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.price {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.25rem 0.625rem;
	}

	.price-value {
		font-size: 1.625rem;
		font-weight: 800;
		letter-spacing: -0.01em;
		line-height: 1.1;
		font-variant-numeric: tabular-nums;
	}

	.price-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.summary-note {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.summary-info {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding-top: 0.875rem;
		border-top: 1px solid var(--border-color);
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.summary-info :global(svg) {
		flex-shrink: 0;
		color: var(--gold);
	}

	/* Form */
	.form-section {
		min-width: 0;
		margin: 0;
		padding: 1.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
	}

	.section-heading {
		float: left;
		width: 100%;
		padding: 0;
		margin: 0 0 1rem;
		font-size: 1.0625rem;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.section-heading + * {
		clear: both;
	}

	.section-intro {
		margin: 0 0 1rem;
		font-size: 0.875rem;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.section-intro a {
		color: var(--gold);
		white-space: nowrap;
	}

	.required-hint {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.req {
		color: var(--gold);
		font-weight: 700;
	}

	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem 1rem;
	}

	.span-2 {
		grid-column: 1 / -1;
	}

	.form-group label,
	.upload-label {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.4rem;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.6875rem 0.875rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-size: 0.9375rem;
		font-family: inherit;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
		box-sizing: border-box;
	}

	.form-group input::placeholder {
		color: var(--text-muted);
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--gold);
		box-shadow: 0 0 0 3px rgba(235, 171, 33, 0.15);
	}

	.form-group textarea {
		resize: vertical;
		min-height: 88px;
	}

	.form-section > .form-group + .section-intro {
		margin: 0.5rem 0 0;
	}

	/* Hazard options */
	.options {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.option {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: border-color 0.2s ease;
	}

	.option.checked {
		border-color: rgba(235, 171, 33, 0.5);
	}

	.option input,
	.ack-row input {
		width: 1rem;
		height: 1rem;
		margin-top: 0.15rem;
		flex-shrink: 0;
		accent-color: var(--gold);
	}

	.option-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.option-title {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.option-detail {
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.hazard-upload {
		margin-top: 1.25rem;
	}

	.hazard-upload input[type='file'] {
		width: 100%;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.hazard-docs {
		list-style: none;
		padding: 0;
		margin: 0.75rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		font-size: 0.8125rem;
	}

	.hazard-docs li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
	}

	.hazard-docs li > :global(svg) {
		color: var(--gold);
		flex-shrink: 0;
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

	.remove-doc:hover {
		color: var(--text-primary);
	}

	/* Notices */
	.form-error {
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.25);
		color: #ef4444;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.hazard-upload .form-error {
		margin-top: 0.75rem;
	}

	.form-notice {
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		background: rgba(235, 171, 33, 0.1);
		border: 1px solid rgba(235, 171, 33, 0.25);
		color: var(--gold);
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Waiver */
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
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.waiver-agreed :global(svg) {
		color: #22c55e;
	}

	.waiver-relink {
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		font-size: 0.8125rem;
		font-weight: 400;
		color: var(--text-secondary);
		text-decoration: underline;
		cursor: pointer;
	}

	.waiver-relink:hover {
		color: var(--text-primary);
	}

	.ack-row {
		display: flex;
		align-items: flex-start;
		gap: 0.625rem;
		margin-top: 1rem;
		cursor: pointer;
	}

	.ack-row span {
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--text-primary);
	}

	.waiver-note {
		margin: 0.875rem 0 0;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	/* Submit */
	.submit-area {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.submit-btn {
		width: 100%;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.875rem 1rem;
		font-size: 1rem;
	}

	.submit-btn:disabled {
		background: var(--bg-card);
		color: var(--text-muted);
		border: 1px solid var(--border-color);
		box-shadow: none;
		transform: none;
		cursor: not-allowed;
	}

	.submit-btn:disabled::after {
		display: none;
	}

	.submit-hint {
		margin: 0;
		text-align: center;
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	@media (max-width: 900px) {
		.reg-layout {
			grid-template-columns: minmax(0, 1fr);
			gap: 1.25rem;
			padding-top: 1.5rem;
		}

		.reg-rail,
		.reg-form {
			grid-column: 1;
			grid-row: auto;
		}

		.reg-rail {
			position: static;
		}
	}

	@media (max-width: 640px) {
		.hero-inner {
			padding-top: 1.25rem;
			padding-bottom: 1.75rem;
		}

		.back-link {
			margin-bottom: 1.25rem;
		}

		.form-section {
			padding: 1.25rem 1rem;
		}

		.field-grid {
			grid-template-columns: minmax(0, 1fr);
		}

		.summary {
			padding: 1rem;
		}
	}
</style>
