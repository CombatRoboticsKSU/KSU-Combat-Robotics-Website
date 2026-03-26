<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import GalleryUpload from '$lib/components/GalleryUpload.svelte';

	let { data, form } = $props();
	let editing: number | null = $state(null);
	let showNew = $state(false);

	// Track which sections are open
	let openSections = $state<Record<string, boolean>>({});
	function toggle(key: string) { openSections[key] = !openSections[key]; }
	function isOpen(key: string) { return openSections[key] ?? false; }

	// ─── Friendly field state for NEW bot form ─────────────────
	let newSpecs = $state<{ key: string; value: string }[]>([{ key: '', value: '' }]);
	let newComps = $state<{ name: string; location: string; date: string; fights: number; wins: number; losses: number; kos: number; kod: number; outcome: string }[]>([]);
	let newTeam = $state<{ role: string; name: string; history: string }[]>([{ role: '', name: '', history: '' }]);
	let newImage = $state('');
	let newGallery = $state('');
	let newVideos = $state<{ src: string; poster: string }[]>([]);
	let newYoutubeLinks = $state<{ url: string; label: string }[]>([]);
	let newMediaCoverage = $state<{ text: string; link: string }[]>([]);

	// ─── Friendly field state for EDIT bot form ────────────────
	let editSpecs = $state<{ key: string; value: string }[]>([]);
	let editComps = $state<{ name: string; location: string; date: string; fights: number; wins: number; losses: number; kos: number; kod: number; outcome: string }[]>([]);
	let editTeam = $state<{ role: string; name: string; history: string }[]>([]);
	let editImage = $state('');
	let editGallery = $state('');
	let editVideos = $state<{ src: string; poster: string }[]>([]);
	let editYoutubeLinks = $state<{ url: string; label: string }[]>([]);
	let editMediaCoverage = $state<{ text: string; link: string }[]>([]);

	function startEditing(bot: typeof data.bots[0]) {
		editing = bot.id;
		showNew = false;
		openSections = {};

		editImage = bot.image ?? '';

		const specs = bot.specs as Record<string, string> | null;
		editSpecs = specs && Object.keys(specs).length ? Object.entries(specs).map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }];

		const comps = bot.competitions as any[] | null;
		editComps = comps ? comps.map(c => ({
			name: c.name ?? '', location: c.location ?? '', date: c.date ?? '',
			fights: c.fights ?? 0, wins: c.wins ?? 0, losses: c.losses ?? 0,
			kos: c.kos ?? 0, kod: c.kod ?? 0, outcome: c.outcome ?? ''
		})) : [];

		const team = bot.team as any[] | null;
		editTeam = team && team.length ? team.map(t => ({
			role: t.role ?? '', name: t.name ?? '',
			history: (t.history ?? []).join('\n')
		})) : [{ role: '', name: '', history: '' }];

		const gallery = bot.galleryImages as string[] | null;
		editGallery = gallery ? gallery.join('\n') : '';

		const vids = bot.videos as any[] | null;
		editVideos = vids?.length ? vids.map(v => ({ src: v.src ?? '', poster: v.poster ?? '' })) : [];

		const ytLinks = bot.youtubeLinks as any[] | null;
		editYoutubeLinks = ytLinks?.length ? ytLinks.map(y => ({ url: y.url ?? '', label: y.label ?? '' })) : [];

		const mc = bot.mediaCoverage as any[] | null;
		editMediaCoverage = mc?.length ? mc.map(m => ({ text: m.text ?? '', link: m.link ?? '' })) : [];
	}

	function resetNew() {
		showNew = !showNew;
		editing = null;
		openSections = {};
		newImage = '';
		newSpecs = [{ key: '', value: '' }];
		newComps = [];
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

	function serializeComps(comps: typeof newComps): string {
		return JSON.stringify(comps.filter(c => c.name.trim()));
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

	let clubBots = $derived(data.bots.filter(b => b.type === 'club'));
	let personalBots = $derived(data.bots.filter(b => b.type === 'personal'));
</script>

<svelte:head>
	<title>Manage Bots | Admin</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<h1>Bots</h1>
		<button class="btn-admin" onclick={resetNew}>
			{showNew ? 'Cancel' : '+ Add Bot'}
		</button>
	</div>

	{#if form?.error}
		<div class="alert error">{form.error}</div>
	{/if}

	{#if showNew}
		<div class="form-card">
			<h2>New Bot</h2>
			<form method="POST" action="?/create" use:enhance={() => { return async ({ update }) => { await update(); showNew = false; }; }}>
				<div class="form-row">
					<label>Name <input type="text" name="name" required /></label>
					<label>Slug (URL) <input type="text" name="slug" required placeholder="flash-bang" /></label>
				</div>
				<div class="form-row">
					<label>Type
						<select name="type">
							<option value="club">Club Bot</option>
							<option value="personal">Personal Bot</option>
						</select>
					</label>
					<label>Weight <input type="text" name="weight" placeholder="12lb" /></label>
					<label>Status
						<select name="status">
							<option>Active</option>
							<option>Retired</option>
							<option>In Progress</option>
						</select>
					</label>
				</div>
				<div class="form-row">
					<label>Weapon <input type="text" name="weapon" /></label>
					<label>Owner (personal bots) <input type="text" name="owner" /></label>
				</div>
				<ImageUpload bind:value={newImage} name="image" folder="bots" label="Image" />

				<!-- Description / About -->
				<button type="button" class="section-toggle" onclick={() => toggle('new-desc')}>
					<span class="toggle-arrow" class:open={isOpen('new-desc')}>&#9654;</span>
					Description / About
				</button>
				{#if isOpen('new-desc')}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						<label>Overview (separate paragraphs with a blank line)
							<textarea name="description" rows="5" placeholder="Description paragraphs about this bot..."></textarea>
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
								<input type="text" placeholder="Label (e.g. Weight Class)" bind:value={spec.key} />
								<input type="text" placeholder="Value (e.g. 12lb)" bind:value={spec.value} />
								<button type="button" class="btn-icon remove" onclick={() => newSpecs = newSpecs.filter((_, j) => j !== i)} title="Remove">&times;</button>
							</div>
						{/each}
						<button type="button" class="btn-add" onclick={() => newSpecs = [...newSpecs, { key: '', value: '' }]}>+ Add Spec</button>
					</div>
				{/if}
				<input type="hidden" name="specs" value={serializeSpecs(newSpecs)} />

				<!-- Competitions -->
				<button type="button" class="section-toggle" onclick={() => toggle('new-comps')}>
					<span class="toggle-arrow" class:open={isOpen('new-comps')}>&#9654;</span>
					Competitions
					<span class="toggle-count">{newComps.length} event{newComps.length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen('new-comps')}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						{#each newComps as comp, i}
							<div class="sub-block">
								<div class="sub-header">
									<span class="sub-number">#{i + 1}</span>
									<button type="button" class="btn-icon remove" onclick={() => newComps = newComps.filter((_, j) => j !== i)} title="Remove">&times;</button>
								</div>
								<div class="form-row">
									<label>Event Name <input type="text" bind:value={comp.name} placeholder="NHRL April 2025" /></label>
									<label>Location <input type="text" bind:value={comp.location} placeholder="Norwalk, CT" /></label>
									<label>Date <input type="text" bind:value={comp.date} placeholder="Apr 3, 2025" /></label>
								</div>
								<div class="form-row five-col">
									<label>Fights <input type="number" bind:value={comp.fights} min="0" /></label>
									<label>Wins <input type="number" bind:value={comp.wins} min="0" /></label>
									<label>Losses <input type="number" bind:value={comp.losses} min="0" /></label>
									<label>KOs <input type="number" bind:value={comp.kos} min="0" /></label>
									<label>KO'd <input type="number" bind:value={comp.kod} min="0" /></label>
								</div>
								<label>Outcome <input type="text" bind:value={comp.outcome} placeholder="1st Place, Round 3, etc." /></label>
							</div>
						{/each}
						<button type="button" class="btn-add" onclick={() => newComps = [...newComps, { name: '', location: '', date: '', fights: 0, wins: 0, losses: 0, kos: 0, kod: 0, outcome: '' }]}>+ Add Competition</button>
					</div>
				{/if}
				<input type="hidden" name="competitions" value={serializeComps(newComps)} />

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
									<label>Role <input type="text" bind:value={member.role} placeholder="Driver" /></label>
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
						<GalleryUpload bind:value={newGallery} folder="bots/gallery" />
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
									<label>Description <input type="text" bind:value={item.text} placeholder="Article about our bot" /></label>
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

	<h2 class="section-label">Club Bots</h2>
	<div class="items-list">
		{#each clubBots as bot}
			{@render botRow(bot)}
		{/each}
		{#if clubBots.length === 0}
			<p class="empty-state">No club bots yet.</p>
		{/if}
	</div>

	<h2 class="section-label">Personal Bots</h2>
	<div class="items-list">
		{#each personalBots as bot}
			{@render botRow(bot)}
		{/each}
		{#if personalBots.length === 0}
			<p class="empty-state">No personal bots yet.</p>
		{/if}
	</div>
</div>

{#snippet botRow(bot: typeof data.bots[0])}
	<div class="item-row">
		{#if editing === bot.id}
			<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { await update(); editing = null; }; }}>
				<input type="hidden" name="id" value={bot.id} />
				<div class="form-row">
					<label>Name <input type="text" name="name" value={bot.name} required /></label>
					<label>Slug <input type="text" name="slug" value={bot.slug} required /></label>
				</div>
				<div class="form-row">
					<label>Type
						<select name="type">
							<option value="club" selected={bot.type === 'club'}>Club Bot</option>
							<option value="personal" selected={bot.type === 'personal'}>Personal Bot</option>
						</select>
					</label>
					<label>Weight <input type="text" name="weight" value={bot.weight} /></label>
					<label>Status
						<select name="status">
							<option selected={bot.status === 'Active'}>Active</option>
							<option selected={bot.status === 'Retired'}>Retired</option>
							<option selected={bot.status === 'In Progress'}>In Progress</option>
						</select>
					</label>
				</div>
				<div class="form-row">
					<label>Weapon <input type="text" name="weapon" value={bot.weapon} /></label>
					<label>Owner <input type="text" name="owner" value={bot.owner ?? ''} /></label>
				</div>
				<ImageUpload bind:value={editImage} name="image" folder="bots" label="Image" />

				<!-- Description / About -->
				<button type="button" class="section-toggle" onclick={() => toggle(`edit-desc-${bot.id}`)}>
					<span class="toggle-arrow" class:open={isOpen(`edit-desc-${bot.id}`)}>&#9654;</span>
					Description / About
				</button>
				{#if isOpen(`edit-desc-${bot.id}`)}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						<label>Overview (separate paragraphs with a blank line)
							<textarea name="description" rows="5">{bot.description ?? ''}</textarea>
						</label>
					</div>
				{:else}
					<input type="hidden" name="description" value={bot.description ?? ''} />
				{/if}

				<!-- Specs -->
				<button type="button" class="section-toggle" onclick={() => toggle(`edit-specs-${bot.id}`)}>
					<span class="toggle-arrow" class:open={isOpen(`edit-specs-${bot.id}`)}>&#9654;</span>
					Specs
					<span class="toggle-count">{countFilled(editSpecs)} item{countFilled(editSpecs) !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen(`edit-specs-${bot.id}`)}
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

				<!-- Competitions -->
				<button type="button" class="section-toggle" onclick={() => toggle(`edit-comps-${bot.id}`)}>
					<span class="toggle-arrow" class:open={isOpen(`edit-comps-${bot.id}`)}>&#9654;</span>
					Competitions
					<span class="toggle-count">{editComps.length} event{editComps.length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen(`edit-comps-${bot.id}`)}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						{#each editComps as comp, i}
							<div class="sub-block">
								<div class="sub-header">
									<span class="sub-number">#{i + 1} — {comp.name || 'New Event'}</span>
									<button type="button" class="btn-icon remove" onclick={() => editComps = editComps.filter((_, j) => j !== i)} title="Remove">&times;</button>
								</div>
								<div class="form-row">
									<label>Event Name <input type="text" bind:value={comp.name} /></label>
									<label>Location <input type="text" bind:value={comp.location} /></label>
									<label>Date <input type="text" bind:value={comp.date} /></label>
								</div>
								<div class="form-row five-col">
									<label>Fights <input type="number" bind:value={comp.fights} min="0" /></label>
									<label>Wins <input type="number" bind:value={comp.wins} min="0" /></label>
									<label>Losses <input type="number" bind:value={comp.losses} min="0" /></label>
									<label>KOs <input type="number" bind:value={comp.kos} min="0" /></label>
									<label>KO'd <input type="number" bind:value={comp.kod} min="0" /></label>
								</div>
								<label>Outcome <input type="text" bind:value={comp.outcome} /></label>
							</div>
						{/each}
						<button type="button" class="btn-add" onclick={() => editComps = [...editComps, { name: '', location: '', date: '', fights: 0, wins: 0, losses: 0, kos: 0, kod: 0, outcome: '' }]}>+ Add Competition</button>
					</div>
				{/if}
				<input type="hidden" name="competitions" value={serializeComps(editComps)} />

				<!-- Team -->
				<button type="button" class="section-toggle" onclick={() => toggle(`edit-team-${bot.id}`)}>
					<span class="toggle-arrow" class:open={isOpen(`edit-team-${bot.id}`)}>&#9654;</span>
					Team Members
					<span class="toggle-count">{editTeam.filter(t => t.name.trim()).length} member{editTeam.filter(t => t.name.trim()).length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen(`edit-team-${bot.id}`)}
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
				<button type="button" class="section-toggle" onclick={() => toggle(`edit-gallery-${bot.id}`)}>
					<span class="toggle-arrow" class:open={isOpen(`edit-gallery-${bot.id}`)}>&#9654;</span>
					Gallery Images
					<span class="toggle-count">{editGallery.split('\n').filter(s => s.trim()).length} image{editGallery.split('\n').filter(s => s.trim()).length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen(`edit-gallery-${bot.id}`)}
					<div class="section-body" transition:slide={{ duration: 200 }}>
						<GalleryUpload bind:value={editGallery} folder="bots/gallery" />
					</div>
				{/if}
				<input type="hidden" name="galleryImages" value={serializeGallery(editGallery)} />

				<!-- Videos -->
				<button type="button" class="section-toggle" onclick={() => toggle(`edit-videos-${bot.id}`)}>
					<span class="toggle-arrow" class:open={isOpen(`edit-videos-${bot.id}`)}>&#9654;</span>
					Videos
					<span class="toggle-count">{editVideos.length} video{editVideos.length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen(`edit-videos-${bot.id}`)}
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
				<button type="button" class="section-toggle" onclick={() => toggle(`edit-youtube-${bot.id}`)}>
					<span class="toggle-arrow" class:open={isOpen(`edit-youtube-${bot.id}`)}>&#9654;</span>
					YouTube Links
					<span class="toggle-count">{editYoutubeLinks.length} link{editYoutubeLinks.length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen(`edit-youtube-${bot.id}`)}
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
				<button type="button" class="section-toggle" onclick={() => toggle(`edit-media-${bot.id}`)}>
					<span class="toggle-arrow" class:open={isOpen(`edit-media-${bot.id}`)}>&#9654;</span>
					Media Coverage
					<span class="toggle-count">{editMediaCoverage.length} article{editMediaCoverage.length !== 1 ? 's' : ''}</span>
				</button>
				{#if isOpen(`edit-media-${bot.id}`)}
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

				<label>Sort Order <input type="number" name="sortOrder" value={bot.sortOrder} /></label>
				<div class="edit-actions">
					<button type="submit" class="btn-admin primary">Save</button>
					<button type="button" class="btn-admin" onclick={() => editing = null}>Cancel</button>
				</div>
			</form>
		{:else}
			<div class="item-summary">
				<div class="item-info">
					<strong>{bot.name}</strong>
					<span class="item-meta">{bot.weight} · {bot.weapon || 'N/A'}</span>
					<span class="item-badge" class:active={bot.status === 'Active'}>{bot.status}</span>
					{#if bot.owner}
						<span class="item-meta">by {bot.owner}</span>
					{/if}
				</div>
				<div class="item-actions">
					<button class="btn-admin small" onclick={() => startEditing(bot)}>Edit</button>
					<form method="POST" action="?/delete" use:enhance style="display:inline">
						<input type="hidden" name="id" value={bot.id} />
						<button type="submit" class="btn-admin small danger" onclick={(e) => { if (!confirm('Delete this bot?')) e.preventDefault(); }}>Delete</button>
					</form>
				</div>
			</div>
		{/if}
	</div>
{/snippet}

<style>
	.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
	.page-header h1 { font-size: 1.5rem; }

	.section-label { font-size: 1.125rem; margin: 1.5rem 0 0.75rem; color: var(--gold); }

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
	.form-row.five-col { grid-template-columns: repeat(5, 1fr); }

	label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.8125rem; color: var(--text-secondary); font-weight: 500; }
	input[type="text"], input[type="number"], textarea, select { padding: 0.5rem 0.75rem; border: 1px solid var(--border-color); border-radius: 0.375rem; background: var(--bg-primary); color: inherit; font-family: inherit; font-size: 0.875rem; }
	input:focus, textarea:focus, select:focus { outline: none; border-color: var(--gold); }

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

	.sub-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.sub-number {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
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
	.item-info { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
	.item-meta { font-size: 0.8125rem; color: var(--text-muted); }
	.item-badge { font-size: 0.6875rem; padding: 0.125rem 0.5rem; border-radius: 100px; background: rgba(156, 163, 175, 0.15); color: #9ca3af; }
	.item-badge.active { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
	.item-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
	.edit-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
	.empty-state { text-align: center; color: var(--text-muted); padding: 2rem 0; }

	@media (max-width: 640px) {
		.form-row.five-col { grid-template-columns: repeat(3, 1fr); }
		.kv-row { grid-template-columns: 1fr auto; }
		.kv-row input:first-child { grid-column: 1 / -1; }
	}
</style>
