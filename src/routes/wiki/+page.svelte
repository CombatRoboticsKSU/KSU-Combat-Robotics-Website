<script lang="ts">
	const bots = [
		{
			name: 'Flash-BANG',
			slug: 'flashbang',
			image: '/USINGimg/FlashBang.jpg',
			weight: '12lb',
			weapon: 'Drum Spinner',
			status: 'Active'
		},
		{
			name: 'Big-ISH',
			slug: 'bigish',
			image: '/USINGimg/Bigish_new.JPG',
			weight: '12lb',
			weapon: 'Vertical Spinner',
			status: 'Active'
		}
	];
</script>

<svelte:head>
	<title>Bot Wiki | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>KSU Bot Wiki</h1>
	<p>Our club-owned combat robots</p>
</section>

<section class="section">
	<div class="container">
		<div class="wiki-grid">
			{#each bots as bot}
				<a href="/wiki/{bot.slug}" class="wiki-card card">
					<div class="wiki-image">
						<img src={bot.image} alt={bot.name} />
						<div class="wiki-overlay">
							<span class="btn btn-primary">View Details</span>
						</div>
					</div>
					<div class="wiki-info">
						<h3>{bot.name}</h3>
						<div class="wiki-meta">
							<span class="meta-tag">{bot.weight}</span>
							<span class="meta-tag">{bot.weapon}</span>
							<span class="meta-tag status">{bot.status}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.wiki-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.wiki-card {
		text-decoration: none;
		color: inherit;
	}

	.wiki-card:hover {
		color: inherit;
	}

	.wiki-image {
		position: relative;
		aspect-ratio: 4/3;
		overflow: hidden;
	}

	.wiki-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.wiki-card:hover .wiki-image img {
		transform: scale(1.05);
	}

	.wiki-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.wiki-card:hover .wiki-overlay {
		opacity: 1;
	}

	.wiki-info {
		padding: 1.25rem;
	}

	.wiki-info h3 {
		font-size: 1.375rem;
		margin-bottom: 0.75rem;
		color: var(--gold);
	}

	.wiki-meta {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.meta-tag {
		font-size: 0.75rem;
		padding: 0.25rem 0.625rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 100px;
		color: var(--text-secondary);
	}

	.meta-tag.status {
		background: rgba(34, 197, 94, 0.1);
		border-color: rgba(34, 197, 94, 0.2);
		color: #22c55e;
	}

	@media (max-width: 640px) {
		.wiki-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
