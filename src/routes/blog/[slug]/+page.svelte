<script lang="ts">
	import { simpleMarkdownToHtml } from '$lib/utils/simple-markdown';

	let { data } = $props();
	const renderedContent = $derived(simpleMarkdownToHtml(data.post.content));
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

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--gold);
		font-weight: 500;
		margin-top: 2rem;
	}
</style>
