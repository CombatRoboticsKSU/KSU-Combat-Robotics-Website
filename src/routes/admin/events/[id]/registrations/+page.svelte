<script lang="ts">
	import { ShieldAlert, FileText, Check, X, Copy, Mail } from 'lucide-svelte';

	let { data, form } = $props();

	type Registration = (typeof data.registrations)[number];

	const statusFilters: Record<string, { label: string; match: (r: Registration) => boolean }> = {
		all: { label: 'All statuses', match: () => true },
		confirmed: { label: 'Confirmed (paid, member, paid offline)', match: (r) => ['paid', 'member', 'paid_offline'].includes(r.status) },
		active: { label: 'Active (confirmed + pending)', match: (r) => ['paid', 'member', 'paid_offline', 'pending'].includes(r.status) },
		paid: { label: 'Paid', match: (r) => r.status === 'paid' },
		member: { label: 'Member', match: (r) => r.status === 'member' },
		paid_offline: { label: 'Paid offline', match: (r) => r.status === 'paid_offline' },
		pending: { label: 'Pending payment', match: (r) => r.status === 'pending' },
		expired: { label: 'Expired', match: (r) => r.status === 'expired' },
		cancelled: { label: 'Cancelled', match: (r) => r.status === 'cancelled' },
		refunded: { label: 'Refunded', match: (r) => r.status === 'refunded' }
	};

	const typeFilters: Record<string, { label: string; match: (r: Registration) => boolean }> = {
		all: { label: 'All entries', match: () => true },
		hazard: { label: 'Hazard bots', match: (r) => r.hazardPneumatic || r.hazardHighMass || r.hazardStatus !== 'not_required' },
		pneumatic: { label: 'Pneumatic', match: (r) => r.hazardPneumatic },
		high_mass: { label: 'High-mass weapon', match: (r) => r.hazardHighMass },
		pending_review: { label: 'Hazard pending review', match: (r) => r.hazardStatus === 'pending_review' },
		approved: { label: 'Hazard approved', match: (r) => r.hazardStatus === 'approved' },
		rejected: { label: 'Hazard rejected', match: (r) => r.hazardStatus === 'rejected' },
		not_hazard: { label: 'Not a hazard bot', match: (r) => !r.hazardPneumatic && !r.hazardHighMass && r.hazardStatus === 'not_required' },
		no_photo: { label: 'Missing bot photo', match: (r) => !r.botPhotoUrl },
		waiver_checkin: { label: 'Waiver at check-in', match: (r) => !r.waiverAck }
	};

	let statusFilter = $state('all');
	let typeFilter = $state('all');
	let search = $state('');
	let copied = $state('');

	const filtered = $derived.by(() => {
		const q = search.trim().toLowerCase();
		return data.registrations.filter(
			(r) =>
				statusFilters[statusFilter].match(r) &&
				typeFilters[typeFilter].match(r) &&
				(!q || [r.builderName, r.botName, r.teamName, r.email, r.weaponType].some((v) => v.toLowerCase().includes(q)))
		);
	});

	const emails = $derived([...new Set(filtered.map((r) => r.email.trim().toLowerCase()).filter(Boolean))]);

	async function copyEmails() {
		try {
			await navigator.clipboard.writeText(emails.join(', '));
			copied = `Copied ${emails.length} email${emails.length === 1 ? '' : 's'}.`;
		} catch {
			copied = 'Could not copy. Select the emails below instead.';
		}
	}

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
			<a class="btn-admin ghost" href="/admin/events/{data.event.id}/spectators">Spectator tickets</a>
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
		<div class="form-card roster-filters">
			<div class="field-group">
				<label class="field-label" for="statusFilter">Status</label>
				<select class="field-input" id="statusFilter" bind:value={statusFilter}>
					{#each Object.entries(statusFilters) as [value, f]}<option {value}>{f.label}</option>{/each}
				</select>
			</div>
			<div class="field-group">
				<label class="field-label" for="typeFilter">Type</label>
				<select class="field-input" id="typeFilter" bind:value={typeFilter}>
					{#each Object.entries(typeFilters) as [value, f]}<option {value}>{f.label}</option>{/each}
				</select>
			</div>
			<div class="field-group">
				<label class="field-label" for="search">Search</label>
				<input class="field-input" id="search" type="search" placeholder="Name, bot, team, email" bind:value={search} />
			</div>
			<div class="roster-email-actions">
				<span class="item-sub">{filtered.length} shown, {emails.length} unique email{emails.length === 1 ? '' : 's'}</span>
				<button class="btn-admin primary sm" type="button" disabled={emails.length === 0} onclick={copyEmails}><Copy size={14} /> Copy emails</button>
				<a class="btn-admin ghost sm" class:disabled={emails.length === 0} href="mailto:?bcc={encodeURIComponent(emails.join(','))}"><Mail size={14} /> Email (BCC)</a>
				{#if copied}<span class="item-sub" role="status">{copied}</span>{/if}
			</div>
			{#if emails.length}
				<textarea class="field-input roster-email-list" readonly rows="2" aria-label="Filtered emails" onfocus={(e) => e.currentTarget.select()}>{emails.join(', ')}</textarea>
			{/if}
		</div>

		<div class="table-wrap">
			<table class="data-table">
				<thead>
					<tr>
						<th>Status</th>
						<th>Photo</th>
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
					{#each filtered as r (r.id)}
						<tr>
							<td><span class={statusClass(r.status)}>{r.status.replaceAll('_', ' ')}</span>
								{#if !r.waiverAck}<div class="item-sub">Waiver at check-in</div>{/if}</td>
							<td>
								{#if r.botPhotoUrl}
									<a href={r.botPhotoUrl} target="_blank" rel="noopener noreferrer"><img class="bot-photo-thumb" src={r.botPhotoUrl} alt="{r.botName} bot" loading="lazy" /></a>
								{:else}<span class="item-sub">None</span>{/if}
							</td>
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
									{#if ['paid', 'member', 'paid_offline'].includes(r.status) && r.hazardStatus !== 'not_required'}
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
					{#if filtered.length === 0}
						<tr><td colspan="13" class="item-sub">No registrations match these filters.</td></tr>
					{/if}
				</tbody>
			</table>
		</div>
	{/if}
</div>
