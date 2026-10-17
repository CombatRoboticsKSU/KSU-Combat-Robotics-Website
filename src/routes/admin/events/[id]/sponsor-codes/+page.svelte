<script lang="ts">
	import { enhance } from '$app/forms';
	import { Ticket, Ban } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { formatPrice } from './currency';

	let { data, form }: PageProps = $props();
	let creating = $state(false);
	let deactivating = $state<number | null>(null);
	const values = $derived(form && 'values' in form ? form.values : undefined);

</script>

<svelte:head><title>{data.event.name} Sponsor Codes | Admin</title></svelte:head>

<div class="admin-page">
	<div class="page-header">
		<div>
			<h1>{data.event.name} &middot; Sponsor Codes</h1>
			<a class="item-sub" href="/admin/events/{data.event.id}/registrations">&larr; Back to roster</a>
		</div>
	</div>

	<div class="form-card">
		<h2>Spectator tickets</h2>
		{#if data.event.spectatorUrl}
			<p><a href={data.event.spectatorUrl} target="_blank" rel="noopener noreferrer">{data.event.spectatorUrl}</a></p>
		{/if}
		{#if data.ticket.unitAmount !== null && data.ticket.currency}
			<p>Per-ticket price: {formatPrice(data.ticket.unitAmount, data.ticket.currency)}</p>
		{/if}
		{#if data.ticket.error}<p class="alert-error" role="alert">{data.ticket.error}</p>{/if}
		<p class="help-text">Codes are single-use. Each code covers up to its allotted number of tickets in one order; additional tickets are charged at the regular price. Test or live mode follows the deployed Stripe key.</p>
	</div>

	{#if form?.error}<p class="alert-error" role="alert">{form.error}</p>{/if}
	{#if form?.success}<p class="alert-success" role="status">{form.success}</p>{/if}

	<form method="POST" action="?/create" class="form-card" use:enhance={() => {
		creating = true;
		return async ({ update }) => {
			try { await update(); } finally { creating = false; }
		};
	}}>
		<h2>Create sponsor code</h2>
		<div class="field-group">
			<label class="field-label" for="sponsorName">Sponsor name</label>
			<input class="field-input" id="sponsorName" name="sponsorName" required value={values?.sponsorName ?? ''} />
		</div>
		<div class="field-group">
			<label class="field-label" for="tickets">Tickets (1 to 50)</label>
			<input class="field-input field-input-sm" id="tickets" name="tickets" type="number" min="1" max="50" step="1" required value={values?.tickets ?? '1'} />
		</div>
		<div class="field-group">
			<label class="field-label" for="code">Code</label>
			<input class="field-input" id="code" name="code" required minlength="4" maxlength="40" pattern={'[A-Za-z0-9_\\-]{4,40}'} aria-describedby="code-help" value={values?.code ?? ''} />
			<p class="help-text" id="code-help">4 to 40 letters, numbers, underscores, or hyphens. Saved in uppercase.</p>
		</div>
		<div class="form-actions">
			<button class="btn-admin primary" type="submit" disabled={creating}><Ticket size={16} />{creating ? 'Creating...' : 'Create code'}</button>
		</div>
	</form>

	<div class="section-header"><h2>Sponsor codes</h2></div>
	{#if data.codes.length === 0}
		<div class="empty-state">No sponsor codes yet.</div>
	{:else}
		<div class="table-wrap">
			<table class="data-table">
				<thead><tr><th>Sponsor</th><th>Code</th><th>Tickets</th><th>Status</th><th>Times redeemed</th><th>Created</th><th>Actions</th></tr></thead>
				<tbody>
					{#each data.codes as row (row.id)}
						<tr>
							<td class="strong">{row.sponsorName}</td>
							<td><code>{row.code}</code></td>
							<td>{row.tickets}</td>
							<td>{row.stripeActive === null ? 'Unavailable' : row.stripeActive ? 'Active' : 'Inactive'}</td>
							<td>{row.timesRedeemed ?? 'Unavailable'}</td>
							<td>{row.createdAt ? new Date(row.createdAt).toLocaleString() : ''}</td>
							<td>
								{#if row.active}
									<form method="POST" action="?/deactivate" use:enhance={() => {
										deactivating = row.id;
										return async ({ update }) => {
											try { await update({ reset: false }); } finally { deactivating = null; }
										};
									}}>
										<input type="hidden" name="id" value={row.id} />
										<button class="btn-admin danger sm" type="submit" disabled={deactivating !== null}><Ban size={14} />{deactivating === row.id ? 'Deactivating...' : 'Deactivate'}</button>
									</form>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
