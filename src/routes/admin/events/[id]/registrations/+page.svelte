<script lang="ts">
	let { data } = $props();

	const statusStyles: Record<string, string> = {
		paid: 'background: rgba(235, 171, 33, 0.15); color: var(--gold);',
		pending: 'background: rgba(148, 163, 184, 0.15); color: #94a3b8;',
		expired: 'background: rgba(148, 163, 184, 0.1); color: #64748b;',
		refunded: 'background: rgba(148, 163, 184, 0.1); color: #64748b;'
	};

	function pillStyle(status: string) {
		const base =
			'display: inline-block; padding: 0.25rem 0.625rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 500; text-transform: capitalize;';
		return base + (statusStyles[status] ?? statusStyles.pending);
	}

	function formatDate(d: Date | string | null | undefined) {
		if (!d) return '';
		const date = new Date(d);
		if (isNaN(date.getTime())) return '';
		return date.toLocaleString();
	}
</script>

<svelte:head>
	<title>{data.event.name} Roster | Admin</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<div>
			<h1>{data.event.name} &middot; Roster</h1>
			<a href="/admin/events" class="item-sub">&larr; Back to Events</a>
		</div>
		<a class="btn-admin primary" href="/admin/events/{data.event.id}/registrations/export" download>
			Download CSV
		</a>
	</div>

	<div class="section-header">
		<h2>Registration Counts</h2>
	</div>
	<div class="form-card" style="display: flex; gap: 2rem; flex-wrap: wrap;">
		<div>
			<div class="item-sub">Paid</div>
			<div class="item-name" style="font-size: 1.5rem;">{data.counts.paid}</div>
		</div>
		<div>
			<div class="item-sub">Pending</div>
			<div class="item-name" style="font-size: 1.5rem;">{data.counts.pending}</div>
		</div>
		<div>
			<div class="item-sub">Expired</div>
			<div class="item-name" style="font-size: 1.5rem;">{data.counts.expired}</div>
		</div>
		<div>
			<div class="item-sub">Refunded</div>
			<div class="item-name" style="font-size: 1.5rem;">{data.counts.refunded}</div>
		</div>
		{#if data.event.capacity > 0}
			<div>
				<div class="item-sub">Capacity</div>
				<div class="item-name" style="font-size: 1.5rem;">{data.event.capacity}</div>
			</div>
		{/if}
	</div>

	<div class="section-header">
		<h2>Registrations</h2>
	</div>

	{#if data.registrations.length === 0}
		<div class="empty-state">No registrations yet.</div>
	{:else}
		<div class="form-card" style="overflow-x: auto; padding: 0;">
			<table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
				<thead>
					<tr style="border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left;">
						<th style="padding: 0.75rem 1rem; color: #cbd5e1;">Status</th>
						<th style="padding: 0.75rem 1rem; color: #cbd5e1;">Builder</th>
						<th style="padding: 0.75rem 1rem; color: #cbd5e1;">Bot</th>
						<th style="padding: 0.75rem 1rem; color: #cbd5e1;">Weapon</th>
						<th style="padding: 0.75rem 1rem; color: #cbd5e1;">Team</th>
						<th style="padding: 0.75rem 1rem; color: #cbd5e1;">Email</th>
						<th style="padding: 0.75rem 1rem; color: #cbd5e1;">Phone</th>
						<th style="padding: 0.75rem 1rem; color: #cbd5e1;">Notes</th>
						<th style="padding: 0.75rem 1rem; color: #cbd5e1;">Created</th>
						<th style="padding: 0.75rem 1rem; color: #cbd5e1;">Paid</th>
					</tr>
				</thead>
				<tbody>
					{#each data.registrations as r}
						<tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
							<td style="padding: 0.75rem 1rem;"><span style={pillStyle(r.status)}>{r.status}</span></td>
							<td style="padding: 0.75rem 1rem; color: #fff;">{r.builderName}</td>
							<td style="padding: 0.75rem 1rem; color: #fff;">{r.botName}</td>
							<td style="padding: 0.75rem 1rem; color: var(--text-muted);">{r.weaponType}</td>
							<td style="padding: 0.75rem 1rem; color: var(--text-muted);">{r.teamName}</td>
							<td style="padding: 0.75rem 1rem; color: var(--text-muted);">{r.email}</td>
							<td style="padding: 0.75rem 1rem; color: var(--text-muted);">{r.phone}</td>
							<td style="padding: 0.75rem 1rem; color: var(--text-muted);">{r.notes}</td>
							<td style="padding: 0.75rem 1rem; color: var(--text-muted); white-space: nowrap;">{formatDate(r.createdAt)}</td>
							<td style="padding: 0.75rem 1rem; color: var(--text-muted); white-space: nowrap;">{formatDate(r.paidAt)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
