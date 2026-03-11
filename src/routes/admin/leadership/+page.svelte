<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let editing: number | null = $state(null);
	let showNew = $state(false);
</script>

<svelte:head>
	<title>Manage Leadership | Admin</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<h1>Leadership</h1>
		<button class="btn-admin" onclick={() => { showNew = !showNew; editing = null; }}>
			{showNew ? 'Cancel' : '+ Add Member'}
		</button>
	</div>

	{#if form?.error}
		<div class="alert error">{form.error}</div>
	{/if}

	{#if showNew}
		<div class="form-card">
			<h2>New Member</h2>
			<form method="POST" action="?/create" use:enhance={() => { return async ({ update }) => { await update(); showNew = false; }; }}>
				<label>Name <input type="text" name="name" required /></label>
				<label>Title / Position <input type="text" name="title" required /></label>
				<label>Image Path <input type="text" name="image" placeholder="/USINGimg/placeholder.png" /></label>
				<label>Bio <textarea name="bio" rows="3"></textarea></label>
				<label>Stats (one per line) <textarea name="stats" rows="4" placeholder="Years in Robotics: 2&#10;Club Member: 1 year&#10;Major: Engineering"></textarea></label>
				<label>Sort Order <input type="number" name="sortOrder" value="0" /></label>
				<label class="checkbox-label">
					<input type="checkbox" name="isCurrent" value="true" checked />
					Current member
				</label>
				<button type="submit" class="btn-admin primary">Create</button>
			</form>
		</div>
	{/if}

	<div class="items-list">
		{#each data.members as member}
			<div class="item-row">
				{#if editing === member.id}
					<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { await update(); editing = null; }; }}>
						<input type="hidden" name="id" value={member.id} />
						<div class="edit-grid">
							<label>Name <input type="text" name="name" value={member.name} required /></label>
							<label>Title <input type="text" name="title" value={member.title} required /></label>
							<label>Image Path <input type="text" name="image" value={member.image} /></label>
							<label>Bio <textarea name="bio" rows="3">{member.bio}</textarea></label>
							<label>Stats (one per line) <textarea name="stats" rows="4">{(member.stats as string[]).join('\n')}</textarea></label>
							<label>Sort Order <input type="number" name="sortOrder" value={member.sortOrder} /></label>
							<label class="checkbox-label">
								<input type="checkbox" name="isCurrent" value="true" checked={member.isCurrent} />
								Current member
							</label>
						</div>
						<div class="edit-actions">
							<button type="submit" class="btn-admin primary">Save</button>
							<button type="button" class="btn-admin" onclick={() => editing = null}>Cancel</button>
						</div>
					</form>
				{:else}
					<div class="item-summary">
						<div class="item-info">
							<strong>{member.name}</strong>
							<span class="item-meta">{member.title}</span>
							<span class="item-badge" class:current={member.isCurrent}>{member.isCurrent ? 'Current' : 'Former'}</span>
						</div>
						<div class="item-actions">
							<button class="btn-admin small" onclick={() => { editing = member.id; showNew = false; }}>Edit</button>
							<form method="POST" action="?/delete" use:enhance style="display:inline">
								<input type="hidden" name="id" value={member.id} />
								<button type="submit" class="btn-admin small danger" onclick={(e) => { if (!confirm('Delete this member?')) e.preventDefault(); }}>Delete</button>
							</form>
						</div>
					</div>
				{/if}
			</div>
		{/each}

		{#if data.members.length === 0}
			<p class="empty-state">No leadership members yet. Add one above.</p>
		{/if}
	</div>
</div>

<style>
	.admin-page { max-width: 900px; }

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.page-header h1 { font-size: 1.5rem; }

	.btn-admin {
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		background: var(--bg-card, var(--bg-secondary));
		color: inherit;
		cursor: pointer;
		font-family: inherit;
		font-size: 0.875rem;
		transition: border-color 0.15s;
	}

	.btn-admin:hover { border-color: var(--gold); }
	.btn-admin.primary { background: var(--gold); color: #000; font-weight: 600; border-color: var(--gold); }
	.btn-admin.small { padding: 0.3rem 0.625rem; font-size: 0.8125rem; }
	.btn-admin.danger { color: #ef4444; }
	.btn-admin.danger:hover { border-color: #ef4444; }

	.alert.error {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		color: #ef4444;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.form-card {
		background: var(--bg-card, var(--bg-secondary));
		border: 1px solid var(--border-color);
		border-radius: 0.75rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.form-card h2 { font-size: 1.125rem; margin-bottom: 1rem; }

	.form-card form, .edit-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.8125rem;
		color: var(--text-secondary);
		font-weight: 500;
	}

	input[type="text"], input[type="number"], textarea {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background: var(--bg-primary);
		color: inherit;
		font-family: inherit;
		font-size: 0.875rem;
	}

	input:focus, textarea:focus {
		outline: none;
		border-color: var(--gold);
	}

	.checkbox-label {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}

	.items-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.item-row {
		background: var(--bg-card, var(--bg-secondary));
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		padding: 1rem;
	}

	.item-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.item-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.item-meta {
		font-size: 0.8125rem;
		color: var(--text-muted);
	}

	.item-badge {
		font-size: 0.6875rem;
		padding: 0.125rem 0.5rem;
		border-radius: 100px;
		background: rgba(156, 163, 175, 0.15);
		color: #9ca3af;
	}

	.item-badge.current {
		background: rgba(34, 197, 94, 0.1);
		color: #22c55e;
	}

	.item-actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.edit-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.empty-state {
		text-align: center;
		color: var(--text-muted);
		padding: 3rem 0;
	}
</style>
