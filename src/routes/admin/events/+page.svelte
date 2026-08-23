<script lang="ts">
	import { enhance } from '$app/forms';
	import ImageUpload from '$lib/components/ImageUpload.svelte';

	let { data, form } = $props();

	type EventRow = (typeof data.events)[number];

	let showForm = $state(false);
	let editing = $state<EventRow | null>(null);
	let heroImage = $state('');
	let rulesPdfUrlValue = $state('');
	let rulesUploading = $state(false);
	let rulesUploadError = $state('');
	let scheduleRows = $state<{ time: string; label: string }[]>([]);
	let faqRows = $state<{ question: string; answer: string }[]>([]);

	function toDateInputValue(d: Date | string | null | undefined) {
		if (!d) return '';
		const date = new Date(d);
		if (isNaN(date.getTime())) return '';
		return date.toISOString().slice(0, 10);
	}

	function openNew() {
		editing = null;
		heroImage = '';
		rulesPdfUrlValue = '';
		rulesUploadError = '';
		scheduleRows = [];
		faqRows = [];
		showForm = true;
	}

	function openEdit(e: EventRow) {
		editing = e;
		heroImage = e.image;
		rulesPdfUrlValue = e.rulesPdfUrl;
		rulesUploadError = '';
		scheduleRows = e.schedule ? e.schedule.map((r) => ({ ...r })) : [];
		faqRows = e.faq ? e.faq.map((r) => ({ ...r })) : [];
		showForm = true;
	}

	function closeForm() {
		showForm = false;
		editing = null;
	}

	function addScheduleRow() {
		scheduleRows = [...scheduleRows, { time: '', label: '' }];
	}

	function removeScheduleRow(index: number) {
		scheduleRows = scheduleRows.filter((_, i) => i !== index);
	}

	function addFaqRow() {
		faqRows = [...faqRows, { question: '', answer: '' }];
	}

	function removeFaqRow(index: number) {
		faqRows = faqRows.filter((_, i) => i !== index);
	}

	async function uploadRulesPdf(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		rulesUploading = true;
		rulesUploadError = '';
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
			rulesPdfUrlValue = url;
		} catch (err: any) {
			rulesUploadError = err.message;
		} finally {
			rulesUploading = false;
			input.value = '';
		}
	}
</script>

<svelte:head>
	<title>Events | Admin</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<h1>Events</h1>
	</div>

	{#if form?.success}
		<div class="alert-success">Saved successfully!</div>
	{/if}
	{#if form?.error}
		<div class="alert-error">{form.error}</div>
	{/if}

	<div class="section-header">
		<h2>Competitions</h2>
		<button class="btn-admin primary" onclick={openNew}>+ Add Event</button>
	</div>

	{#if showForm}
		<div class="form-card">
			<h3>{editing ? 'Edit Event' : 'New Event'}</h3>
			<form
				method="POST"
				action={editing ? '?/updateEvent' : '?/createEvent'}
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type !== 'failure') closeForm();
					};
				}}
			>
				{#if editing}
					<input type="hidden" name="id" value={editing.id} />
				{/if}

				<div class="field-group">
					<label class="field-label" for="eName">Name</label>
					<input id="eName" name="name" type="text" class="field-input" value={editing?.name ?? ''} required />
				</div>

				<div class="field-group">
					<label class="field-label" for="eSlug">Slug</label>
					<input id="eSlug" name="slug" type="text" class="field-input" value={editing?.slug ?? ''} required />
					<p class="help-text">Lowercase letters, numbers, and hyphens only.</p>
				</div>

				<div class="field-group">
					<label class="field-label" for="eTagline">Tagline</label>
					<input id="eTagline" name="tagline" type="text" class="field-input" value={editing?.tagline ?? ''} />
				</div>

				<div class="field-group">
					<ImageUpload bind:value={heroImage} name="image" folder="events" label="Hero Image" />
				</div>

				<div class="field-group">
					<label class="field-label" for="eWeightClass">Weight Class</label>
					<input id="eWeightClass" name="weightClass" type="text" class="field-input" value={editing?.weightClass ?? ''} />
				</div>

				<div class="field-group">
					<label class="field-label" for="eEventDate">Event Date (display text)</label>
					<input
						id="eEventDate"
						name="eventDate"
						type="text"
						class="field-input"
						value={editing?.eventDate ?? ''}
						placeholder="e.g. October 18, 2026"
					/>
				</div>

				<div class="field-group">
					<label class="field-label" for="eSortDate">Sort Date</label>
					<input
						id="eSortDate"
						name="sortDate"
						type="date"
						class="field-input field-input-sm"
						value={toDateInputValue(editing?.sortDate)}
					/>
					<p class="help-text">Used for ordering upcoming vs past. Does not affect the displayed date text.</p>
				</div>

				<div class="field-group">
					<label class="field-label" for="eDoorsTime">Doors Time</label>
					<input id="eDoorsTime" name="doorsTime" type="text" class="field-input" value={editing?.doorsTime ?? ''} />
				</div>

				<div class="field-group">
					<label class="field-label" for="eLocation">Location</label>
					<input id="eLocation" name="location" type="text" class="field-input" value={editing?.location ?? ''} />
				</div>

				<div class="field-group">
					<label class="field-label" for="eAddress">Address</label>
					<input id="eAddress" name="address" type="text" class="field-input" value={editing?.address ?? ''} />
				</div>

				<div class="field-group">
					<label class="field-label" for="eStatus">Status</label>
					<select id="eStatus" name="status" class="field-input field-input-sm" value={editing?.status ?? 'upcoming'}>
						<option value="upcoming">Upcoming</option>
						<option value="past">Past</option>
					</select>
				</div>

				<div class="field-group">
					<label class="field-label" for="eOverview">Overview</label>
					<textarea id="eOverview" name="overview" class="field-input" rows="4">{editing?.overview ?? ''}</textarea>
				</div>

				<div class="field-group">
					<label class="field-label" for="eRulesLabel">Rules Link Label</label>
					<input
						id="eRulesLabel"
						name="rulesLabel"
						type="text"
						class="field-input"
						value={editing?.rulesLabel ?? 'Download Rules (PDF)'}
					/>
				</div>

				<div class="field-group">
					<label class="field-label" for="rulesFileInput">Rules PDF</label>
					{#if rulesPdfUrlValue}
						<p class="help-text">
							Current: <a href={rulesPdfUrlValue} target="_blank" rel="noopener noreferrer">{rulesPdfUrlValue}</a>
						</p>
					{/if}
					{#if rulesUploadError}
						<div class="alert-error">{rulesUploadError}</div>
					{/if}
					<input
						id="rulesFileInput"
						type="file"
						accept="application/pdf"
						onchange={uploadRulesPdf}
						disabled={rulesUploading}
					/>
					{#if rulesUploading}
						<p class="help-text">Uploading...</p>
					{/if}
					<input type="hidden" name="rulesPdfUrl" value={rulesPdfUrlValue} />
				</div>

				<div class="field-group">
					<label class="field-label" for="eRegistrationOpen">
						<input id="eRegistrationOpen" type="checkbox" name="registrationOpen" checked={editing?.registrationOpen ?? false} />
						Registration Open
					</label>
				</div>

				<div class="field-group">
					<label class="field-label" for="eCompetitorPriceId">Competitor Stripe Price ID</label>
					<input
						id="eCompetitorPriceId"
						name="competitorPriceId"
						type="text"
						class="field-input"
						value={editing?.competitorPriceId ?? ''}
					/>
				</div>

				<div class="field-group">
					<label class="field-label" for="eCompetitorLabel">Competitor Button Label</label>
					<input
						id="eCompetitorLabel"
						name="competitorLabel"
						type="text"
						class="field-input"
						value={editing?.competitorLabel ?? 'Register to Compete'}
					/>
				</div>

				<div class="field-group">
					<label class="field-label" for="eCompetitorPrice">Competitor Price (display text)</label>
					<input
						id="eCompetitorPrice"
						name="competitorPrice"
						type="text"
						class="field-input"
						value={editing?.competitorPrice ?? ''}
					/>
				</div>

				<div class="field-group">
					<label class="field-label" for="eCompetitorNote">Competitor Note</label>
					<input
						id="eCompetitorNote"
						name="competitorNote"
						type="text"
						class="field-input"
						value={editing?.competitorNote ?? ''}
					/>
				</div>

				<div class="field-group">
					<label class="field-label" for="eCapacity">Capacity (0 = unlimited)</label>
					<input
						id="eCapacity"
						name="capacity"
						type="number"
						class="field-input field-input-sm"
						value={editing?.capacity ?? 0}
					/>
				</div>

				<div class="field-group">
					<label class="field-label" for="eSpectatorUrl">Spectator Ticket URL</label>
					<input id="eSpectatorUrl" name="spectatorUrl" type="text" class="field-input" value={editing?.spectatorUrl ?? ''} />
				</div>

				<div class="field-group">
					<label class="field-label" for="eSpectatorLabel">Spectator Button Label</label>
					<input
						id="eSpectatorLabel"
						name="spectatorLabel"
						type="text"
						class="field-input"
						value={editing?.spectatorLabel ?? 'Buy Spectator Tickets'}
					/>
				</div>

				<div class="field-group">
					<label class="field-label" for="eSpectatorPrice">Spectator Price (display text)</label>
					<input
						id="eSpectatorPrice"
						name="spectatorPrice"
						type="text"
						class="field-input"
						value={editing?.spectatorPrice ?? ''}
					/>
				</div>

				<div class="field-group">
					<label class="field-label" for="eSpectatorNote">Spectator Note</label>
					<input
						id="eSpectatorNote"
						name="spectatorNote"
						type="text"
						class="field-input"
						value={editing?.spectatorNote ?? ''}
					/>
				</div>

				<div class="field-group">
					<span class="field-label">Schedule</span>
					{#each scheduleRows as row, i}
						<div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; align-items: center;">
							<input type="text" class="field-input" placeholder="Time" bind:value={row.time} />
							<input type="text" class="field-input" placeholder="Label" bind:value={row.label} />
							<button type="button" class="btn-admin ghost sm" onclick={() => removeScheduleRow(i)}>Remove</button>
						</div>
					{/each}
					<button type="button" class="btn-admin ghost sm" onclick={addScheduleRow}>+ Add Schedule Row</button>
					<input type="hidden" name="schedule" value={JSON.stringify(scheduleRows)} />
				</div>

				<div class="field-group">
					<span class="field-label">FAQ</span>
					{#each faqRows as row, i}
						<div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; align-items: center;">
							<input type="text" class="field-input" placeholder="Question" bind:value={row.question} />
							<input type="text" class="field-input" placeholder="Answer" bind:value={row.answer} />
							<button type="button" class="btn-admin ghost sm" onclick={() => removeFaqRow(i)}>Remove</button>
						</div>
					{/each}
					<button type="button" class="btn-admin ghost sm" onclick={addFaqRow}>+ Add FAQ Row</button>
					<input type="hidden" name="faq" value={JSON.stringify(faqRows)} />
				</div>

				<div class="field-group">
					<label class="field-label" for="ePublished">
						<input id="ePublished" type="checkbox" name="published" checked={editing?.published ?? false} />
						Published
					</label>
				</div>

				<div class="field-group">
					<label class="field-label" for="eSortOrder">Sort Order</label>
					<input
						id="eSortOrder"
						name="sortOrder"
						type="number"
						class="field-input field-input-sm"
						value={editing?.sortOrder ?? 0}
					/>
				</div>

				<div class="form-actions">
					<button type="submit" class="btn-admin primary">{editing ? 'Save Changes' : 'Add Event'}</button>
					<button type="button" class="btn-admin ghost" onclick={closeForm}>Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	{#if data.events.length === 0}
		<div class="empty-state">No events yet.</div>
	{:else}
		<div class="items-list">
			{#each data.events as e}
				<div class="list-item">
					<div class="item-info">
						<span class="item-name">{e.name}</span>
						<span class="item-sub">
							{e.slug} &middot; {e.eventDate} &middot; {e.published ? 'Published' : 'Draft'} &middot;
							{data.paidByEvent[e.id] ?? 0} paid
						</span>
					</div>
					<div class="item-actions">
						<a href="/admin/events/{e.id}/registrations" class="btn-admin ghost sm">View roster</a>
						<button class="btn-admin ghost sm" onclick={() => openEdit(e)}>Edit</button>
						<form method="POST" action="?/deleteEvent" use:enhance>
							<input type="hidden" name="id" value={e.id} />
							<button
								type="submit"
								class="btn-admin danger sm"
								onclick={(ev) => {
									if (!confirm(`Delete ${e.name}?`)) ev.preventDefault();
								}}
							>
								Delete
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
