<script lang="ts">
	import { simpleMarkdownToHtml } from '$lib/utils/simple-markdown';

	let { data } = $props();
	const renderedContent = $derived(simpleMarkdownToHtml(data.post.content));

	const galleryImages = $derived((data.post.galleryImages as string[] | null) ?? []);
	const videos = $derived((data.post.videos as { src: string; poster?: string }[] | null) ?? []);
	const youtubeLinks = $derived((data.post.youtubeLinks as { url: string; label?: string }[] | null) ?? []);
	const mediaCoverage = $derived((data.post.mediaCoverage as { text: string; link: string }[] | null) ?? []);

	// Lightbox state
	let lightboxSrc = $state('');
	let lightboxAlt = $state('');
	let lightboxOpen = $state(false);
	let lightboxVisible = $state(false);

	function openLightbox(src: string, alt: string) {
		lightboxSrc = src;
		lightboxAlt = alt;
		lightboxOpen = true;
		requestAnimationFrame(() => {
			lightboxVisible = true;
		});
	}

	function closeLightbox() {
		lightboxVisible = false;
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

	// Capture clicks on markdown images
	function handleContentClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (target.tagName === 'IMG') {
			const img = target as HTMLImageElement;
			openLightbox(img.src, img.alt || 'Image');
		}
	}
</script>

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

<svelte:head>
	<title>{data.post.title} | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>{data.post.title}</h1>
	<p>{data.post.date}</p>
</section>

<article class="section">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="container article-content" onclick={handleContentClick}>
		{@html renderedContent}

		{#if galleryImages.length > 0}
			<div class="gallery-section">
				<h2>Gallery</h2>
				<div class="gallery-grid">
					{#each galleryImages as img}
						<div class="gallery-item">
							<button class="lightbox-trigger" onclick={() => openLightbox(img, `${data.post.title} gallery`)}>
								<img src={img} alt="{data.post.title} gallery" />
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#each videos as video}
			<div class="video-section">
				<video controls poster={video.poster} preload="metadata">
					<source src={video.src} type="video/mp4" />
					<track kind="captions" />
				</video>
			</div>
		{/each}

		{#each youtubeLinks as yt}
			<div class="video-section">
				<div class="youtube-wrapper">
					<iframe
						src={yt.url}
						title="{data.post.title} — {yt.label || 'Video'}"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
					></iframe>
				</div>
			</div>
		{/each}

		{#if mediaCoverage.length > 0}
			<div class="media-section">
				<h2>Media Coverage</h2>
				<ul class="media-list">
					{#each mediaCoverage as item}
						<li>
							<a href={item.link} target="_blank" rel="noopener noreferrer">{item.text}</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<a href="/blog" class="back-link">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 8H3M7 12l-4-4 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
			Back to Updates
		</a>
	</div>
</article>

<style>
	.article-content {
		max-width: 700px;
	}

	.article-content :global(h2) {
		font-size: 1.5rem;
		margin: 2.5rem 0 1rem;
	}

	.article-content :global(p) {
		color: var(--text-secondary);
		line-height: 1.8;
		margin-bottom: 1.5rem;
	}

	.article-content :global(ul) {
		color: var(--text-secondary);
		padding-left: 1.5rem;
		margin-bottom: 1.5rem;
		line-height: 1.8;
	}

	.article-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.article-content :global(img.article-img),
	.article-content :global(img) {
		width: 100%;
		border-radius: var(--radius-lg);
		margin-bottom: 1.5rem;
		box-shadow: var(--shadow-md);
	}

	.article-content :global(a) {
		color: var(--gold);
	}

	/* Gallery */
	.gallery-section {
		margin-top: 2.5rem;
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.gallery-item img {
		width: 100%;
		aspect-ratio: 4/3;
		object-fit: cover;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
	}

	/* Videos */
	.video-section {
		margin-top: 2rem;
	}

	.video-section video {
		width: 100%;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
	}

	.youtube-wrapper {
		position: relative;
		padding-bottom: 56.25%;
		height: 0;
		overflow: hidden;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
	}

	.youtube-wrapper iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: none;
	}

	/* Media Coverage */
	.media-section {
		margin-top: 2.5rem;
	}

	.media-list {
		list-style: none;
		padding: 0;
	}

	.media-list li {
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	.media-list a {
		color: var(--gold);
		text-decoration: none;
	}

	.media-list a:hover {
		text-decoration: underline;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--gold);
		font-weight: 500;
		margin-top: 2rem;
	}

	/* Lightbox trigger button */
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

	/* Make inline article images clickable */
	.article-content :global(img) {
		cursor: zoom-in;
	}
</style>
