<script lang="ts">
	interface Competition {
		name: string;
		location: string;
		date: string;
		fights: number;
		wins: number;
		losses: number;
		kos: number;
		kod: number;
		outcome?: string;
	}

	interface TeamMember {
		role: string;
		name: string;
		history?: string[];
	}

	interface BotData {
		name: string;
		image: string;
		specs: Record<string, string>;
		competitions: Competition[];
		team: TeamMember[];
		galleryImages?: string[];
		videos?: { src: string; poster?: string }[];
		youtubeLinks?: { url: string; label?: string }[];
		mediaCoverage?: { text: string; link: string }[];
		// Legacy single-value fields (for hardcoded pages)
		videoSrc?: string;
		videoPoster?: string;
		youtubeEmbed?: string;
		youtubePlaylist?: string;
		mediaCoverageText?: string;
		mediaCoverageLink?: string;
	}

	let { bot, backLink = '/wiki', backLabel = 'Back to Wiki' }: { bot: BotData; backLink?: string; backLabel?: string } = $props();

	// Normalize legacy single fields into arrays
	const allVideos = $derived(
		bot.videos?.length ? bot.videos :
		bot.videoSrc ? [{ src: bot.videoSrc, poster: bot.videoPoster }] : []
	);

	const allYoutubeLinks = $derived(
		bot.youtubeLinks?.length ? bot.youtubeLinks :
		[
			...(bot.youtubeEmbed ? [{ url: bot.youtubeEmbed, label: 'Video' }] : []),
			...(bot.youtubePlaylist ? [{ url: bot.youtubePlaylist, label: 'Playlist' }] : [])
		]
	);

	const allMediaCoverage = $derived(
		bot.mediaCoverage?.length ? bot.mediaCoverage :
		(bot.mediaCoverageText && bot.mediaCoverageLink)
			? [{ text: bot.mediaCoverageText, link: bot.mediaCoverageLink }] : []
	);

	let lightboxSrc = $state('');
	let lightboxAlt = $state('');
	let lightboxOpen = $state(false);
	let lightboxVisible = $state(false);

	function openLightbox(src: string, alt: string) {
		lightboxSrc = src;
		lightboxAlt = alt;
		lightboxOpen = true;
		// Trigger the visible state on next frame for the CSS transition
		requestAnimationFrame(() => {
			lightboxVisible = true;
		});
	}

	function closeLightbox() {
		lightboxVisible = false;
		// Wait for the fade-out transition to finish before removing from DOM
		setTimeout(() => {
			lightboxOpen = false;
			lightboxSrc = '';
			lightboxAlt = '';
		}, 300);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && lightboxOpen) {
			closeLightbox();
		}
	}

	function totalRecord(competitions: Competition[]) {
		const wins = competitions.reduce((sum, c) => sum + c.wins, 0);
		const losses = competitions.reduce((sum, c) => sum + c.losses, 0);
		return { wins, losses };
	}

	const record = $derived(totalRecord(bot.competitions));
</script>

<section class="hero">
	<h1>{bot.name}</h1>
</section>

<section class="section">
	<div class="container">
		<div class="bot-header">
			<div class="bot-main-image">
				<button class="lightbox-trigger" onclick={() => openLightbox(bot.image, bot.name)}>
					<img src={bot.image} alt={bot.name} />
				</button>
			</div>
			<div class="bot-specs-panel">
				<div class="overall-record">
					<span class="record-wins">{record.wins}W</span>
					<span class="record-sep">-</span>
					<span class="record-losses">{record.losses}L</span>
				</div>
				<h3>Specifications</h3>
				<dl class="specs-list">
					{#each Object.entries(bot.specs) as [key, value]}
						<div class="spec-row">
							<dt>{key}</dt>
							<dd>{value}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>

		<!-- Competition Record -->
		<div class="comp-section">
			<h2 class="section-title">Competition <span>Record</span></h2>
			<div class="comp-grid">
				{#each bot.competitions as comp}
					<div class="comp-card card">
						<div class="comp-header">
							<h4>{comp.name}</h4>
							<span class="comp-date">{comp.date}</span>
						</div>
						<div class="comp-location">{comp.location}</div>
						<div class="comp-stats">
							<div class="comp-stat">
								<span class="stat-value">{comp.wins}</span>
								<span class="stat-label">Wins</span>
							</div>
							<div class="comp-stat">
								<span class="stat-value">{comp.losses}</span>
								<span class="stat-label">Losses</span>
							</div>
							<div class="comp-stat">
								<span class="stat-value">{comp.kos}</span>
								<span class="stat-label">KOs</span>
							</div>
							<div class="comp-stat">
								<span class="stat-value">{comp.kod}</span>
								<span class="stat-label">KO'd</span>
							</div>
						</div>
						{#if comp.outcome}
							<div class="comp-outcome">{comp.outcome}</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Gallery -->
		{#if bot.galleryImages && bot.galleryImages.length > 0}
			<div class="gallery-section">
				<h2 class="section-title"><span>Gallery</span></h2>
				<div class="gallery-grid">
					{#each bot.galleryImages as img}
						<div class="gallery-item">
							<button class="lightbox-trigger" onclick={() => openLightbox(img, `${bot.name} gallery`)}>
								<img src={img} alt="{bot.name} gallery" />
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Videos -->
		{#each allVideos as video}
			<div class="video-section">
				<video controls poster={video.poster} preload="metadata">
					<source src={video.src} type="video/mp4" />
					<track kind="captions" />
				</video>
			</div>
		{/each}

		{#each allYoutubeLinks as yt}
			<div class="video-section">
				<div class="youtube-wrapper">
					<iframe
						src={yt.url}
						title="{bot.name} — {yt.label || 'Video'}"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
					></iframe>
				</div>
			</div>
		{/each}

		<!-- Media Coverage -->
		{#if allMediaCoverage.length > 0}
			<div class="media-section">
				<h2 class="section-title">Media <span>Coverage</span></h2>
				<ul class="media-list">
					{#each allMediaCoverage as item}
						<li>
							<a href={item.link} target="_blank" rel="noopener noreferrer">{item.text}</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Team -->
		<div class="team-section">
			<h2 class="section-title">Team <span>Members</span></h2>
			<div class="team-grid">
				{#each bot.team as member}
					<div class="team-member card">
						<div class="team-member-inner">
							<strong>{member.role}</strong>
							<span>{member.name}</span>
							{#if member.history}
								<ul class="history-list">
									{#each member.history as entry}
										<li>{entry}</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		<div class="back-link">
			<a href={backLink} class="btn btn-secondary">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 8H3M7 12l-4-4 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
				{backLabel}
			</a>
		</div>
	</div>
</section>

<svelte:window onkeydown={handleKeydown} />

{#if lightboxOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="lightbox-overlay"
		class:lightbox-visible={lightboxVisible}
		onclick={closeLightbox}
		onkeydown={handleKeydown}
	>
		<button class="lightbox-close" onclick={closeLightbox} aria-label="Close lightbox">&times;</button>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<img
			class="lightbox-image"
			class:lightbox-visible={lightboxVisible}
			src={lightboxSrc}
			alt={lightboxAlt}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		/>
	</div>
{/if}

<style>
	.bot-header {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 2rem;
		margin-bottom: 4rem;
		align-items: start;
	}

	.bot-main-image {
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
	}

	.bot-main-image img {
		width: 100%;
		display: block;
	}

	.bot-specs-panel {
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		padding: 2rem;
	}

	.overall-record {
		text-align: center;
		font-size: 2rem;
		font-weight: 800;
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.record-wins { color: #22c55e; }
	.record-sep { color: var(--text-muted); margin: 0 0.5rem; }
	.record-losses { color: #ef4444; }

	.bot-specs-panel h3 {
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--gold);
		margin-bottom: 1rem;
	}

	.specs-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.spec-row {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-color);
		gap: 1rem;
	}

	.spec-row:last-child {
		border-bottom: none;
	}

	.spec-row dt {
		color: var(--text-secondary);
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.spec-row dd {
		color: var(--text-primary);
		font-size: 0.8125rem;
		text-align: right;
	}

	.comp-section, .gallery-section, .team-section, .media-section {
		margin-bottom: 4rem;
	}

	.media-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.media-list li {
		padding: 0.75rem 1rem;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
	}

	.media-list a {
		color: var(--gold);
		font-weight: 500;
	}

	.comp-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
	}

	.comp-card {
		padding: 1.25rem;
	}

	.comp-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.25rem;
	}

	.comp-header h4 {
		font-size: 0.9375rem;
	}

	.comp-date {
		font-size: 0.75rem;
		color: var(--text-muted);
		white-space: nowrap;
	}

	.comp-location {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.comp-stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
		text-align: center;
		margin-bottom: 0.75rem;
	}

	.stat-value {
		display: block;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--gold);
	}

	.stat-label {
		font-size: 0.6875rem;
		color: var(--text-muted);
		text-transform: uppercase;
	}

	.comp-outcome {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		padding-top: 0.75rem;
		border-top: 1px solid var(--border-color);
		text-align: center;
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.gallery-item {
		border-radius: var(--radius-md);
		overflow: hidden;
		aspect-ratio: 4/3;
	}

	.gallery-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.gallery-item:hover img {
		transform: scale(1.05);
	}

	.video-section {
		margin-bottom: 3rem;
		display: flex;
		justify-content: center;
	}

	.video-section video {
		max-width: 740px;
		width: 100%;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
	}

	.youtube-wrapper {
		position: relative;
		width: 100%;
		max-width: 640px;
		aspect-ratio: 16/9;
	}

	.youtube-wrapper iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border-radius: var(--radius-lg);
	}

	.team-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	.team-member {
		padding: 1.25rem;
	}

	.team-member-inner strong {
		display: block;
		font-size: 0.8125rem;
		color: var(--gold);
		text-transform: uppercase;
		letter-spacing: 0.03em;
		margin-bottom: 0.25rem;
	}

	.team-member-inner span {
		font-size: 0.9375rem;
	}

	.history-list {
		margin-top: 0.5rem;
		padding-left: 1rem;
		list-style: disc;
	}

	.history-list li {
		font-size: 0.75rem;
		color: var(--text-muted);
		margin-bottom: 0.125rem;
	}

	.back-link {
		text-align: center;
		margin-top: 2rem;
	}

	/* Lightbox trigger button — invisible wrapper */
	.lightbox-trigger {
		all: unset;
		display: block;
		width: 100%;
		height: 100%;
		cursor: zoom-in;
	}

	.lightbox-trigger img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	/* Lightbox overlay */
	.lightbox-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0);
		backdrop-filter: blur(0px);
		transition: background 0.3s ease, backdrop-filter 0.3s ease;
		cursor: zoom-out;
	}

	.lightbox-overlay.lightbox-visible {
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(8px);
	}

	.lightbox-image {
		max-width: 90vw;
		max-height: 85vh;
		border-radius: var(--radius-lg);
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
		cursor: default;
		transform: scale(0.8);
		opacity: 0;
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
	}

	.lightbox-image.lightbox-visible {
		transform: scale(1);
		opacity: 1;
	}

	.lightbox-close {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		background: none;
		border: none;
		color: white;
		font-size: 2.5rem;
		cursor: pointer;
		line-height: 1;
		opacity: 0.7;
		transition: opacity 0.2s ease, transform 0.2s ease;
		z-index: 10000;
	}

	.lightbox-close:hover {
		opacity: 1;
		transform: scale(1.15);
	}

	@media (max-width: 768px) {
		.bot-header {
			grid-template-columns: 1fr;
		}

		.comp-grid, .gallery-grid, .team-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
