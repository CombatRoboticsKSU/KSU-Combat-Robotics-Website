<script lang="ts">
	import { ShieldAlert, FileText, Check, X } from 'lucide-svelte';

	let { data, form } = $props();

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
		<div class="item-actions">
			<a class="btn-admin ghost" href="/admin/events/{data.event.id}/sponsor-codes">Sponsor Codes</a>
			<a class="btn-admin primary" href="/admin/events/{data.event.id}/registrations/new">Add Registration</a>
			<a class="btn-admin ghost" href="/admin/events/{data.event.id}/registrations/export" download>Download CSV</a>
		</div>
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
		{#each [['Member', data.counts.member], ['Paid offline', data.counts.paid_offline], ['Cancelled', data.counts.cancelled]] as [label, value]}
			<div><div class="item-sub">{label}</div><div class="item-name stat-value">{value}</div></div>
		{/each}
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
	{#if form?.error}<div class="alert-error" role="alert">{form.error}</div>{/if}
	{#if form?.success}<div class="alert-success" role="status">{form.success}</div>{/if}

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
						<th>Hazard review</th>
						<th>Weapon</th>
						<th>Team</th>
						<th>Email</th>
						<th>Phone</th>
						<th>Notes</th>
						<th>Created</th>
						<th>Paid</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.registrations as r}
						<tr>
							<td><span class={statusClass(r.status)}>{r.status.replaceAll('_', ' ')}</span>
								{#if !r.waiverAck}<div class="item-sub">Waiver at check-in</div>{/if}</td>
							<td class="strong">{r.builderName}</td>
							<td class="strong">{r.botName}</td>
							<td>
								<div class="hazard-review">
									{#if r.hazardPneumatic || r.hazardHighMass}
										<div class="hazard-types"><ShieldAlert size={16} /> { [r.hazardPneumatic ? 'Pneumatic' : '', r.hazardHighMass ? 'High-mass' : ''].filter(Boolean).join(' / ') }</div>
									{/if}
									<span class="status-pill {r.hazardStatus}">{r.hazardStatus.replaceAll('_', ' ')}</span>
									{#each r.hazardDocs as doc}
										<a class="hazard-document" href={doc.url} target="_blank" rel="noopener noreferrer"><FileText size={14} /> {doc.name}</a>
									{/each}
									{#if r.hazardReviewNote}<p class="hazard-note">{r.hazardReviewNote}</p>{/if}
									{#if r.hazardReviewedAt}<div class="item-sub">Reviewed {formatDate(r.hazardReviewedAt)}</div>{/if}
									{#if ['paid', 'member', 'paid_offline'].includes(r.status) && (r.hazardPneumatic || r.hazardHighMass) && r.hazardStatus !== 'not_required'}
										<form method="POST" action="?/approveHazard" class="hazard-review-form">
											<input type="hidden" name="registrationId" value={r.id} />
											<div class="field-group">
												<label class="field-label" for="hazard-note-{r.id}">Review note (required to reject)</label>
												<textarea class="field-input" id="hazard-note-{r.id}" name="hazardReviewNote" rows="2" value={form && 'registrationId' in form && form.registrationId === r.id ? form.note : r.hazardReviewNote}></textarea>
											</div>
											<div class="hazard-review-actions">
												<button class="btn-admin primary sm" type="submit"><Check size={14} /> Approve</button>
												<button class="btn-admin danger sm" type="submit" formaction="?/rejectHazard"><X size={14} /> Reject</button>
											</div>
											<p class="item-sub">If rejecting, refund in Stripe if appropriate.</p>
										</form>
									{/if}
								</div>
							</td>
							<td>{r.weaponType}</td>
							<td>{r.teamName}</td>
							<td>{r.email}</td>
							<td>{r.phone}</td>
							<td>{r.notes}</td>
							<td>{formatDate(r.createdAt)}</td>
							<td>{formatDate(r.paidAt)}</td>
							<td><a class="btn-admin ghost sm" href="/admin/events/{data.event.id}/registrations/{r.id}">Edit</a></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
