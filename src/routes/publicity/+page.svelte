<script lang="ts">
	let { data } = $props();
	let newestFirst = $state(true);

	let displayedItems = $derived(
		newestFirst ? [...data.items].reverse() : data.items
	);
</script>

<svelte:head>
	<title>In the News | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>In the News</h1>
	<p>Media coverage of our club</p>
</section>

<section class="section">
	<div class="container">
		<div class="controls">
			<button class="btn btn-secondary" onclick={() => newestFirst = !newestFirst}>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M2 4h12M2 8h8M2 12h4" stroke-linecap="round"/>
				</svg>
				{newestFirst ? 'Newest First' : 'Oldest First'}
			</button>
		</div>

		<div class="news-list">
			{#each displayedItems as item}
				<a href={item.link} target="_blank" rel="noopener noreferrer" class="news-card card">
					{#if item.image}
						<div class="news-image">
							<img src={item.image} alt={item.title} />
						</div>
					{/if}
					<div class="news-content">
						<span class="news-date">{item.date}</span>
						<h3>{item.title}</h3>
						{#if item.summary}
							<p>{item.summary}</p>
						{/if}
						<span class="read-more">
							Read Article
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h8M8 4l3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
						</span>
					</div>
				</a>
			{/each}
			{#if data.items.length === 0}
				<p class="empty-state">No news items yet.</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.controls {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
		padding: 0.75rem;
		background: var(--bg-secondary);
		border-radius: var(--radius-md);
		max-width: 900px;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 2rem;
	}

	.news-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.news-card {
		display: grid;
		grid-template-columns: 280px 1fr;
		text-decoration: none;
		color: inherit;
	}

	.news-card:hover {
		color: inherit;
	}

	.news-image {
		aspect-ratio: 16/10;
		overflow: hidden;
	}

	.news-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.news-card:hover .news-image img {
		transform: scale(1.06);
	}

	.news-content {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	.news-date {
		font-size: 0.8125rem;
		color: var(--gold);
		font-weight: 500;
		margin-bottom: 0.5rem;
	}

	.news-content h3 {
		font-size: 1.125rem;
		margin-bottom: 0.75rem;
		line-height: 1.4;
		transition: color 0.2s ease;
	}

	.news-card:hover .news-content h3 {
		color: var(--gold);
	}

	.news-content p {
		font-size: 0.875rem;
		color: var(--text-secondary);
		line-height: 1.6;
		flex: 1;
	}

	.read-more {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--gold);
		font-size: 0.875rem;
		font-weight: 600;
		margin-top: 0.75rem;
		padding: 0.375rem 0.75rem;
		background: rgba(235,171,33,0.08);
		border-radius: var(--radius-sm);
		align-self: flex-start;
		transition: all 0.2s ease;
	}

	.news-card:hover .read-more {
		background: rgba(235,171,33,0.15);
		gap: 0.6rem;
	}

	.empty-state {
		text-align: center;
		color: var(--text-muted);
		padding: 3rem 0;
		font-size: 1rem;
	}

	@media (max-width: 640px) {
		.news-card {
			grid-template-columns: 1fr;
		}

		.news-image {
			aspect-ratio: 16/9;
		}
	}
</style>
