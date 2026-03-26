<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import GalleryUpload from '$lib/components/GalleryUpload.svelte';
	import { Printer, Box, Timer, Bot, Wrench, Cpu, Hammer, Zap, Cog, Code, Shield, Hexagon, Component, Radio, Rocket, Activity, Gamepad2, PenTool } from 'lucide-svelte';

	const availableIcons: Record<string, any> = {
		Printer, Box, Timer, Bot, Wrench, Cpu, Hammer, Zap, Cog, Code, Shield, Hexagon, Component, Radio, Rocket, Activity, Gamepad2, PenTool
	};
	const iconNames = Object.keys(availableIcons);

	let { data, form } = $props();
	let editing: number | null = $state(null);
	let showNew = $state(false);

	// Track which sections are open
	let openSections = $state<Record<string, boolean>>({});
	function toggle(key: string) { openSections[key] = !openSections[key]; }
	function isOpen(key: string) { return openSections[key] ?? false; }

	// ─── Friendly field state for NEW project form ─────────────
	let newIcon = $state('Box');
	let newImage = $state('');
	let newSpecs = $state<{ key: string; value: string }[]>([{ key: '', value: '' }]);
	let newTeam = $state<{ role: string; name: string; history: string }[]>([{ role: '', name: '', history: '' }]);
	let newGallery = $state('');
	let newVideos = $state<{ src: string; poster: string }[]>([]);
	let newYoutubeLinks = $state<{ url: string; label: string }[]>([]);
	let newMediaCoverage = $state<{ text: string; link: string }[]>([]);

	// ─── Friendly field state for EDIT project form ────────────
	let editIcon = $state('Box');
	let editImage = $state('');
	let editSpecs = $state<{ key: string; value: string }[]>([]);
	let editTeam = $state<{ role: string; name: string; history: string }[]>([]);
	let editGallery = $state('');
	let editVideos = $state<{ src: string; poster: string }[]>([]);
	let editYoutubeLinks = $state<{ url: string; label: string }[]>([]);
	let editMediaCoverage = $state<{ text: string; link: string }[]>([]);

	function startEditing(project: typeof data.projects[0]) {
		editing = project.id;
		showNew = false;
		openSections = {};

		editIcon = project.icon ?? 'Box';
		editImage = project.image ?? '';

		const specs = project.specs as Record<string, string> | null;
		editSpecs = specs && Object.keys(specs).length ? Object.entries(specs).map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }];

		const team = project.team as any[] | null;
		editTeam = team && team.length ? team.map(t => ({
			role: t.role ?? '', name: t.name ?? '',
			history: (t.history ?? []).join('\n')
		})) : [{ role: '', name: '', history: '' }];

		const gallery = project.galleryImages as string[] | null;
		editGallery = gallery ? gallery.join('\n') : '';

		const vids = project.videos as any[] | null;
		editVideos = vids?.length ? vids.map(v => ({ src: v.src ?? '', poster: v.poster ?? '' })) : [];

		const ytLinks = project.youtubeLinks as any[] | null;
		editYoutubeLinks = ytLinks?.length ? ytLinks.map(y => ({ url: y.url ?? '', label: y.label ?? '' })) : [];

		const mc = project.mediaCoverage as any[] | null;
		editMediaCoverage = mc?.length ? mc.map(m => ({ text: m.text ?? '', link: m.link ?? '' })) : [];
	}

	function resetNew() {
		showNew = !showNew;
		editing = null;
		openSections = {};
		newIcon = 'Box';
		newImage = '';
		newSpecs = [{ key: '', value: '' }];
		newTeam = [{ role: '', name: '', history: '' }];
		newGallery = '';
		newVideos = [];
		newYoutubeLinks = [];
		newMediaCoverage = [];
	}

	// Serialize helpers
	function serializeSpecs(specs: { key: string; value: string }[]): string {
		const obj: Record<string, string> = {};
		for (const s of specs) { if (s.key.trim()) obj[s.key.trim()] = s.value; }
		return JSON.stringify(obj);
	}

	function serializeTeam(team: { role: string; name: string; history: string }[]): string {
		return JSON.stringify(team.filter(t => t.name.trim()).map(t => ({
			role: t.role, name: t.name,
			history: t.history.split('\n').map(h => h.trim()).filter(Boolean)
		})));
	}

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

	function countFilled(specs: { key: string }[]) { return specs.filter(s => s.key.trim()).length; }
</script>

<svelte:head>
	<title>Manage Projects | Admin</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<h1>Projects</h1>
		<button class="btn-admin" onclick={resetNew}>
			{showNew ? 'Cancel' : '+ Add Project'}
		</button>
	</div>

	{#if form?.error}
		<div class="alert error">{form.error}</div>
	{/if}

	{#if showNew}
		<div class="form-card">
			<h2>New Project</h2>
			<form method="POST" action="?/create" use:enhance={() => { return async ({ update }) => { await update(); showNew = false; }; }}>
				<div class="form-row">
					<label>Name <input type="text" name="name" required /></label>
					<label>Slug (URL) <input type="text" name="slug" required placeholder="printer" /></label>
				</div>
				<div style="font-weight: 500; font-size: 0.875rem; margin-bottom: 0.5rem;">Icon</div>
				<input type="hidden" name="icon" value={newIcon} />
				<div class="icon-picker">
					{#each iconNames as iconName}
						{@const Icon = availableIcons[iconName]}
						<button
							type="button"
							class="icon-btn"
							class:selected={newIcon === iconName}
							onclick={() => newIcon = iconName}
							title={iconName}
						>
							<Icon size={20} />
						</button>
					{/each}
				</div>
				<ImageUpload bind:value={newImage} name="image" folder="projects" label="Image" />
				<label>Short Description <input type="text" name="description" placeholder="Brief one-line summary" /></label>

				<!-- About -->
				<button type="button" class="section-toggle" onclick={() => toggle('new-about')}>
					<span class="toggle-arrow" class:open={isOpen('new-about')}>&#9654;</span>
					About / Overview
				</button>
				{#if isOpen('new-about')}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						<label>About content (separate paragraphs with a blank line)
							<textarea name="about" rows="6" placeholder="Detailed description of the project..."></textarea>
						</label>
					</div>
				{/if}

				<!-- Specs -->
				<button type="button" class="section-toggle" onclick={() => toggle('new-specs')}>
					<span class="toggle-arrow" class:open={isOpen('new-specs')}>&#9654;</span>
					Specs
					<span class="toggle-count">{countFilled(newSpecs)} item{countFilled(newSpecs) !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen('new-specs')}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						{#each newSpecs as spec, i}
							<div class="kv-row">
								<input type="text" placeholder="Label (e.g. Build Volume)" bind:value={spec.key} />
								<input type="text" placeholder="Value (e.g. 350x350x350mm)" bind:value={spec.value} />
								<button type="button" class="btn-icon remove" onclick={() => newSpecs = newSpecs.filter((_, j) => j !== i)} title="Remove">&times;</button>
							</div>
						{/each}
						<button type="button" class="btn-add" onclick={() => newSpecs = [...newSpecs, { key: '', value: '' }]}>+ Add Spec</button>
					</div>
				{/if}
				<input type="hidden" name="specs" value={serializeSpecs(newSpecs)} />

				<!-- Team -->
				<button type="button" class="section-toggle" onclick={() => toggle('new-team')}>
					<span class="toggle-arrow" class:open={isOpen('new-team')}>&#9654;</span>
					Team Members
					<span class="toggle-count">{newTeam.filter(t => t.name.trim()).length} member{newTeam.filter(t => t.name.trim()).length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen('new-team')}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						{#each newTeam as member, i}
							<div class="sub-block">
								<div class="form-row">
									<label>Role <input type="text" bind:value={member.role} placeholder="Lead" /></label>
									<label>Name <input type="text" bind:value={member.name} placeholder="Austin T." /></label>
									<button type="button" class="btn-icon remove self-end" onclick={() => newTeam = newTeam.filter((_, j) => j !== i)} title="Remove">&times;</button>
								</div>
								<label>History (one per line) <textarea rows="2" bind:value={member.history} placeholder="Austin T (2022-Current)"></textarea></label>
							</div>
						{/each}
						<button type="button" class="btn-add" onclick={() => newTeam = [...newTeam, { role: '', name: '', history: '' }]}>+ Add Team Member</button>
					</div>
				{/if}
				<input type="hidden" name="team" value={serializeTeam(newTeam)} />

				<!-- Gallery -->
				<button type="button" class="section-toggle" onclick={() => toggle('new-gallery')}>
					<span class="toggle-arrow" class:open={isOpen('new-gallery')}>&#9654;</span>
					Gallery Images
					<span class="toggle-count">{newGallery.split('\n').filter(s => s.trim()).length} image{newGallery.split('\n').filter(s => s.trim()).length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen('new-gallery')}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						<GalleryUpload bind:value={newGallery} folder="projects/gallery" />
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
									<label>Description <input type="text" bind:value={item.text} placeholder="Article about our project" /></label>
									<label>Link <input type="text" bind:value={item.link} placeholder="https://..." /></label>
									<button type="button" class="btn-icon remove self-end" onclick={() => newMediaCoverage = newMediaCoverage.filter((_, j) => j !== i)} title="Remove">&times;</button>
								</div>
							</div>
						{/each}
						<button type="button" class="btn-add" onclick={() => newMediaCoverage = [...newMediaCoverage, { text: '', link: '' }]}>+ Add Coverage</button>
					</div>
				{/if}
				<input type="hidden" name="mediaCoverage" value={serializeMediaCoverage(newMediaCoverage)} />

				<label>Sort Order <input type="number" name="sortOrder" value="0" /></label>
				<button type="submit" class="btn-admin primary">Create</button>
			</form>
		</div>
	{/if}

	<div class="items-list">
		{#each data.projects as project}
			<div class="item-row">
				{#if editing === project.id}
					<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { await update(); editing = null; }; }}>
						<input type="hidden" name="id" value={project.id} />
						<div class="form-row">
							<label>Name <input type="text" name="name" value={project.name} required /></label>
							<label>Slug <input type="text" name="slug" value={project.slug} required /></label>
						</div>
						<div style="font-weight: 500; font-size: 0.875rem; margin-bottom: 0.5rem;">Icon</div>
						<input type="hidden" name="icon" value={editIcon} />
						<div class="icon-picker">
							{#each iconNames as iconName}
								{@const Icon = availableIcons[iconName]}
								<button
									type="button"
									class="icon-btn"
									class:selected={editIcon === iconName}
									onclick={() => editIcon = iconName}
									title={iconName}
								>
									<Icon size={20} />
								</button>
							{/each}
						</div>
						<ImageUpload bind:value={editImage} name="image" folder="projects" label="Image" />
						<label>Short Description <input type="text" name="description" value={project.description} /></label>

						<!-- About -->
						<button type="button" class="section-toggle" onclick={() => toggle(`edit-about-${project.id}`)}>
							<span class="toggle-arrow" class:open={isOpen(`edit-about-${project.id}`)}>&#9654;</span>
							About / Overview
						</button>
						{#if isOpen(`edit-about-${project.id}`)}
							<div class="section-body" transition:slide={{ duration: 200 }}>
								<label>About content (separate paragraphs with a blank line)
									<textarea name="about" rows="6">{project.about}</textarea>
								</label>
							</div>
						{:else}
							<input type="hidden" name="about" value={project.about} />
						{/if}

						<!-- Specs -->
						<button type="button" class="section-toggle" onclick={() => toggle(`edit-specs-${project.id}`)}>
							<span class="toggle-arrow" class:open={isOpen(`edit-specs-${project.id}`)}>&#9654;</span>
							Specs
							<span class="toggle-count">{countFilled(editSpecs)} item{countFilled(editSpecs) !== 1 ? 's' : ''}</span>
						</button>
						{#if isOpen(`edit-specs-${project.id}`)}
							<div class="section-body" transition:slide={{ duration: 200 }}>
								{#each editSpecs as spec, i}
									<div class="kv-row">
										<input type="text" placeholder="Label" bind:value={spec.key} />
										<input type="text" placeholder="Value" bind:value={spec.value} />
										<button type="button" class="btn-icon remove" onclick={() => editSpecs = editSpecs.filter((_, j) => j !== i)} title="Remove">&times;</button>
									</div>
								{/each}
								<button type="button" class="btn-add" onclick={() => editSpecs = [...editSpecs, { key: '', value: '' }]}>+ Add Spec</button>
							</div>
						{/if}
						<input type="hidden" name="specs" value={serializeSpecs(editSpecs)} />

						<!-- Team -->
						<button type="button" class="section-toggle" onclick={() => toggle(`edit-team-${project.id}`)}>
							<span class="toggle-arrow" class:open={isOpen(`edit-team-${project.id}`)}>&#9654;</span>
							Team Members
							<span class="toggle-count">{editTeam.filter(t => t.name.trim()).length} member{editTeam.filter(t => t.name.trim()).length !== 1 ? 's' : ''}</span>
						</button>
						{#if isOpen(`edit-team-${project.id}`)}
							<div class="section-body" transition:slide={{ duration: 200 }}>
								{#each editTeam as member, i}
									<div class="sub-block">
										<div class="form-row">
											<label>Role <input type="text" bind:value={member.role} /></label>
											<label>Name <input type="text" bind:value={member.name} /></label>
											<button type="button" class="btn-icon remove self-end" onclick={() => editTeam = editTeam.filter((_, j) => j !== i)} title="Remove">&times;</button>
										</div>
										<label>History (one per line) <textarea rows="2" bind:value={member.history}></textarea></label>
									</div>
								{/each}
								<button type="button" class="btn-add" onclick={() => editTeam = [...editTeam, { role: '', name: '', history: '' }]}>+ Add Team Member</button>
							</div>
						{/if}
						<input type="hidden" name="team" value={serializeTeam(editTeam)} />

						<!-- Gallery -->
						<button type="button" class="section-toggle" onclick={() => toggle(`edit-gallery-${project.id}`)}>
							<span class="toggle-arrow" class:open={isOpen(`edit-gallery-${project.id}`)}>&#9654;</span>
							Gallery Images
							<span class="toggle-count">{editGallery.split('\n').filter(s => s.trim()).length} image{editGallery.split('\n').filter(s => s.trim()).length !== 1 ? 's' : ''}</span>
						</button>
						{#if isOpen(`edit-gallery-${project.id}`)}
							<div class="section-body" transition:slide={{ duration: 200 }}>
								<GalleryUpload bind:value={editGallery} folder="projects/gallery" />
							</div>
						{/if}
						<input type="hidden" name="galleryImages" value={serializeGallery(editGallery)} />

						<!-- Videos -->
						<button type="button" class="section-toggle" onclick={() => toggle(`edit-videos-${project.id}`)}>
							<span class="toggle-arrow" class:open={isOpen(`edit-videos-${project.id}`)}>&#9654;</span>
							Videos
							<span class="toggle-count">{editVideos.length} video{editVideos.length !== 1 ? 's' : ''}</span>
						</button>
						{#if isOpen(`edit-videos-${project.id}`)}
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
						<button type="button" class="section-toggle" onclick={() => toggle(`edit-youtube-${project.id}`)}>
							<span class="toggle-arrow" class:open={isOpen(`edit-youtube-${project.id}`)}>&#9654;</span>
							YouTube Links
							<span class="toggle-count">{editYoutubeLinks.length} link{editYoutubeLinks.length !== 1 ? 's' : ''}</span>
						</button>
						{#if isOpen(`edit-youtube-${project.id}`)}
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
						<button type="button" class="section-toggle" onclick={() => toggle(`edit-media-${project.id}`)}>
							<span class="toggle-arrow" class:open={isOpen(`edit-media-${project.id}`)}>&#9654;</span>
							Media Coverage
							<span class="toggle-count">{editMediaCoverage.length} article{editMediaCoverage.length !== 1 ? 's' : ''}</span>
						</button>
						{#if isOpen(`edit-media-${project.id}`)}
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

						<label>Sort Order <input type="number" name="sortOrder" value={project.sortOrder} /></label>
						<div class="edit-actions">
							<button type="submit" class="btn-admin primary">Save</button>
							<button type="button" class="btn-admin" onclick={() => editing = null}>Cancel</button>
						</div>
					</form>
				{:else}
					{@const SummaryIcon = availableIcons[project.icon] || availableIcons.Box}
					<div class="item-summary">
						<div class="item-info">
							<span class="summary-icon"><SummaryIcon size={24} /></span>
							<strong>{project.name}</strong>
							<span class="item-meta">/{project.slug}</span>
						</div>
						<div class="item-actions">
							<button class="btn-admin small" onclick={() => startEditing(project)}>Edit</button>
							<form method="POST" action="?/delete" use:enhance style="display:inline">
								<input type="hidden" name="id" value={project.id} />
								<button type="submit" class="btn-admin small danger" onclick={(e) => { if (!confirm('Delete this project?')) e.preventDefault(); }}>Delete</button>
							</form>
						</div>
					</div>
				{/if}
			</div>
		{/each}
		{#if data.projects.length === 0}
			<p class="empty-state">No projects yet. Add one above.</p>
		{/if}
	</div>
</div>

<style>
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

	.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; }

	label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.8125rem; color: var(--text-secondary); font-weight: 500; }
input[type="text"], input[type="number"], textarea { padding: 0.5rem 0.75rem; border: 1px solid var(--border-color); border-radius: 0.375rem; background: var(--bg-primary); color: inherit; font-family: inherit; font-size: 0.875rem; }
  input:focus, textarea:focus { outline: none; border-color: var(--gold); }

	/* ─── Collapsible sections ─── */
	.section-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		background: var(--bg-primary);
		color: inherit;
		font-family: inherit;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: border-color 0.15s;
		text-align: left;
	}

	.section-toggle:hover { border-color: var(--gold); }

	.toggle-arrow {
		font-size: 0.625rem;
		transition: transform 0.2s;
		color: var(--text-muted);
	}

	.toggle-arrow.open { transform: rotate(90deg); }

	.toggle-count {
		margin-left: auto;
		font-weight: 400;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.section-body {
		border: 1px solid var(--border-color);
		border-top: none;
		border-radius: 0 0 0.5rem 0.5rem;
		padding: 1rem;
		margin-top: -0.375rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: var(--bg-primary);
	}

	.kv-row {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		gap: 0.5rem;
		align-items: end;
	}

	.sub-block {
		background: var(--bg-card, var(--bg-secondary));
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.btn-icon {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 1.125rem;
		line-height: 1;
		flex-shrink: 0;
		transition: all 0.15s;
	}

	.btn-icon.remove:hover {
		border-color: #ef4444;
		color: #ef4444;
		background: rgba(239, 68, 68, 0.08);
	}

	.btn-icon.self-end {
		align-self: end;
		margin-bottom: 0.25rem;
	}

	.btn-add {
		align-self: flex-start;
		padding: 0.3rem 0.75rem;
		border: 1px dashed var(--border-color);
		border-radius: 0.375rem;
		background: transparent;
		color: var(--text-muted);
		font-size: 0.8125rem;
		font-family: inherit;
		cursor: pointer;
		transition: all 0.15s;
	}

	.btn-add:hover {
		border-color: var(--gold);
		color: var(--gold);
	}

	.items-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.item-row { background: var(--bg-card, var(--bg-secondary)); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 1rem; }
	.item-summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
	.item-info { display: flex; align-items: center; gap: 0.75rem; }
	.item-meta { font-size: 0.8125rem; color: var(--text-muted); }
	.item-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
	.edit-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
	.empty-state { text-align: center; color: var(--text-muted); padding: 2rem 0; }

	.icon-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background: var(--bg-primary);
		max-height: 144px;
		overflow-y: auto;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: 1px solid transparent;
		border-radius: 0.375rem;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.2s;
	}

	.icon-btn:hover {
		background: rgba(255, 255, 255, 0.05);
		color: var(--text-primary);
	}

	.icon-btn.selected {
		border-color: var(--gold);
		background: rgba(235, 171, 33, 0.15);
		color: var(--gold);
	}

	.summary-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--gold);
		background: rgba(235, 171, 33, 0.15);
		padding: 0.375rem;
		border-radius: 0.375rem;
	}

	@media (max-width: 640px) {
		.kv-row { grid-template-columns: 1fr auto; }
		.kv-row input:first-child { grid-column: 1 / -1; }
	}
</style>
