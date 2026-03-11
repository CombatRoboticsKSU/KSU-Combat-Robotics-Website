<script lang="ts">
	let { data } = $props();

	const fallbackBots = [
		{
			name: 'Katana',
			owner: 'David Dreyer',
			image: '/pbots/Katana/Katana.png',
			weight: '3lb',
			weapon: 'Vertical Spinner',
			slug: 'katana'
		},
		{
			name: 'Killajoule',
			owner: 'David Dreyer',
			image: '/pbots/Killajoule/KillaJoule.jpg',
			weight: '12lb',
			weapon: 'Undercutter Horizontal Spinner',
			slug: 'killajoule'
		},
		{
			name: 'Xenomorph',
			owner: 'David Dreyer',
			image: '/pbots/Xenomorph/Xenomorph.jpg',
			weight: '12lb',
			weapon: 'Vertical Spinner',
			slug: 'xenomorph'
		},
		{
			name: 'PNUEMATADOR',
			owner: 'Austin Thebner',
			image: '/pbots/PNUEMATADOR/PNUEMATADOR.png',
			weight: '12lb',
			weapon: 'Pneumatic Flipper',
			slug: 'pnuematador'
		},
		{
			name: 'RAM PLAN',
			owner: 'Brendan Steele',
			image: '/pbots/Ram Plan/RamPlan.jpg',
			weight: '12lb',
			weapon: 'Rotary Lifter',
			slug: 'ramplan'
		},
		{
			name: 'SLAM PLAN',
			owner: 'Brendan Steele',
			image: '/pbots/Slam Plan/SlamPlan.png',
			weight: '12lb',
			weapon: 'Vertical Spinner',
			slug: 'slamplan'
		}
	];

	const personalBots = data.bots.length > 0
		? data.bots.map(b => ({ ...b, link: `/pbots/${b.slug}`, type: b.weapon }))
		: fallbackBots.map(b => ({ ...b, link: `/pbots/${b.slug}`, type: b.weapon }));
</script>

<svelte:head>
	<title>Personal Bots | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Personal Bots</h1>
	<p>Bots built by our club members</p>
</section>

<section class="section">
	<div class="container">
		<div class="wiki-grid">
			{#each personalBots as bot}
				<a href={bot.link} class="wiki-card card">
					<div class="wiki-image">
						<img src={bot.image} alt={bot.name} />
						<div class="wiki-overlay">
							<span class="btn btn-primary">View Details</span>
						</div>
					</div>
					<div class="wiki-info">
						<h3>{bot.name}</h3>
						<p class="bot-owner">by {bot.owner}</p>
						<div class="wiki-meta">
							<span class="meta-tag">{bot.weight}</span>
							<span class="meta-tag">{bot.type}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
		<div class="cross-link">
			<p>Interested in seeing our club bots?</p>
			<a href="/wiki" class="btn btn-secondary">View Club Bot Wiki</a>
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
		margin-bottom: 0.25rem;
		color: var(--gold);
	}

	.bot-owner {
		font-size: 0.875rem;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
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

	.cross-link {
		text-align: center;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border-color);
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
