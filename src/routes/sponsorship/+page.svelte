<script lang="ts">
	const sponsors = [
		{ link: 'https://www.wardjet.com', src: '/USINGimg/WARDjet.jpg', alt: 'WARDjet' },
		{ link: 'https://itgresa.com', src: '/USINGimg/ITGresa.jpg', alt: 'IT Gresa' },
		{ link: 'https://badasspower.com', src: '/USINGimg/BadAss.jpg', alt: 'Bad-Ass Motors' },
		{ link: 'https://repeat-robotics.com', src: '/USINGimg/repeat_g.jpg', alt: 'Repeat Robotics' },
		{ link: 'https://sendcutsend.com', src: '/USINGimg/send_g.jpg', alt: 'SendCutSend' },
		{ link: 'https://www.haascnc.com/content/ghf/en/home.html', src: '/USINGimg/haascnc.jpg', alt: 'Gene Haas Foundation' },
		{ link: 'https://www.skbcases.com', src: '/USINGimg/skb.jpg', alt: 'SKB Cases' },
	];

	const donors = ['Brendan Steele', 'Sternberg Family'];
</script>

<svelte:head>
	<title>Sponsors | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Our Sponsors</h1>
	<p>Our generous sponsors make our bot projects & competitions possible. We would not be here without them.</p>
</section>

<section class="section">
	<div class="container">
		<h2 class="section-title">Current <span>Sponsors</span></h2>

		<div class="sponsors-grid">
			{#each sponsors as sponsor}
				<a href={sponsor.link} target="_blank" rel="noopener noreferrer" class="sponsor-logo-card">
					<img src={sponsor.src} alt={sponsor.alt} />
				</a>
			{/each}
		</div>
	</div>
</section>

<section class="section" style="background: var(--bg-secondary);">
	<div class="container" style="text-align: center;">
		<h2 class="section-title">Recent <span>Donations</span></h2>
		<div class="donors">
			{#each donors as donor}
				<div class="donor-badge">{donor}</div>
			{/each}
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="sponsor-cta">
			<div class="sponsor-cta-glow"></div>
			<h2>Interested in Sponsoring Our Team?</h2>
			<p>
				Your support directly funds competition travel, parts, and equipment that help our team grow and succeed.
			</p>
			<div class="sponsor-cta-actions">
				<a href="/img/Letter.pdf" target="_blank" class="btn btn-primary">
					View Sponsorship Packet
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12l8-8M5 4h7v7" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</a>
				<a href="/contact" class="btn btn-secondary">
					Contact Us
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.sponsors-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;
		margin-top: 1rem;
	}

	.sponsor-logo-card {
		background: white;
		border-radius: var(--radius-md);
		padding: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		aspect-ratio: 3/2;
		border: 1px solid transparent;
	}

	.sponsor-logo-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 12px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(235,171,33,0.15);
	}

	.sponsor-logo-card img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		transition: transform 0.3s ease;
	}

	.sponsor-logo-card:hover img {
		transform: scale(1.05);
	}

	.donors {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.donor-badge {
		padding: 0.75rem 1.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border-accent);
		border-radius: var(--radius-md);
		font-weight: 500;
		color: var(--gold);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.3s ease;
	}

	.donor-badge::before {
		content: '';
		width: 8px;
		height: 8px;
		background: var(--gold);
		border-radius: 50%;
		flex-shrink: 0;
	}

	.donor-badge:hover {
		border-color: var(--gold);
		background: rgba(235,171,33,0.06);
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(235,171,33,0.1);
	}

	.sponsor-cta {
		text-align: center;
		padding: 3.5rem 2rem;
		background: linear-gradient(135deg, rgba(1,57,117,0.6) 0%, rgba(1,37,80,0.8) 100%);
		border: 1px solid rgba(235,171,33,0.15);
		border-radius: var(--radius-xl);
		position: relative;
		overflow: hidden;
		max-width: 700px;
		margin: 0 auto;
	}

	.sponsor-cta-glow {
		position: absolute;
		top: -40%;
		left: 50%;
		transform: translateX(-50%);
		width: 250px;
		height: 250px;
		background: radial-gradient(circle, rgba(235,171,33,0.1) 0%, transparent 70%);
		pointer-events: none;
	}

	.sponsor-cta h2 {
		font-size: clamp(1.375rem, 2.5vw, 1.75rem);
		margin-bottom: 0.75rem;
		position: relative;
	}

	.sponsor-cta p {
		color: var(--text-secondary);
		max-width: 500px;
		margin: 0 auto 2rem;
		font-size: 1rem;
		line-height: 1.6;
		position: relative;
	}

	.sponsor-cta-actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
		position: relative;
	}

	@media (max-width: 768px) {
		.sponsors-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.sponsors-grid {
			grid-template-columns: 1fr;
		}

		.sponsor-cta {
			padding: 2.5rem 1.25rem;
		}

		.sponsor-cta h2 {
			font-size: 1.5rem;
		}

		.sponsor-cta-actions {
			flex-direction: column;
			gap: 0.75rem;
			width: 100%;
		}

		.sponsor-cta-actions :global(.btn) {
			width: 100%;
			justify-content: center;
			text-align: center;
		}

		.donors {
			flex-direction: column;
			align-items: stretch;
		}

		.donor-badge {
			justify-content: center;
		}
	}
</style>
