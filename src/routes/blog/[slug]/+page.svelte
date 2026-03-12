<script lang="ts">
	import { simpleMarkdownToHtml } from '$lib/utils/simple-markdown';

	let { data } = $props();
	const renderedContent = $derived(simpleMarkdownToHtml(data.post.content));

	const galleryImages = $derived((data.post.galleryImages as string[] | null) ?? []);
	const videos = $derived((data.post.videos as { src: string; poster?: string }[] | null) ?? []);
	const youtubeLinks = $derived((data.post.youtubeLinks as { url: string; label?: string }[] | null) ?? []);
	const mediaCoverage = $derived((data.post.mediaCoverage as { text: string; link: string }[] | null) ?? []);
</script>

<svelte:head>
	<title>{data.post.title} | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>{data.post.title}</h1>
	<p>{data.post.date}</p>
</section>

<article class="section">
	<div class="container article-content">
		{@html renderedContent}

		{#if galleryImages.length > 0}
			<div class="gallery-section">
				<h2>Gallery</h2>
				<div class="gallery-grid">
					{#each galleryImages as img}
						<div class="gallery-item">
							<img src={img} alt="{data.post.title} gallery" />
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
</style>
