<script lang="ts">
	import { FileText } from 'lucide-svelte';
	import RegistrationFields from '$lib/components/admin/RegistrationFields.svelte';
	let { data, form } = $props();
	const registration = $derived(data.registration);
	const canSetStatus = $derived(['expired', 'member', 'paid_offline', 'cancelled', 'paid'].includes(registration.status));
	const canDelete = $derived(registration.stripePaymentIntentId === null && !['pending', 'paid', 'refunded'].includes(registration.status));
</script>

<svelte:head><title>Edit Registration | {data.event.name} | Admin</title></svelte:head>

<div class="admin-page">
	<div class="page-header">
		<div>
			<h1>Edit Registration</h1>
			<a class="item-sub" href="/admin/events/{data.event.id}/registrations">&larr; Back to {data.event.name} roster</a>
		</div>
		<span class="status-pill {registration.status}">{registration.status.replaceAll('_', ' ')}</span>
	</div>
	{#if form?.error}<div class="alert-error" role="alert">{form.error}</div>{/if}
	{#if form?.success}<div class="alert-success" role="status">{form.success}</div>{/if}
	<form class="form-card" method="POST" action="?/edit">
		<RegistrationFields values={form && 'values' in form ? form.values : registration} />
		<p class="help-text">{registration.waiverAck ? 'Waiver acknowledged online.' : 'Waiver at check-in'} {registration.ageAck ? 'Age confirmed online.' : 'Confirm age at check-in.'}</p>
		<div class="form-actions"><button class="btn-admin primary" type="submit">Save Changes</button></div>
	</form>
	<div class="form-card">
		<h3>Hazard Documents</h3>
		<div class="hazard-review">
			<span class="status-pill {registration.hazardStatus}">{registration.hazardStatus.replaceAll('_', ' ')}</span>
			{#each registration.hazardDocs as doc}
				<a class="hazard-document" href={doc.url} target="_blank" rel="noopener noreferrer"><FileText size={16} /> {doc.name}</a>
			{:else}<p class="help-text">No documents uploaded.</p>{/each}
			{#if registration.hazardReviewNote}<p class="hazard-note">{registration.hazardReviewNote}</p>{/if}
		</div>
	</div>
	<div class="form-card">
		<h3>Registration Status</h3>
		{#if canSetStatus}
			<form method="POST" action="?/setStatus">
				<div class="field-group">
					<label class="field-label" for="status">Status</label>
					<select class="field-input" id="status" name="status" value={registration.status === 'paid' ? 'cancelled' : registration.status === 'expired' ? 'member' : registration.status}>
						{#if registration.status !== 'paid'}<option value="member">Member</option><option value="paid_offline">Paid offline</option>{/if}
						<option value="cancelled">Cancelled</option>
					</select>
				</div>
				<p class="help-text">Cancelling does not refund a payment. Refund in the Stripe dashboard if appropriate.</p>
				<div class="form-actions"><button class="btn-admin primary" type="submit">Update Status</button></div>
			</form>
		{:else if registration.status === 'pending'}
			<p class="help-text">Pending registrations may be mid-checkout and cannot be changed manually.</p>
		{:else if registration.status === 'refunded'}
			<p class="help-text">Refunded registrations are final and cannot be changed manually.</p>
		{/if}
	</div>
	<div class="form-card">
		<h3>Stripe Payment Details</h3>
		<dl class="registration-details">
			<dt>Session ID</dt><dd>{registration.stripeSessionId ?? 'None'}</dd>
			<dt>Payment intent</dt><dd>{registration.stripePaymentIntentId ?? 'None'}</dd>
			<dt>Amount (cents)</dt><dd>{registration.amountTotal ?? 'None'}</dd>
			<dt>Paid at</dt><dd>{registration.paidAt ? new Date(registration.paidAt).toLocaleString() : 'None'}</dd>
		</dl>
	</div>
	<div class="form-card">
		<h3>Delete Registration</h3>
		{#if canDelete}
			<form method="POST" action="?/deleteRegistration" onsubmit={(event) => { if (!confirm('Delete this registration?')) event.preventDefault(); }}>
				<button class="btn-admin danger" type="submit">Delete Registration</button>
			</form>
		{:else}<p class="help-text">Registrations with payment records or a pending, paid, or refunded status cannot be deleted.</p>{/if}
	</div>
</div>
