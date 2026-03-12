<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let editing: number | null = $state(null);
	let showNew = $state(false);
</script>

<svelte:head>
	<title>Manage Publicity | Admin</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<h1>Publicity / News</h1>
		<button class="btn-admin" onclick={() => { showNew = !showNew; editing = null; }}>
			{showNew ? 'Cancel' : '+ Add Article'}
		</button>
	</div>

	{#if form?.error}
		<div class="alert error">{form.error}</div>
	{/if}

	{#if showNew}
		<div class="form-card">
			<h2>New Article</h2>
			<form method="POST" action="?/create" use:enhance={() => { return async ({ update }) => { await update(); showNew = false; }; }}>
				<label>Title <input type="text" name="title" required placeholder="Combat Robotics Team finds Success" /></label>
				<label>Link (external URL) <input type="text" name="link" required placeholder="https://www.kent.edu/..." /></label>
				<div class="form-row">
					<label>Date <input type="text" name="date" placeholder="March 29, 2023" /></label>
					<label>Sort Order <input type="number" name="sortOrder" value="0" /></label>
				</div>
				<label>Image Path <input type="text" name="image" placeholder="/USINGimg/photo.jpg" /></label>
				<label>Summary
					<textarea name="summary" rows="3" placeholder="Brief description of the article..."></textarea>
				</label>
				<button type="submit" class="btn-admin primary">Create</button>
			</form>
		</div>
	{/if}

	<div class="items-list">
		{#each data.items as item}
			<div class="item-row">
				{#if editing === item.id}
					<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { await update(); editing = null; }; }}>
						<input type="hidden" name="id" value={item.id} />
						<label>Title <input type="text" name="title" value={item.title} required /></label>
						<label>Link <input type="text" name="link" value={item.link} required /></label>
						<div class="form-row">
							<label>Date <input type="text" name="date" value={item.date} /></label>
							<label>Sort Order <input type="number" name="sortOrder" value={item.sortOrder} /></label>
						</div>
						<label>Image Path <input type="text" name="image" value={item.image} /></label>
						<label>Summary <textarea name="summary" rows="3">{item.summary}</textarea></label>
						<div class="edit-actions">
							<button type="submit" class="btn-admin primary">Save</button>
							<button type="button" class="btn-admin" onclick={() => editing = null}>Cancel</button>
						</div>
					</form>
				{:else}
					<div class="item-summary">
						<div class="item-info">
							<strong>{item.title}</strong>
							<span class="item-meta">{item.date}</span>
						</div>
						<div class="item-actions">
							<button class="btn-admin small" onclick={() => { editing = item.id; showNew = false; }}>Edit</button>
							<form method="POST" action="?/delete" use:enhance style="display:inline">
								<input type="hidden" name="id" value={item.id} />
								<button type="submit" class="btn-admin small danger" onclick={(e) => { if (!confirm('Delete this article?')) e.preventDefault(); }}>Delete</button>
							</form>
						</div>
					</div>
				{/if}
			</div>
		{/each}
		{#if data.items.length === 0}
			<p class="empty-state">No publicity items yet. Add one above.</p>
		{/if}
	</div>
</div>

<style>
	.admin-page { max-width: 900px; }
	.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
	.page-header h1 { font-size: 1.5rem; }
	.btn-admin { padding: 0.5rem 1rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: var(--bg-card, var(--bg-secondary)); color: inherit; cursor: pointer; font-family: inherit; font-size: 0.875rem; transition: border-color 0.15s; }
	.btn-admin:hover { border-color: var(--gold); }
	.btn-admin.primary { background: var(--gold); color: #000; font-weight: 600; border-color: var(--gold); }
	.btn-admin.small { padding: 0.3rem 0.625rem; font-size: 0.8125rem; }
	.btn-admin.danger { color: #ef4444; }
	.btn-admin.danger:hover { border-color: #ef4444; }
	.alert.error { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem; font-size: 0.875rem; }
	.form-card { background: var(--bg-card, var(--bg-secondary)); border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem; }
	.form-card h2 { font-size: 1.125rem; margin-bottom: 1rem; }
	.form-card form { display: flex; flex-direction: column; gap: 0.75rem; }
	.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; }
	label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.8125rem; color: var(--text-secondary); font-weight: 500; }
	input[type="text"], input[type="number"], textarea { padding: 0.5rem 0.75rem; border: 1px solid var(--border-color); border-radius: 0.375rem; background: var(--bg-primary); color: inherit; font-family: inherit; font-size: 0.875rem; }
	input:focus, textarea:focus { outline: none; border-color: var(--gold); }
	.items-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.item-row { background: var(--bg-card, var(--bg-secondary)); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 1rem; }
	.item-summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
	.item-info { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
	.item-meta { font-size: 0.8125rem; color: var(--text-muted); }
	.item-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
	.edit-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
	.empty-state { text-align: center; color: var(--text-muted); padding: 2rem 0; }
</style>
