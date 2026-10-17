<script lang="ts">
	import { FileText, Download } from 'lucide-svelte';

	let { data } = $props();
	const paragraphs = $derived(data.waiverText.split(/\r?\n\s*\r?\n/).filter((paragraph) => paragraph.trim()));
</script>

<svelte:head>
	<title>Competitor Waiver | {data.event.name} | KSU Combat Robotics</title>
</svelte:head>

<section class="hero waiver-hero">
	<div class="container">
		<FileText size={32} />
		<h1>Competitor Waiver</h1>
		<p>{data.event.name}</p>
	</div>
</section>

<section class="section">
	<div class="container article-content">
		<div class="document-actions">
			<a class="btn btn-secondary" href="/events/{data.event.slug}">Back to event</a>
			{#if data.event.waiverPdfUrl}
				<a class="btn btn-secondary" href={data.event.waiverPdfUrl} target="_blank" rel="noopener noreferrer">
					<Download size={18} />
					Download PDF
				</a>
			{/if}
		</div>
		<div class="waiver-text">
			{#each paragraphs as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>
</section>

<style>
	.waiver-hero :global(svg) {
		color: var(--gold);
		margin-bottom: 0.75rem;
	}

	.article-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.document-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}

	.document-actions :global(svg) {
		flex-shrink: 0;
	}

	.waiver-text p {
		color: var(--text-secondary);
		line-height: 1.8;
		margin-bottom: 1.25rem;
		font-size: 0.9375rem;
		white-space: pre-wrap;
	}
</style>
