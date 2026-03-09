<script lang="ts">
	const personalBots = [
		{
			name: 'Katana',
			owner: 'David Dreyer',
			image: '/USINGimg/Katana.png',
			weight: '3lb',
			type: 'Vertical Spinner'
		},
		{
			name: 'Flash Storm',
			owner: 'Club Member',
			image: '/USINGimg/FlashBang.jpg',
			weight: '1.5lb',
			type: 'Plastic Bot'
		},
		{
			name: 'Killajoule',
			owner: 'Club Member',
			image: '/USINGimg/FlashBang.jpg',
			weight: '3lb',
			type: 'Combat Bot'
		},
		{
			name: 'PNUEMATADOR',
			owner: 'Austin Thebner',
			image: '/USINGimg/austint.jpg',
			weight: '12lb',
			type: 'Pneumatic Flipper'
		}
	];
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
		<div class="bots-grid">
			{#each personalBots as bot}
				<div class="bot-card card">
					<div class="bot-image">
						<img src={bot.image} alt={bot.name} />
					</div>
					<div class="bot-info">
						<h3>{bot.name}</h3>
						<p class="bot-owner">by {bot.owner}</p>
						<div class="bot-meta">
							<span class="meta-tag">{bot.weight}</span>
							<span class="meta-tag">{bot.type}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.bots-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.bot-card {
		overflow: hidden;
	}

	.bot-image {
		aspect-ratio: 4/3;
		overflow: hidden;
	}

	.bot-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.bot-info {
		padding: 1.25rem;
	}

	.bot-info h3 {
		font-size: 1.25rem;
		color: var(--gold);
		margin-bottom: 0.25rem;
	}

	.bot-owner {
		font-size: 0.875rem;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
	}

	.bot-meta {
		display: flex;
		gap: 0.5rem;
	}

	.meta-tag {
		font-size: 0.75rem;
		padding: 0.2rem 0.6rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 100px;
		color: var(--text-secondary);
	}

	@media (max-width: 640px) {
		.bots-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
