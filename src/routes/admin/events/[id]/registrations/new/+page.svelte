<script lang="ts">
	import RegistrationFields from '$lib/components/admin/RegistrationFields.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Add Registration | {data.event.name} | Admin</title></svelte:head>

<div class="admin-page">
	<div class="page-header">
		<div>
			<h1>Add Registration</h1>
			<a class="item-sub" href="/admin/events/{data.event.id}/registrations">&larr; Back to {data.event.name} roster</a>
		</div>
	</div>
	{#if data.isFull}<div class="alert-warning" role="status">This event is full. Adding a registration overrides its capacity.</div>{/if}
	{#if form?.error}<div class="alert-error" role="alert">{form.error}</div>{/if}
	<form class="form-card" method="POST">
		<RegistrationFields values={form?.values} />
		<div class="field-group">
			<label class="field-label" for="status">Initial Status</label>
			<select class="field-input" id="status" name="status" value={form?.status === 'paid_offline' ? 'paid_offline' : 'member'}>
				<option value="member">Member</option><option value="paid_offline">Paid offline</option>
			</select>
		</div>
		<p class="help-text">Admin registrations override capacity and registration dates. Confirm age and collect a signed waiver at check-in. Hazard Bots require technical approval before competing.</p>
		<div class="form-actions"><button class="btn-admin primary" type="submit">Add Registration</button></div>
	</form>
</div>
