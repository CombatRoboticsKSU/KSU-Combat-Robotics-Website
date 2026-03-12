<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';

	let { data, form } = $props();
	let editing: number | null = $state(null);
	let showNew = $state(false);

	// Track which sections are open
	let openSections = $state<Record<string, boolean>>({});
	function toggle(key: string) { openSections[key] = !openSections[key]; }
	function isOpen(key: string) { return openSections[key] ?? false; }

	// ─── State for NEW post form ─────────────────
	let newGallery = $state('');
	let newVideos = $state<{ src: string; poster: string }[]>([]);
	let newYoutubeLinks = $state<{ url: string; label: string }[]>([]);
	let newMediaCoverage = $state<{ text: string; link: string }[]>([]);

	// ─── State for EDIT post form ────────────────
	let editGallery = $state('');
	let editVideos = $state<{ src: string; poster: string }[]>([]);
	let editYoutubeLinks = $state<{ url: string; label: string }[]>([]);
	let editMediaCoverage = $state<{ text: string; link: string }[]>([]);

	function startEditing(post: typeof data.posts[0]) {
		editing = post.id;
		showNew = false;
		openSections = {};

		const gallery = post.galleryImages as string[] | null;
		editGallery = gallery ? gallery.join('\n') : '';

		const vids = post.videos as any[] | null;
		editVideos = vids?.length ? vids.map(v => ({ src: v.src ?? '', poster: v.poster ?? '' })) : [];

		const ytLinks = post.youtubeLinks as any[] | null;
		editYoutubeLinks = ytLinks?.length ? ytLinks.map(y => ({ url: y.url ?? '', label: y.label ?? '' })) : [];

		const mc = post.mediaCoverage as any[] | null;
		editMediaCoverage = mc?.length ? mc.map(m => ({ text: m.text ?? '', link: m.link ?? '' })) : [];
	}

	function resetNew() {
		showNew = !showNew;
		editing = null;
		openSections = {};
		newGallery = '';
		newVideos = [];
		newYoutubeLinks = [];
		newMediaCoverage = [];
	}

	// Serialize helpers
	function serializeGallery(gallery: string): string {
		return JSON.stringify(gallery.split('\n').map(s => s.trim()).filter(Boolean));
	}

	function serializeVideos(videos: { src: string; poster: string }[]): string {
		return JSON.stringify(videos.filter(v => v.src.trim()).map(v => ({
			src: v.src, ...(v.poster.trim() ? { poster: v.poster } : {})
		})));
	}

	function serializeYoutubeLinks(links: { url: string; label: string }[]): string {
		return JSON.stringify(links.filter(l => l.url.trim()).map(l => ({
			url: l.url, ...(l.label.trim() ? { label: l.label } : {})
		})));
	}

	function serializeMediaCoverage(items: { text: string; link: string }[]): string {
		return JSON.stringify(items.filter(m => m.text.trim() && m.link.trim()));
	}
</script>

<svelte:head>
	<title>Manage Posts | Admin</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<h1>Posts / Updates</h1>
		<button class="btn-admin" onclick={resetNew}>
			{showNew ? 'Cancel' : '+ New Post'}
		</button>
	</div>

	{#if form?.error}
		<div class="alert error">{form.error}</div>
	{/if}

	{#if showNew}
		<div class="form-card">
			<h2>New Post</h2>
			<form method="POST" action="?/create" use:enhance={() => { return async ({ update }) => { await update(); showNew = false; }; }}>
				<div class="form-row">
					<label>Title <input type="text" name="title" required /></label>
					<label>Slug (URL) <input type="text" name="slug" required placeholder="my-post" /></label>
				</div>
				<div class="form-row">
					<label>Date <input type="text" name="date" placeholder="March 11, 2026" /></label>
					<label>Tags (comma separated) <input type="text" name="tags" placeholder="events, info" /></label>
				</div>
				<label>Image Path <input type="text" name="image" placeholder="/blog/img/photo.jpg" /></label>
				<label>Excerpt <textarea name="excerpt" rows="2" placeholder="Short summary shown in the post list..."></textarea></label>
				<label>Full Content
					<textarea name="content" rows="12" placeholder="## Section Heading&#10;&#10;Write paragraphs separated by blank lines.&#10;&#10;![Photo description](/blog/img/photo.jpg)&#10;&#10;- List item one&#10;- List item two&#10;&#10;Use **bold text** and [link text](https://example.com) inline."></textarea>
					<span class="format-hint">Blank lines = new paragraph · ## Heading · ![alt](url) = image · [text](url) = link (use https:// for external) · - list item · **bold**</span>
				</label>

				<!-- Gallery Images -->
				<button type="button" class="section-toggle" onclick={() => toggle('new-gallery')}>
					<span class="toggle-arrow" class:open={isOpen('new-gallery')}>&#9654;</span>
					Gallery Images
					<span class="toggle-count">{newGallery.split('\n').filter(s => s.trim()).length} image{newGallery.split('\n').filter(s => s.trim()).length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen('new-gallery')}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						<label>One image path per line
							<textarea rows="3" bind:value={newGallery} placeholder="/blog/img/photo1.jpg&#10;/blog/img/photo2.jpg"></textarea>
						</label>
					</div>
				{/if}
				<input type="hidden" name="galleryImages" value={serializeGallery(newGallery)} />

				<!-- Videos -->
				<button type="button" class="section-toggle" onclick={() => toggle('new-videos')}>
					<span class="toggle-arrow" class:open={isOpen('new-videos')}>&#9654;</span>
					Videos
					<span class="toggle-count">{newVideos.length} video{newVideos.length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen('new-videos')}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						{#each newVideos as video, i}
							<div class="sub-block">
								<div class="form-row">
									<label>Video File Path <input type="text" bind:value={video.src} placeholder="/img/video.mp4" /></label>
									<label>Poster Image <input type="text" bind:value={video.poster} placeholder="/img/poster.png (optional)" /></label>
									<button type="button" class="btn-icon remove self-end" onclick={() => newVideos = newVideos.filter((_, j) => j !== i)} title="Remove">&times;</button>
								</div>
							</div>
						{/each}
						<button type="button" class="btn-add" onclick={() => newVideos = [...newVideos, { src: '', poster: '' }]}>+ Add Video</button>
					</div>
				{/if}
				<input type="hidden" name="videos" value={serializeVideos(newVideos)} />

				<!-- YouTube Links -->
				<button type="button" class="section-toggle" onclick={() => toggle('new-youtube')}>
					<span class="toggle-arrow" class:open={isOpen('new-youtube')}>&#9654;</span>
					YouTube Links
					<span class="toggle-count">{newYoutubeLinks.length} link{newYoutubeLinks.length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen('new-youtube')}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						{#each newYoutubeLinks as yt, i}
							<div class="kv-row">
								<input type="text" placeholder="YouTube embed URL" bind:value={yt.url} />
								<input type="text" placeholder="Label (optional)" bind:value={yt.label} />
								<button type="button" class="btn-icon remove" onclick={() => newYoutubeLinks = newYoutubeLinks.filter((_, j) => j !== i)} title="Remove">&times;</button>
							</div>
						{/each}
						<button type="button" class="btn-add" onclick={() => newYoutubeLinks = [...newYoutubeLinks, { url: '', label: '' }]}>+ Add YouTube Link</button>
					</div>
				{/if}
				<input type="hidden" name="youtubeLinks" value={serializeYoutubeLinks(newYoutubeLinks)} />

				<!-- Media Coverage -->
				<button type="button" class="section-toggle" onclick={() => toggle('new-media')}>
					<span class="toggle-arrow" class:open={isOpen('new-media')}>&#9654;</span>
					Media Coverage
					<span class="toggle-count">{newMediaCoverage.length} article{newMediaCoverage.length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen('new-media')}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						{#each newMediaCoverage as item, i}
							<div class="sub-block">
								<div class="form-row">
									<label>Description <input type="text" bind:value={item.text} placeholder="Article about this post" /></label>
									<label>Link <input type="text" bind:value={item.link} placeholder="https://..." /></label>
									<button type="button" class="btn-icon remove self-end" onclick={() => newMediaCoverage = newMediaCoverage.filter((_, j) => j !== i)} title="Remove">&times;</button>
								</div>
							</div>
						{/each}
						<button type="button" class="btn-add" onclick={() => newMediaCoverage = [...newMediaCoverage, { text: '', link: '' }]}>+ Add Coverage</button>
					</div>
				{/if}
				<input type="hidden" name="mediaCoverage" value={serializeMediaCoverage(newMediaCoverage)} />

				<label class="checkbox-label">
					<input type="checkbox" name="published" value="true" />
					Published
				</label>
				<button type="submit" class="btn-admin primary">Create</button>
			</form>
		</div>
	{/if}

	<div class="items-list">
		{#each data.posts as post}
			<div class="item-row">
				{#if editing === post.id}
					<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { await update(); editing = null; }; }}>
						<input type="hidden" name="id" value={post.id} />
						<div class="form-row">
							<label>Title <input type="text" name="title" value={post.title} required /></label>
							<label>Slug <input type="text" name="slug" value={post.slug} required /></label>
						</div>
						<div class="form-row">
							<label>Date <input type="text" name="date" value={post.date} /></label>
							<label>Tags <input type="text" name="tags" value={(post.tags as string[]).join(', ')} /></label>
						</div>
						<label>Image Path <input type="text" name="image" value={post.image} /></label>
						<label>Excerpt <textarea name="excerpt" rows="2">{post.excerpt}</textarea></label>
						<label>Full Content
						<textarea name="content" rows="12">{post.content}</textarea>
						<span class="format-hint">Blank lines = new paragraph · ## Heading · ![alt](url) = image · [text](url) = link (use https:// for external) · - list item · **bold**</span>
					</label>

						<!-- Gallery Images -->
						<button type="button" class="section-toggle" onclick={() => toggle(`edit-gallery-${post.id}`)}>
							<span class="toggle-arrow" class:open={isOpen(`edit-gallery-${post.id}`)}>&#9654;</span>
							Gallery Images
							<span class="toggle-count">{editGallery.split('\n').filter(s => s.trim()).length} image{editGallery.split('\n').filter(s => s.trim()).length !== 1 ? 's' : ''}</span>
						</button>
						{#if isOpen(`edit-gallery-${post.id}`)}
							<div class="section-body" transition:slide={{ duration: 200 }}>
								<label>One image path per line
									<textarea rows="3" bind:value={editGallery}></textarea>
								</label>
							</div>
						{/if}
						<input type="hidden" name="galleryImages" value={serializeGallery(editGallery)} />

						<!-- Videos -->
						<button type="button" class="section-toggle" onclick={() => toggle(`edit-videos-${post.id}`)}>
							<span class="toggle-arrow" class:open={isOpen(`edit-videos-${post.id}`)}>&#9654;</span>
							Videos
							<span class="toggle-count">{editVideos.length} video{editVideos.length !== 1 ? 's' : ''}</span>
						</button>
						{#if isOpen(`edit-videos-${post.id}`)}
							<div class="section-body" transition:slide={{ duration: 200 }}>
								{#each editVideos as video, i}
									<div class="sub-block">
										<div class="form-row">
											<label>Video File Path <input type="text" bind:value={video.src} /></label>
											<label>Poster Image <input type="text" bind:value={video.poster} placeholder="(optional)" /></label>
											<button type="button" class="btn-icon remove self-end" onclick={() => editVideos = editVideos.filter((_, j) => j !== i)} title="Remove">&times;</button>
										</div>
									</div>
								{/each}
								<button type="button" class="btn-add" onclick={() => editVideos = [...editVideos, { src: '', poster: '' }]}>+ Add Video</button>
							</div>
						{/if}
						<input type="hidden" name="videos" value={serializeVideos(editVideos)} />

						<!-- YouTube Links -->
						<button type="button" class="section-toggle" onclick={() => toggle(`edit-youtube-${post.id}`)}>
							<span class="toggle-arrow" class:open={isOpen(`edit-youtube-${post.id}`)}>&#9654;</span>
							YouTube Links
							<span class="toggle-count">{editYoutubeLinks.length} link{editYoutubeLinks.length !== 1 ? 's' : ''}</span>
						</button>
						{#if isOpen(`edit-youtube-${post.id}`)}
							<div class="section-body" transition:slide={{ duration: 200 }}>
								{#each editYoutubeLinks as yt, i}
									<div class="kv-row">
										<input type="text" placeholder="YouTube embed URL" bind:value={yt.url} />
										<input type="text" placeholder="Label (optional)" bind:value={yt.label} />
										<button type="button" class="btn-icon remove" onclick={() => editYoutubeLinks = editYoutubeLinks.filter((_, j) => j !== i)} title="Remove">&times;</button>
									</div>
								{/each}
								<button type="button" class="btn-add" onclick={() => editYoutubeLinks = [...editYoutubeLinks, { url: '', label: '' }]}>+ Add YouTube Link</button>
							</div>
						{/if}
						<input type="hidden" name="youtubeLinks" value={serializeYoutubeLinks(editYoutubeLinks)} />

						<!-- Media Coverage -->
						<button type="button" class="section-toggle" onclick={() => toggle(`edit-media-${post.id}`)}>
							<span class="toggle-arrow" class:open={isOpen(`edit-media-${post.id}`)}>&#9654;</span>
							Media Coverage
							<span class="toggle-count">{editMediaCoverage.length} article{editMediaCoverage.length !== 1 ? 's' : ''}</span>
						</button>
						{#if isOpen(`edit-media-${post.id}`)}
							<div class="section-body" transition:slide={{ duration: 200 }}>
								{#each editMediaCoverage as item, i}
									<div class="sub-block">
										<div class="form-row">
											<label>Description <input type="text" bind:value={item.text} /></label>
											<label>Link <input type="text" bind:value={item.link} /></label>
											<button type="button" class="btn-icon remove self-end" onclick={() => editMediaCoverage = editMediaCoverage.filter((_, j) => j !== i)} title="Remove">&times;</button>
										</div>
									</div>
								{/each}
								<button type="button" class="btn-add" onclick={() => editMediaCoverage = [...editMediaCoverage, { text: '', link: '' }]}>+ Add Coverage</button>
							</div>
						{/if}
						<input type="hidden" name="mediaCoverage" value={serializeMediaCoverage(editMediaCoverage)} />

						<label class="checkbox-label">
							<input type="checkbox" name="published" value="true" checked={post.published} />
							Published
						</label>
						<div class="edit-actions">
							<button type="submit" class="btn-admin primary">Save</button>
							<button type="button" class="btn-admin" onclick={() => editing = null}>Cancel</button>
						</div>
					</form>
				{:else}
					<div class="item-summary">
						<div class="item-info">
							<strong>{post.title}</strong>
							<span class="item-meta">{post.date}</span>
							<span class="item-badge" class:published={post.published}>{post.published ? 'Published' : 'Draft'}</span>
						</div>
						<div class="item-actions">
							<button class="btn-admin small" onclick={() => startEditing(post)}>Edit</button>
							<form method="POST" action="?/delete" use:enhance style="display:inline">
								<input type="hidden" name="id" value={post.id} />
								<button type="submit" class="btn-admin small danger" onclick={(e) => { if (!confirm('Delete this post?')) e.preventDefault(); }}>Delete</button>
							</form>
						</div>
					</div>
				{/if}
			</div>
		{/each}
		{#if data.posts.length === 0}
			<p class="empty-state">No posts yet. Create one above.</p>
		{/if}
	</div>
</div>

<style>
	.admin-page { }
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
	.checkbox-label { flex-direction: row; align-items: center; gap: 0.5rem; }
  input[type="text"], textarea { padding: 0.5rem 0.75rem; border: 1px solid var(--border-color); border-radius: 0.375rem; background: var(--bg-primary); color: inherit; font-family: inherit; font-size: 0.875rem; }
	input:focus, textarea:focus { outline: none; border-color: var(--gold); }

	/* ─── Collapsible sections ─── */
	.section-toggle {
		display: flex; align-items: center; gap: 0.5rem; width: 100%;
		padding: 0.625rem 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem;
		background: var(--bg-primary); color: inherit; font-family: inherit;
		font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: border-color 0.15s; text-align: left;
	}
	.section-toggle:hover { border-color: var(--gold); }
	.toggle-arrow { font-size: 0.625rem; transition: transform 0.2s; color: var(--text-muted); }
	.toggle-arrow.open { transform: rotate(90deg); }
	.toggle-count { margin-left: auto; font-weight: 400; font-size: 0.75rem; color: var(--text-muted); }
	.section-body {
		border: 1px solid var(--border-color); border-top: none; border-radius: 0 0 0.5rem 0.5rem;
		padding: 1rem; margin-top: -0.375rem; display: flex; flex-direction: column; gap: 0.75rem; background: var(--bg-primary);
	}
	.kv-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.5rem; align-items: end; }
	.sub-block {
		background: var(--bg-card, var(--bg-secondary)); border: 1px solid var(--border-color);
		border-radius: 0.375rem; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;
	}
	.btn-icon {
		width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
		border: 1px solid var(--border-color); border-radius: 0.25rem; background: transparent;
		color: var(--text-muted); cursor: pointer; font-size: 1.125rem; line-height: 1; flex-shrink: 0; transition: all 0.15s;
	}
	.btn-icon.remove:hover { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.08); }
	.btn-icon.self-end { align-self: end; margin-bottom: 0.25rem; }
	.btn-add {
		align-self: flex-start; padding: 0.3rem 0.75rem; border: 1px dashed var(--border-color);
		border-radius: 0.375rem; background: transparent; color: var(--text-muted);
		font-size: 0.8125rem; font-family: inherit; cursor: pointer; transition: all 0.15s;
	}
	.btn-add:hover { border-color: var(--gold); color: var(--gold); }

	.items-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.item-row { background: var(--bg-card, var(--bg-secondary)); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 1rem; }
	.item-summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
	.item-info { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
	.item-meta { font-size: 0.8125rem; color: var(--text-muted); }
	.item-badge { font-size: 0.6875rem; padding: 0.125rem 0.5rem; border-radius: 100px; background: rgba(156, 163, 175, 0.15); color: #9ca3af; }
	.item-badge.published { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
	.item-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
	.edit-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
	.empty-state { text-align: center; color: var(--text-muted); padding: 2rem 0; }
	.format-hint { font-size: 0.6875rem; color: var(--text-muted); font-weight: 400; margin-top: 0.25rem; }

	@media (max-width: 640px) {
		.kv-row { grid-template-columns: 1fr auto; }
		.kv-row input:first-child { grid-column: 1 / -1; }
	}
</style>
