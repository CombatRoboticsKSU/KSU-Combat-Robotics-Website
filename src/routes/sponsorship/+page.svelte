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
	<div class="container" style="text-align: center;">
		<h2 class="section-title">Interested in <span>Sponsoring</span> Our Team?</h2>
		<p style="color: var(--text-secondary); margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
			Your support directly funds competition travel, parts, and equipment that help our team grow and succeed.
		</p>
		<a href="/img/Letter.pdf" target="_blank" class="btn btn-primary">
			View Sponsorship Packet
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12l8-8M5 4h7v7" stroke-linecap="round" stroke-linejoin="round"/></svg>
		</a>
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
		transition: all var(--transition);
		aspect-ratio: 3/2;
	}

	.sponsor-logo-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
	}

	.sponsor-logo-card img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
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
	}
</style>
