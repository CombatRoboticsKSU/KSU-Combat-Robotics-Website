<script lang="ts">
	let { data } = $props();

	const fallbackBots = [
		{
			name: 'Flash-BANG',
			slug: 'flashbang',
			image: '/USINGimg/FlashBang25.png',
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
		},
		{
			name: 'Sorcerer & Apprentice',
			slug: 'SorApp',
			image: '/wiki/img/twins/sorapp.JPG',
			weight: '7.5lb',
			weapon: 'Wedge',
			status: 'Retired'
		}
	];

	const bots = $derived.by(() => data.bots.length > 0 ? data.bots : fallbackBots);
</script>

<svelte:head>
	<title>Bot Wiki | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>KSU Bot Wiki</h1>
	<p>Our club-owned combat robots — {bots.length} bots and counting</p>
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
							<span class="meta-tag {bot.status.toLowerCase()}">{bot.status}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
		<div class="cross-link">
			<p>Interested in seeing our members' bots?</p>
			<a href="/pbots" class="btn btn-secondary">View Personal Bots</a>
		</div>
	</div>
</section>

<style>
	.wiki-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		max-width: 1000px;
		margin: 0 auto;
	}

	.wiki-card {
		text-decoration: none;
		color: inherit;
		animation: fadeInUp 0.5s ease both;
	}

	.wiki-card:nth-child(1) { animation-delay: 0s; }
	.wiki-card:nth-child(2) { animation-delay: 0.1s; }
	.wiki-card:nth-child(3) { animation-delay: 0.2s; }

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(16px); }
		to { opacity: 1; transform: translateY(0); }
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
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.wiki-card:hover .wiki-image img {
		transform: scale(1.08);
	}

	.wiki-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%);
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
		transition: color 0.2s ease;
	}

	.wiki-card:hover .wiki-info h3 {
		color: var(--gold-light);
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
		transition: all 0.2s ease;
	}

	.meta-tag.active {
		background: rgba(34, 197, 94, 0.1);
		border-color: rgba(34, 197, 94, 0.2);
		color: #22c55e;
	}

	.meta-tag.retired {
		background: rgba(156, 163, 175, 0.1);
		border-color: rgba(156, 163, 175, 0.2);
		color: #9ca3af;
	}

	.cross-link {
		text-align: center;
		margin-top: 3rem;
		padding: 2.5rem;
		background: linear-gradient(135deg, rgba(1,57,117,0.3) 0%, rgba(1,37,80,0.4) 100%);
		border: 1px solid rgba(235,171,33,0.1);
		border-radius: var(--radius-lg);
	}

	.cross-link p {
		color: var(--text-secondary);
		margin-bottom: 1rem;
		font-size: 1.0625rem;
	}

	@media (max-width: 768px) {
		.wiki-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
