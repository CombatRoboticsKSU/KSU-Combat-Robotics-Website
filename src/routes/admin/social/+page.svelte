<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let showForm = $state(false);
	let editing = $state<typeof data.links[0] | null>(null);

	function openNew() { editing = null; showForm = true; }
	function openEdit(l: typeof data.links[0]) { editing = l; showForm = true; }
	function closeForm() { showForm = false; editing = null; }
</script>

<svelte:head>
	<title>Social Links | Admin</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<h1>Social Links</h1>
		<button class="btn-admin primary" onclick={openNew}>+ Add Link</button>
	</div>

	<p class="page-desc">These links appear in the navbar and footer. Add any platform — Instagram, YouTube, Discord, etc.</p>

	{#if form?.success}
		<div class="alert-success">Saved!</div>
	{/if}

	{#if showForm}
		<div class="form-card">
			<h3>{editing ? 'Edit Link' : 'New Link'}</h3>
			<form
				method="POST"
				action={editing ? '?/update' : '?/create'}
				use:enhance={() => ({ result }) => { if (result.type !== 'failure') closeForm(); }}
			>
				{#if editing}
					<input type="hidden" name="id" value={editing.id} />
				{/if}
				<div class="form-row">
					<div>
						<label class="field-label" for="label">Label</label>
						<input id="label" name="label" type="text" class="field-input" value={editing?.label ?? ''} placeholder="e.g. YouTube" required />
					</div>
					<div>
						<label class="field-label" for="url">URL</label>
						<input id="url" name="url" type="url" class="field-input" value={editing?.url ?? ''} placeholder="https://" required />
					</div>
					<div>
						<label class="field-label" for="sortOrder">Order</label>
						<input id="sortOrder" name="sortOrder" type="number" class="field-input" value={editing?.sortOrder ?? 0} />
					</div>
				</div>
				<div class="form-actions">
					<button type="submit" class="btn-admin primary">{editing ? 'Save' : 'Add'}</button>
					<button type="button" class="btn-admin ghost" onclick={closeForm}>Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	{#if data.links.length === 0}
		<div class="empty-state">No social links yet.</div>
	{:else}
		<div class="items-list">
			{#each data.links as link}
				<div class="list-item">
					<div class="item-info">
						<span class="item-name">{link.label}</span>
						<a href={link.url} target="_blank" rel="noopener noreferrer" class="item-url">{link.url}</a>
					</div>
					<span class="sort-badge">#{link.sortOrder}</span>
					<div class="item-actions">
						<button class="btn-admin ghost sm" onclick={() => openEdit(link)}>Edit</button>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={link.id} />
							<button
								type="submit"
								class="btn-admin danger sm"
								onclick={(e) => { if (!confirm(`Delete ${link.label}?`)) e.preventDefault(); }}
							>Delete</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
		border-bottom: 1px solid rgba(255,255,255,0.05);
		padding-bottom: 1.5rem;
	}

	.page-header h1 { font-size: 1.875rem; font-weight: 700; color: #fff; }

	.page-desc { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem; }

	.alert-success {
		background: rgba(34,197,94,0.1);
		border: 1px solid rgba(34,197,94,0.3);
		color: #4ade80;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.form-card {
		background: #1e293b;
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.form-card h3 { font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 1.25rem; }

	.form-row { display: grid; grid-template-columns: 1fr 2fr auto; gap: 1rem; align-items: end; }

	.field-label { display: block; font-size: 0.875rem; font-weight: 500; color: #cbd5e1; margin-bottom: 0.5rem; }

	.field-input {
		width: 100%;
		background: rgba(255,255,255,0.05);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 0.5rem;
		padding: 0.625rem 0.875rem;
		color: #fff;
		font-size: 0.9375rem;
		box-sizing: border-box;
	}

	.field-input:focus { outline: none; border-color: var(--gold); }

	.form-actions { display: flex; gap: 0.75rem; margin-top: 1rem; }

	.items-list { display: flex; flex-direction: column; gap: 0.75rem; }

	.list-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: #1e293b;
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 0.75rem;
		padding: 0.875rem 1rem;
	}

	.item-info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
	.item-name { font-weight: 600; color: #fff; }
	.item-url { font-size: 0.8125rem; color: var(--text-muted); text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.item-url:hover { color: var(--gold); }

	.sort-badge { font-size: 0.75rem; color: var(--text-muted); background: rgba(255,255,255,0.05); border-radius: 0.375rem; padding: 0.2rem 0.5rem; flex-shrink: 0; }

	.item-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }

	.empty-state {
		color: var(--text-muted);
		padding: 2rem;
		text-align: center;
		background: #1e293b;
		border: 1px dashed rgba(255,255,255,0.08);
		border-radius: 0.75rem;
	}

	.btn-admin {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.625rem 1.25rem;
		border-radius: 0.5rem;
		font-size: 0.9375rem;
		font-weight: 600;
		cursor: pointer;
		border: 1px solid transparent;
		transition: all 0.2s;
		background: transparent;
	}

	.btn-admin.primary { background: var(--gold); color: #000; border-color: var(--gold); }
	.btn-admin.primary:hover { background: #d4981a; }
	.btn-admin.ghost { background: rgba(255,255,255,0.06); color: var(--text-secondary); border-color: rgba(255,255,255,0.1); }
	.btn-admin.ghost:hover { background: rgba(255,255,255,0.1); color: #fff; }
	.btn-admin.danger { background: rgba(239,68,68,0.1); color: #f87171; border-color: rgba(239,68,68,0.2); }
	.btn-admin.danger:hover { background: rgba(239,68,68,0.2); }
	.btn-admin.sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
</style>
