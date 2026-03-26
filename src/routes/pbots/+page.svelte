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

	const personalBots = $derived.by(() => data.bots.length > 0
		? data.bots.map(b => ({ ...b, link: `/pbots/${b.slug}`, type: b.weapon }))
		: fallbackBots.map(b => ({ ...b, link: `/pbots/${b.slug}`, type: b.weapon })));
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
		animation: fadeInUp 0.5s ease both;
	}

	.wiki-card:nth-child(1) { animation-delay: 0s; }
	.wiki-card:nth-child(2) { animation-delay: 0.08s; }
	.wiki-card:nth-child(3) { animation-delay: 0.16s; }
	.wiki-card:nth-child(4) { animation-delay: 0.24s; }
	.wiki-card:nth-child(5) { animation-delay: 0.32s; }
	.wiki-card:nth-child(6) { animation-delay: 0.4s; }

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
		margin-bottom: 0.25rem;
		color: var(--gold);
		transition: color 0.2s ease;
	}

	.wiki-card:hover .wiki-info h3 {
		color: var(--gold-light);
	}

	.bot-owner {
		font-size: 0.8125rem;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.bot-owner::before {
		content: '';
		width: 14px;
		height: 14px;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E");
		background-size: contain;
		flex-shrink: 0;
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

	.wiki-card:hover .meta-tag {
		border-color: rgba(235,171,33,0.15);
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
			grid-template-columns: repeat(2, 1fr);
			gap: 1.25rem;
		}
	}

	@media (max-width: 480px) {
		.wiki-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
