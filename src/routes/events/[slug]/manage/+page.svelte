<script lang="ts">
	import { enhance } from '$app/forms';
	import RegistrationEditForm from './RegistrationEditForm.svelte';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
	let sending = $state(false);
</script>

<svelte:head><title>Manage registration | {data.event.name}</title><meta name="robots" content="noindex,nofollow" /><meta name="referrer" content="no-referrer" /></svelte:head>
<section class="hero"><h1>Manage your registration</h1><p>{data.event.name}</p></section>
<section class="section"><div class="container manage">
	<a href="/events/{data.event.slug}">← Back to event</a>
	{#if !data.open}<p class="notice">Editing is closed. Contact event staff if you need to change your entry.</p>
	{:else}<p class="intro">Update your entry without paying again. Payment records and waiver acceptance stay unchanged. {#if data.event.deadline}Edits are available through {data.event.deadline} (Eastern time), or until event day, whichever comes first.{:else}Edits close at midnight Eastern time when event day begins.{/if}</p>{/if}
	{#if form?.error}<p class="notice error" role="alert">{form.error}</p>{/if}
	{#if form?.success}<p class="notice" role="status">{form.success}</p>{/if}
	{#if data.token && data.open}
		<div class="card access"><h2>Continue to your registrations</h2><p>Press Continue to use your private email link. It works once and opens a two-hour editing session on this browser.</p>
		<form method="POST" action="?/verify"><input type="hidden" name="token" value={data.token} /><button class="btn btn-primary">Continue</button></form></div>
	{:else if data.verified}
		{#each data.registrations as registration (registration.id)}<RegistrationEditForm {registration} open={data.open} />{:else}<p>No confirmed entries are currently editable with this email. Contact staff if your payment is still processing or your entry was cancelled or refunded.</p>{/each}
		<form method="POST" action="?/logout" class="logout"><button class="btn btn-secondary">End editing session</button></form>
	{/if}
	{#if !data.verified && data.open}
		<div class="card access"><h2>Email me a private edit link</h2><p>Use the email entered when registering. One link lets you manage your confirmed entries for this event. No account required.</p>
		{#if !data.emailReady}<p>Email access is temporarily unavailable. Please contact event staff.</p>{:else}
			<form method="POST" action="?/requestLink" use:enhance={() => { sending = true; return async ({ update }) => { try { await update(); } finally { sending = false; } }; }}>
				<label for="email">Registration email</label><input id="email" name="email" type="email" required maxlength="254" autocomplete="email" />
				<button class="btn btn-primary" disabled={sending}>{sending ? 'Requesting…' : 'Email edit link'}</button>
			</form>
		{/if}</div>
	{/if}
</div></section>
<style>
	.manage{max-width:850px}.intro{margin:1.5rem 0;line-height:1.7;color:var(--text-secondary)}.access{padding:1.5rem;margin-top:1.5rem}.access p{line-height:1.7;margin:1rem 0;color:var(--text-secondary)}.access form{display:grid;gap:1rem;justify-items:start}.access input[type=email]{width:100%;box-sizing:border-box;background:var(--bg-secondary);color:var(--text-primary);border:1px solid #475569;padding:.8rem;border-radius:8px;font:inherit}.notice{padding:1rem;margin:1.5rem 0;border:1px solid var(--gold);border-radius:8px;line-height:1.6}.error{border-color:#f87171}.logout{margin-top:1.5rem}
</style>
