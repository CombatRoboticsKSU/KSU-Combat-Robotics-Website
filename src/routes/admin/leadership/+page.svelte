<script lang="ts">
	import { enhance } from '$app/forms';
	import ImageUpload from '$lib/components/ImageUpload.svelte';

	let { data, form } = $props();
	let editing: number | null = $state(null);
	let showNew = $state(false);
	let newImage = $state('');
	let editImage = $state('');
	let groupPhotoValue = $state(data.groupPhoto);
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

	<!-- Group Photo Setting -->
	<div class="form-card" style="margin-bottom: 1.5rem;">
		<h2>Group Photo</h2>
		<form method="POST" action="?/updateGroupPhoto" use:enhance>
			<ImageUpload bind:value={groupPhotoValue} name="groupPhoto" folder="leadership" label="Group Photo" />
			<button type="submit" class="btn-admin primary" style="margin-top: 0.5rem;">Update Group Photo</button>
		</form>
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
				<ImageUpload bind:value={newImage} name="image" folder="leadership" label="Photo" />
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
							<ImageUpload bind:value={editImage} name="image" folder="leadership" label="Photo" />
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
							<button class="btn-admin small" onclick={() => { editing = member.id; editImage = member.image; showNew = false; }}>Edit</button>
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
.page-header {
display: flex;
align-items: flex-start;
justify-content: space-between;
margin-bottom: 2.5rem;
border-bottom: 1px solid rgba(255,255,255,0.05);
padding-bottom: 1.5rem;
}
.page-header h1 { font-size: 1.875rem; font-weight: 700; color: #fff; margin-bottom: 0.375rem; }
.btn-admin { padding: 0.625rem 1.25rem; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: var(--text-primary); cursor: pointer; font-weight: 500; transition: all 0.2s; }
.btn-admin:hover { background: rgba(255,255,255,0.05); }
.btn-admin.primary { background: var(--gold); color: #000; font-weight: 600; border-color: var(--gold); }
.btn-admin.primary:hover { background: #d4981a; }
.btn-admin.small { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
.btn-admin.danger { color: #ef4444; background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); }
.btn-admin.danger:hover { background: rgba(239, 68, 68, 0.2); }
.alert.error { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem; }
.form-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.05); border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
.form-card h2 { font-size: 1.125rem; margin-bottom: 1rem; color: #fff; }
.form-card form, .edit-grid { display: flex; flex-direction: column; gap: 0.75rem; }
label { display: flex; flex-direction: column; gap: 0.375rem; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); }
input[type="text"], input[type="number"], textarea { padding: 0.625rem 0.875rem; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.1); background: #0f172a; color: #fff; font-family: inherit; font-size: 0.9375rem; }
input:focus, textarea:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 2px rgba(235, 171, 33, 0.2); }
.checkbox-label { flex-direction: row; align-items: center; color: #fff; gap: 0.5rem; }
.items-list { display: flex; flex-direction: column; gap: 0.75rem; }
.item-row { background: #1e293b; border: 1px solid rgba(255,255,255,0.05); border-radius: 0.75rem; padding: 1rem; transition: all 0.2s; }
.item-row:hover { border-color: rgba(255,255,255,0.1); }
.item-summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.item-info { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.item-info strong { color: #fff; font-size: 1.125rem; }
.item-meta { font-size: 0.875rem; color: var(--text-muted); }
.item-badge { padding: 0.25rem 0.625rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 500; background: rgba(148, 163, 184, 0.15); color: #94a3b8; }
.item-badge.current { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
.item-actions { display: flex; gap: 0.5rem; }
.edit-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
.empty-state { text-align: center; color: var(--text-muted); font-style: normal; padding: 2rem; }
</style>

