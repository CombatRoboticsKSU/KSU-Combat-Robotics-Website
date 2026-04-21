<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<svelte:head>
	<title>Manage Users | Admin</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<h1>Users</h1>
		<span class="header-meta">{data.users.length} registered</span>
	</div>

	<div class="items-list">
		{#each data.users as u}
			<div class="item-row">
				<div class="item-summary">
					<div class="item-info">
						<strong>{u.name}</strong>
						<span class="item-meta">{u.email}</span>
						<span class="item-badge" class:admin={u.role === 'admin'}>
							{u.role ?? 'user'}
						</span>
						<span class="item-meta">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</span>
					</div>
					<div class="item-actions">
						{#if u.role === 'admin'}
							<form method="POST" action="?/demote" use:enhance style="display:inline">
								<input type="hidden" name="id" value={u.id} />
								<button type="submit" class="btn-admin small demote">Remove Admin</button>
							</form>
						{:else}
							<form method="POST" action="?/promote" use:enhance style="display:inline">
								<input type="hidden" name="id" value={u.id} />
								<button type="submit" class="btn-admin small promote">Make Admin</button>
							</form>
						{/if}
						<form method="POST" action="?/delete" use:enhance style="display:inline">
							<input type="hidden" name="id" value={u.id} />
							<button type="submit" class="btn-admin small danger" onclick={(e) => { if (!confirm('Delete this user? This cannot be undone.')) e.preventDefault(); }}>Delete</button>
						</form>
					</div>
				</div>
			</div>
		{/each}

		{#if data.users.length === 0}
			<p class="empty-state">No users registered yet.</p>
		{/if}
	</div>
</div>

<style>
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.page-header h1 { font-size: 1.5rem; }

	.header-meta {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

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
	.btn-admin.small { padding: 0.3rem 0.625rem; font-size: 0.8125rem; }
	.btn-admin.danger { color: #ef4444; }
	.btn-admin.danger:hover { border-color: #ef4444; }
	.btn-admin.promote { color: #22c55e; }
	.btn-admin.promote:hover { border-color: #22c55e; }
	.btn-admin.demote { color: #fbbf24; }
	.btn-admin.demote:hover { border-color: #fbbf24; }

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
		text-transform: uppercase;
		font-weight: 600;
	}

	.item-badge.admin {
		background: rgba(235, 171, 33, 0.15);
		color: var(--gold);
	}

	.item-actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.empty-state {
		text-align: center;
		color: var(--text-muted);
		padding: 2rem 0;
	}
</style>
