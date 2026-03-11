<script lang="ts">
	const bots = [
		{
			name: 'Flash-BANG',
			image: '/USINGimg/FlashBang25.png',
			href: '/wiki/flashbang',
			tagline: 'Hit them Hard, Hit them Fast',
			description: "Flash-BANG is named after our school's mascot, a golden eagle named Flash. It takes significant inspiration from Battlebots like Minotaur & Copperhead."
		},
		{
			name: 'Big-ISH',
			image: '/USINGimg/Bigish_new.JPG',
			href: '/wiki/bigish',
			tagline: "It's not HUGE, It's not small, It's BIG-ISH",
			description: "BIG-ISH is built to resemble the Battlebot HUGE, but at the 12lb weight class. It features significant improvements & design tweaks that contribute to its ability to be competitive."
		}
	];
</script>

<svelte:head>
	<title>KSU Combat Robotics | Home</title>
</svelte:head>

<!-- Hero -->
<section class="hero-home">
	<div class="hero-content">
		<img src="/USINGimg/longlogo.png" alt="KSU Combat Robotics" class="hero-logo" />
		<p class="hero-tagline">
			KSU Combat Robotics is a student organization at Kent State University that designs, builds, and competes in combat robotics events at a variety of weight classes.
		</p>
		<div class="hero-info">
			<div class="info-badge">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
				Every Friday 4:30-6:30pm
			</div>
			<div class="info-badge">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
				120 AEB
			</div>
		</div>
		<p class="hero-note">Club membership is <em>only</em> available to KSU students.</p>
	</div>
</section>

<!-- Team Photo -->
<section class="team-section section">
	<div class="container">
		<div class="team-photo-wrapper">
			<img src="/USINGimg/TEAM25.JPG" alt="KSU Combat Robotics Team 2025" class="team-photo" />
		</div>
		<div style="text-align: center; margin-top: 2rem;">
			<a href="/history" class="btn btn-primary">
				Explore Our History
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>
			</a>
		</div>
	</div>
</section>

<!-- Featured Bots -->
<section class="bots-section section">
	<div class="container">
		<h2 class="section-title">Our <span>Bots</span></h2>
		<div class="bots-grid">
			{#each bots as bot}
				<a href={bot.href} class="bot-card card">
					<div class="bot-image-wrapper">
						<img src={bot.image} alt={bot.name} />
						<div class="bot-overlay">
							<span class="btn btn-primary">Learn More</span>
						</div>
					</div>
					<div class="bot-info">
						<h3>{bot.name}</h3>
						<p class="bot-tagline">{bot.tagline}</p>
						<p class="bot-desc">{bot.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.hero-home {
		background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 40%, #012d60 100%);
		padding: 5rem 1.5rem;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.hero-home::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle at 50% 80%, rgba(235,171,33,0.06) 0%, transparent 50%);
		pointer-events: none;
	}

	.hero-content {
		position: relative;
		max-width: 800px;
		margin: 0 auto;
	}

	.hero-logo {
		max-width: 500px;
		width: 100%;
		margin-bottom: 1.5rem;
	}

	.hero-tagline {
		font-size: 1.125rem;
		color: var(--text-secondary);
		line-height: 1.7;
		margin-bottom: 2rem;
	}

	.hero-info {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.info-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		background: rgba(235,171,33,0.1);
		border: 1px solid rgba(235,171,33,0.2);
		border-radius: 100px;
		color: var(--gold);
		font-size: 0.9375rem;
		font-weight: 500;
	}

	.hero-note {
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.hero-note em {
		color: var(--gold);
		font-style: italic;
	}

	.team-photo-wrapper {
		border-radius: var(--radius-xl);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		max-width: 700px;
		margin: 0 auto;
	}

	.team-photo {
		width: 100%;
		display: block;
	}

	.bots-section {
		background: var(--bg-secondary);
	}

	.bots-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
	}

	.bot-card {
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
	}

	.bot-card:hover {
		color: inherit;
	}

	.bot-image-wrapper {
		position: relative;
		aspect-ratio: 16/10;
		overflow: hidden;
	}

	.bot-image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.bot-card:hover .bot-image-wrapper img {
		transform: scale(1.05);
	}

	.bot-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.bot-card:hover .bot-overlay {
		opacity: 1;
	}

	.bot-info {
		padding: 1.5rem;
	}

	.bot-info h3 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		color: var(--gold);
	}

	.bot-tagline {
		font-size: 0.9375rem;
		color: var(--text-secondary);
		font-style: italic;
		margin-bottom: 0.75rem;
	}

	.bot-desc {
		font-size: 0.875rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.bots-grid {
			grid-template-columns: 1fr;
		}

		.hero-logo {
			max-width: 300px;
		}
	}
</style>
