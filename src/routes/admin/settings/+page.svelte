<script lang="ts">
	import { enhance } from '$app/forms';
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import { untrack } from 'svelte';

	let { data, form } = $props();

	let teamPhotoValue = $state(untrack(() => data.teamPhoto));
	let groupPhotoValue = $state(untrack(() => data.groupPhoto));
	let meetingTimeValue = $state(untrack(() => data.meetingTime));
	let meetingLocationValue = $state(untrack(() => data.meetingLocation));
	let statYearsValue = $state(untrack(() => data.statYears));
	let statWeightClassValue = $state(untrack(() => data.statWeightClass));
	let statMembersValue = $state(untrack(() => data.statMembers));
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
		<h2>Homepage Hero</h2>
		<form method="POST" action="?/updateSettings" use:enhance>
			<p class="section-desc">These values appear in the hero section of the landing page.</p>

			<div class="field-group">
				<label class="field-label" for="meetingTime">Meeting Time</label>
				<input
					id="meetingTime"
					name="meetingTime"
					type="text"
					class="field-input"
					bind:value={meetingTimeValue}
					placeholder="e.g. Every Friday 4:30-6:30pm"
				/>
				<p class="help-text">Also shown on the calendar page.</p>
			</div>

			<div class="field-group">
				<label class="field-label" for="meetingLocation">Meeting Location</label>
				<input
					id="meetingLocation"
					name="meetingLocation"
					type="text"
					class="field-input"
					bind:value={meetingLocationValue}
					placeholder="e.g. 120 AEB"
				/>
				<p class="help-text">Also shown on the calendar page.</p>
			</div>

			<div class="stats-grid">
				<div>
					<label class="field-label" for="statYears">Years Active</label>
					<input
						id="statYears"
						name="statYears"
						type="text"
						class="field-input"
						bind:value={statYearsValue}
						placeholder="e.g. 10+"
					/>
				</div>
				<div>
					<label class="field-label" for="statWeightClass">Weight Class</label>
					<input
						id="statWeightClass"
						name="statWeightClass"
						type="text"
						class="field-input"
						bind:value={statWeightClassValue}
						placeholder="e.g. 12lb & 3lb"
					/>
				</div>
				<div>
					<label class="field-label" for="statMembers">Club Members</label>
					<input
						id="statMembers"
						name="statMembers"
						type="text"
						class="field-input"
						bind:value={statMembersValue}
						placeholder="e.g. 30+"
					/>
				</div>
			</div>
			<p class="help-text" style="margin-bottom: 1.5rem;">Stats row shown below the hero badges.</p>

			<button type="submit" class="btn-admin primary">Save Hero Settings</button>
		</form>
	</div>

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

	.section-desc {
		font-size: 0.875rem;
		color: var(--text-muted);
		margin-bottom: 1.5rem;
	}

	.field-group {
		margin-bottom: 1.5rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.field-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary, #cbd5e1);
		margin-bottom: 0.5rem;
	}

	.field-input {
		width: 100%;
		background: rgba(255,255,255,0.05);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 0.5rem;
		padding: 0.625rem 0.875rem;
		color: #fff;
		font-size: 0.9375rem;
		box-sizing: border-box;
		transition: border-color 0.2s;
	}

	.field-input:focus {
		outline: none;
		border-color: var(--gold);
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
