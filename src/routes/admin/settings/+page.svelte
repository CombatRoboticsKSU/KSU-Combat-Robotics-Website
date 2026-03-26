<script lang="ts">
	import { enhance } from '$app/forms';
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import { untrack } from 'svelte';

	let { data, form } = $props();

	let teamPhotoValue = $state(untrack(() => data.teamPhoto));
	let groupPhotoValue = $state(untrack(() => data.groupPhoto));
</script>

<svelte:head>
	<title>Site Settings | Admin</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<h1>Site Settings</h1>
	</div>

	{#if form?.success}
		<div class="alert success" style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #4ade80; padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
			Settings saved successfully!
		</div>
	{/if}

	<div class="form-card">
		<h2>Global Images</h2>
		<form method="POST" action="?/updateSettings" use:enhance>
			<div style="margin-bottom: 1.5rem;">
				<ImageUpload bind:value={teamPhotoValue} name="teamPhoto" folder="site" label="Homepage Team Photo" />
				<p class="help-text">This image is displayed on the main landing page.</p>
			</div>

			<div style="margin-bottom: 1.5rem;">
				<ImageUpload bind:value={groupPhotoValue} name="groupPhoto" folder="leadership" label="Leadership Group Photo" />
				<p class="help-text">This image is displayed at the top of the Leadership page.</p>
			</div>
			
			<button type="submit" class="btn-admin primary">Save Settings</button>
		</form>
	</div>
</div>

<style>
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 2.5rem;
		border-bottom: 1px solid rgba(255,255,255,0.05);
		padding-bottom: 1.5rem;
	}

	.page-header h1 {
		font-size: 1.875rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 0.375rem;
	}

	.form-card {
		background: #1e293b;
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
	}

	.form-card h2 {
		font-size: 1.125rem;
		margin-bottom: 1.5rem;
		color: #fff;
	}

	.help-text {
		font-size: 0.8125rem;
		color: var(--text-muted);
		margin-top: 0.375rem;
		margin-bottom: 0;
	}

	.btn-admin.primary {
		background: var(--gold);
		color: #000;
		font-weight: 600;
		border: 1px solid var(--gold);
		padding: 0.625rem 1.25rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-admin.primary:hover {
		background: #d4981a;
	}
</style>
