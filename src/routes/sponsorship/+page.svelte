<script lang="ts">
	let currentSlide = $state(0);
	let autoplayTimer: ReturnType<typeof setInterval>;

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

	function next() {
		currentSlide = (currentSlide + 1) % sponsors.length;
	}

	function prev() {
		currentSlide = (currentSlide - 1 + sponsors.length) % sponsors.length;
	}

	function goTo(index: number) {
		currentSlide = index;
	}

	$effect(() => {
		autoplayTimer = setInterval(next, 4000);
		return () => clearInterval(autoplayTimer);
	});
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

		<!-- Carousel -->
		<div class="carousel">
			<button class="carousel-btn prev" onclick={prev} aria-label="Previous sponsor">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
			</button>

			<div class="carousel-track">
				<a href={sponsors[currentSlide].link} target="_blank" rel="noopener noreferrer" class="carousel-slide">
					<img src={sponsors[currentSlide].src} alt={sponsors[currentSlide].alt} />
				</a>
			</div>

			<button class="carousel-btn next" onclick={next} aria-label="Next sponsor">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
			</button>
		</div>

		<div class="carousel-dots">
			{#each sponsors as _, i}
				<button
					class="dot"
					class:active={i === currentSlide}
					onclick={() => goTo(i)}
					aria-label="Go to slide {i + 1}"
				></button>
			{/each}
		</div>

		<!-- Sponsor Logo Grid -->
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
	.carousel {
		display: flex;
		align-items: center;
		gap: 1rem;
		max-width: 600px;
		margin: 0 auto 1.5rem;
	}

	.carousel-track {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.carousel-slide {
		display: block;
	}

	.carousel-slide img {
		max-width: 400px;
		width: 100%;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
	}

	.carousel-btn {
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		color: var(--text-primary);
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--transition);
		flex-shrink: 0;
	}

	.carousel-btn:hover {
		border-color: var(--gold);
		color: var(--gold);
		background: var(--bg-card-hover);
	}

	.carousel-dots {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 3rem;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: none;
		background: var(--text-muted);
		cursor: pointer;
		transition: all var(--transition);
		padding: 0;
	}

	.dot.active {
		background: var(--gold);
		transform: scale(1.3);
	}

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

		.carousel-btn {
			width: 40px;
			height: 40px;
		}
	}

	@media (max-width: 480px) {
		.sponsors-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
