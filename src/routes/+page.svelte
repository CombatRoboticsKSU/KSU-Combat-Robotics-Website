<script lang="ts">
	const bots = [
		{
			name: 'Flash-BANG',
			image: '/USINGimg/FlashBang25.png',
			href: '/wiki/flashbang',
			tagline: 'Hit them Hard, Hit them Fast',
			description: "Flash-BANG is named after our school's mascot, a golden eagle named Flash. It takes significant inspiration from Battlebots like Minotaur & Copperhead.",
			weight: '12lb',
			weapon: 'Drum Spinner'
		},
		{
			name: 'Big-ISH',
			image: '/USINGimg/Bigish_new.JPG',
			href: '/wiki/bigish',
			tagline: "It's not HUGE, It's not small, It's BIG-ISH",
			description: "BIG-ISH is built to resemble the Battlebot HUGE, but at the 12lb weight class. It features significant improvements & design tweaks that contribute to its ability to be competitive.",
			weight: '12lb',
			weapon: 'Vertical Spinner'
		}
	];

	const stats = [
		{ value: '10+', label: 'Years Active' },
		{ value: '12lb & 3lb', label: 'Weight Class' },
		{ value: '30+', label: 'Club Members' },
	];
</script>

<svelte:head>
	<title>KSU Combat Robotics | Home</title>
</svelte:head>

<!-- Hero -->
<section class="hero-home">
	<div class="hero-bg-effects">
		<div class="hero-orb hero-orb-1"></div>
		<div class="hero-orb hero-orb-2"></div>
		<div class="hero-grid-pattern"></div>
	</div>
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

		<div class="hero-stats">
			{#each stats as stat, i}
				<div class="stat-item" style="animation-delay: {0.3 + i * 0.1}s">
					<span class="stat-value">{stat.value}</span>
					<span class="stat-label">{stat.label}</span>
				</div>
			{/each}
		</div>
	</div>
	<div class="hero-scroll-indicator">
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
	</div>
</section>

<!-- Team Photo -->
<section class="team-section section">
	<div class="container">
		<div class="team-photo-wrapper">
			<img src="/USINGimg/TEAM25.JPG" alt="KSU Combat Robotics Team 2025" class="team-photo" />
			<div class="team-photo-caption">KSU Combat Robotics Team 2025</div>
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
			{#each bots as bot, i}
				<a href={bot.href} class="bot-card card" style="animation-delay: {i * 0.15}s">
					<div class="bot-image-wrapper">
						<img src={bot.image} alt={bot.name} />
						<div class="bot-overlay">
							<span class="btn btn-primary">Learn More</span>
						</div>
						<div class="bot-badge">{bot.weight}</div>
					</div>
					<div class="bot-info">
						<div class="bot-header">
							<h3>{bot.name}</h3>
							<span class="bot-weapon">{bot.weapon}</span>
						</div>
						<p class="bot-tagline">{bot.tagline}</p>
						<p class="bot-desc">{bot.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="cta-section">
	<div class="container">
		<div class="cta-card">
			<div class="cta-glow"></div>
			<h2>Ready to Build?</h2>
			<p>Join us every Friday to design, build, and compete with combat robots. No experience required!</p>
			<div class="cta-actions">
				<!-- TODO: Uncomment when Teams link is ready
				<a href="/teams" class="btn btn-primary">
					Join Our Teams
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</a>
				-->
				<a href="/contact" class="btn btn-secondary">
					Contact Us
				</a>
				<a href="/sponsorship" class="btn btn-secondary">
					Become a Sponsor
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-home {
		background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 40%, #012d60 100%);
		padding: 3rem 1.5rem 2rem;
		text-align: center;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.hero-bg-effects {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.hero-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.4;
	}

	.hero-orb-1 {
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, rgba(235,171,33,0.12) 0%, transparent 70%);
		top: -10%;
		right: -5%;
		animation: float 8s ease-in-out infinite;
	}

	.hero-orb-2 {
		width: 300px;
		height: 300px;
		background: radial-gradient(circle, rgba(0,120,212,0.1) 0%, transparent 70%);
		bottom: -5%;
		left: -5%;
		animation: float 10s ease-in-out 2s infinite reverse;
	}

	@keyframes float {
		0%, 100% { transform: translate(0, 0); }
		50% { transform: translate(20px, -20px); }
	}

	.hero-grid-pattern {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
		-webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
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
		animation: fadeInUp 0.6s ease both;
	}

	.hero-tagline {
		font-size: 1.125rem;
		color: var(--text-secondary);
		line-height: 1.7;
		margin-bottom: 1.25rem;
		animation: fadeInUp 0.6s ease 0.1s both;
	}

	.hero-info {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		animation: fadeInUp 0.6s ease 0.2s both;
	}

	.info-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		background: rgba(235,171,33,0.08);
		border: 1px solid rgba(235,171,33,0.18);
		border-radius: 100px;
		color: var(--gold);
		font-size: 0.9375rem;
		font-weight: 500;
		backdrop-filter: blur(8px);
		transition: all 0.3s ease;
	}

	.info-badge:hover {
		background: rgba(235,171,33,0.14);
		border-color: rgba(235,171,33,0.3);
		transform: translateY(-1px);
	}

	.hero-note {
		color: var(--text-muted);
		font-size: 0.875rem;
		animation: fadeInUp 0.6s ease 0.25s both;
	}

	.hero-note em {
		color: var(--gold);
		font-style: italic;
	}

	.hero-stats {
		display: flex;
		justify-content: center;
		gap: 2.5rem;
		margin-top: 1.5rem;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(255,255,255,0.06);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		animation: fadeInUp 0.5s ease both;
	}

	.stat-value {
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--gold);
		letter-spacing: -0.02em;
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 500;
	}

	.hero-scroll-indicator {
		margin-top: 1.25rem;
		color: var(--text-muted);
		opacity: 0.4;
		animation: bounce 2s ease infinite;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(6px); }
	}

	/* Team Photo */
	.team-photo-wrapper {
		border-radius: var(--radius-xl);
		overflow: hidden;
		box-shadow: var(--shadow-lg), 0 0 60px rgba(235,171,33,0.06);
		max-width: 700px;
		margin: 0 auto;
		position: relative;
	}

	.team-photo {
		width: 100%;
		display: block;
		transition: transform 0.6s ease;
	}

	.team-photo-wrapper:hover .team-photo {
		transform: scale(1.02);
	}

	.team-photo-caption {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 2rem 1rem 1rem;
		background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
		color: var(--text-secondary);
		font-size: 0.8125rem;
		text-align: center;
		font-weight: 500;
		letter-spacing: 0.02em;
	}

	/* Bots Section */
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
		animation: fadeInUp 0.6s ease both;
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
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.bot-card:hover .bot-image-wrapper img {
		transform: scale(1.08);
	}

	.bot-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.bot-card:hover .bot-overlay {
		opacity: 1;
	}

	.bot-badge {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		padding: 0.25rem 0.75rem;
		background: rgba(0,0,0,0.6);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(235,171,33,0.3);
		border-radius: 100px;
		color: var(--gold);
		font-size: 0.75rem;
		font-weight: 600;
		z-index: 1;
	}

	.bot-info {
		padding: 1.5rem;
	}

	.bot-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.bot-info h3 {
		font-size: 1.5rem;
		color: var(--gold);
	}

	.bot-weapon {
		font-size: 0.75rem;
		padding: 0.2rem 0.6rem;
		background: rgba(235,171,33,0.08);
		border: 1px solid rgba(235,171,33,0.15);
		border-radius: 100px;
		color: var(--gold-light);
		font-weight: 500;
		white-space: nowrap;
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

	/* CTA Section */
	.cta-section {
		padding: 5rem 1.5rem;
		position: relative;
	}

	.cta-card {
		position: relative;
		text-align: center;
		padding: 4rem 2rem;
		background: linear-gradient(135deg, rgba(1,57,117,0.6) 0%, rgba(1,37,80,0.8) 100%);
		border: 1px solid rgba(235,171,33,0.15);
		border-radius: var(--radius-xl);
		overflow: hidden;
	}

	.cta-glow {
		position: absolute;
		top: -50%;
		left: 50%;
		transform: translateX(-50%);
		width: 300px;
		height: 300px;
		background: radial-gradient(circle, rgba(235,171,33,0.1) 0%, transparent 70%);
		pointer-events: none;
	}

	.cta-card h2 {
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		margin-bottom: 0.75rem;
		position: relative;
	}

	.cta-card p {
		color: var(--text-secondary);
		max-width: 500px;
		margin: 0 auto 2rem;
		font-size: 1.0625rem;
		line-height: 1.6;
		position: relative;
	}

	.cta-actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
		position: relative;
	}

	@media (max-width: 768px) {
		.hero-home {
			padding: 2.5rem 1rem 2rem;
		}

		.hero-logo {
			max-width: 320px;
			margin-bottom: 1.25rem;
		}

		.hero-tagline {
			font-size: 1rem;
			margin-bottom: 1.5rem;
			padding: 0 0.5rem;
		}

		.hero-info {
			gap: 0.75rem;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
		}

		.info-badge {
			font-size: 0.8125rem;
			padding: 0.5rem 1rem;
			width: auto;
			max-width: none;
		}

		.hero-stats {
			gap: 1.5rem;
			padding-top: 1.5rem;
			flex-wrap: wrap;
			justify-content: center;
			width: 100%;
		}

		.stat-item {
			flex: 0 1 auto;
			min-width: 100px;
		}

		.stat-value {
			font-size: 1.5rem;
		}

		.stat-label {
			font-size: 0.7rem;
		}

		.bots-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.bot-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.team-photo-caption {
			padding: 1.5rem 1rem 0.75rem;
			font-size: 0.75rem;
		}

		.cta-section {
			padding: 3rem 1rem;
		}

		.cta-card {
			padding: 2.5rem 1.25rem;
		}

		.cta-card h2 {
			font-size: 1.75rem;
		}

		.cta-actions {
			flex-direction: column;
			width: 100%;
			gap: 0.75rem;
		}

		.cta-actions :global(.btn) {
			width: 100%;
			justify-content: center;
			text-align: center;
		}
	}

	@media (max-width: 480px) {
		.hero-stats {
			gap: 1rem 0.5rem;
			justify-content: space-evenly;
		}

		.stat-value {
			font-size: 1.35rem;
		}

		.stat-label {
			font-size: 0.65rem;
		}
	}
</style>
