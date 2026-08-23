<script lang="ts">
	let { data } = $props();

	function statusClass(status: string) {
		return `status-pill ${status}`;
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
	<div class="form-card stat-row">
		<div>
			<div class="item-sub">Paid</div>
			<div class="item-name stat-value">{data.counts.paid}</div>
		</div>
		<div>
			<div class="item-sub">Pending</div>
			<div class="item-name stat-value">{data.counts.pending}</div>
		</div>
		<div>
			<div class="item-sub">Expired</div>
			<div class="item-name stat-value">{data.counts.expired}</div>
		</div>
		<div>
			<div class="item-sub">Refunded</div>
			<div class="item-name stat-value">{data.counts.refunded}</div>
		</div>
		{#if data.event.capacity > 0}
			<div>
				<div class="item-sub">Capacity</div>
				<div class="item-name stat-value">{data.event.capacity}</div>
			</div>
		{/if}
	</div>

	<div class="section-header">
		<h2>Registrations</h2>
	</div>

	{#if data.registrations.length === 0}
		<div class="empty-state">No registrations yet.</div>
	{:else}
		<div class="table-wrap">
			<table class="data-table">
				<thead>
					<tr>
						<th>Status</th>
						<th>Builder</th>
						<th>Bot</th>
						<th>Weapon</th>
						<th>Team</th>
						<th>Email</th>
						<th>Phone</th>
						<th>Notes</th>
						<th>Created</th>
						<th>Paid</th>
					</tr>
				</thead>
				<tbody>
					{#each data.registrations as r}
						<tr>
							<td><span class={statusClass(r.status)}>{r.status}</span></td>
							<td class="strong">{r.builderName}</td>
							<td class="strong">{r.botName}</td>
							<td>{r.weaponType}</td>
							<td>{r.teamName}</td>
							<td>{r.email}</td>
							<td>{r.phone}</td>
							<td>{r.notes}</td>
							<td>{formatDate(r.createdAt)}</td>
							<td>{formatDate(r.paidAt)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
