<script lang="ts">
	// Lightbox state
	let lightboxSrc = $state('');
	let lightboxAlt = $state('');
	let lightboxOpen = $state(false);
	let lightboxVisible = $state(false);

	function openLightbox(src: string, alt: string) {
		lightboxSrc = src;
		lightboxAlt = alt;
		lightboxOpen = true;
		requestAnimationFrame(() => {
			lightboxVisible = true;
		});
	}

	function closeLightbox() {
		lightboxVisible = false;
		setTimeout(() => {
			lightboxOpen = false;
			lightboxSrc = '';
			lightboxAlt = '';
		}, 300);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && lightboxOpen) {
			closeLightbox();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if lightboxOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="lightbox-overlay"
		class:lightbox-visible={lightboxVisible}
		onclick={closeLightbox}
		onkeydown={handleKeydown}
	>
		<button class="lightbox-close" onclick={closeLightbox} aria-label="Close lightbox">&times;</button>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<img
			class="lightbox-image"
			class:lightbox-visible={lightboxVisible}
			src={lightboxSrc}
			alt={lightboxAlt}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		/>
	</div>
{/if}

<svelte:head>
	<title>History | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Combat Robotics History</h1>
	<p>The story of our club and bots</p>
</section>

<section class="section">
	<div class="container">
		<div class="timeline">

			<div class="timeline-item">
				<div class="timeline-marker"></div>
				<div class="timeline-content">
					<div class="timeline-image">
						<button class="lightbox-trigger" onclick={() => openLightbox('/USINGimg/team_w.JPG', 'Early team')}>
							<img src="/USINGimg/team_w.JPG" alt="Early team" />
						</button>
					</div>
					<div class="timeline-text">
						<span class="timeline-era">2016 - 2018</span>
						<h2>Beginnings</h2>
						<p>
							The club began in 2016 when the founding members: Maddie Wilson, Chad Soukup, Dan Youst,
							Damon Mandideto, and Emily Perine decided to start the club under the name of "X-Bots". They
							approached Professor Trent True and asked him to be the academic advisor.
						</p>
						<p>
							The first bots of the club were The Twins, <a href="/wiki/SorApp">Sorcerer & Apprentice</a>. The Twins were two seven and a half pound bots,
							equipped with titanium wedges that allowed for a strong control game. They were active from the start until 2019
							when Big-Ish was introduced. Their final and most successful redesign was wide-body bots with 6061
							Aluminum wedges.
						</p>
						<p>
							After many competitions with The Twins the team created OSHA Approved, designed by Mike Nelson. It came equipped with a dual spinning
							vertical blade setup. For the 2018 season, OSHA Approved became OSHA Improved with significant changes to its weapon and armor.
							Unfortunately, the OSHA series was decommissioned in late 2019.
						</p>
					</div>
				</div>
			</div>

			<div class="timeline-item">
				<div class="timeline-marker"></div>
				<div class="timeline-content reverse">
					<div class="timeline-image">
						<button class="lightbox-trigger" onclick={() => openLightbox('/USINGimg/bigish_old.jpg', 'Big-Ish')}>
							<img src="/USINGimg/bigish_old.jpg" alt="Big-Ish" />
						</button>
					</div>
					<div class="timeline-text">
						<span class="timeline-era">2019 - 2022</span>
						<h2>Big-Ish's Introduction</h2>
						<p>
							Brendan Steele joined in 2018 and led the design of <a href="/wiki/bigish">Big-Ish</a>, a tall 12lb bot with a large vertical spinning
							blade inspired by the BattleBots competitor <a href="https://hugebattlebots.com" target="_blank" rel="noopener noreferrer">HUGE</a>.
							Big-Ish was finished in 2019, right as Covid-19 began to take its toll.
						</p>
						<p>
							Covid brought challenges &mdash; member count dwindled and almost led to the club disbanding. This also caused
							the decommissioning of The Twins. Fortunately, with the creation of Big-Ish and the determination of its members,
							the club prevailed. Following the lift of restrictions, Big-Ish competed at NHRL, winning three out of five matches.
						</p>
					</div>
				</div>
			</div>

			<div class="timeline-item">
				<div class="timeline-marker"></div>
				<div class="timeline-content">
					<div class="timeline-image">
						<button class="lightbox-trigger" onclick={() => openLightbox('/USINGimg/FlashBang.jpg', 'Flash-BANG')}>
							<img src="/USINGimg/FlashBang.jpg" alt="Flash-BANG" />
						</button>
					</div>
					<div class="timeline-text">
						<span class="timeline-era">2022 - Present</span>
						<h2>The Current Age</h2>
						<p>
							The club went through a large expansion and gained many members. The board reorganized
							and created the structural foundation we know today. They also introduced <a href="/wiki/flashbang">Flash-BANG</a>,
							a twelve-pound drum spinner designed by Austin Thebner & Gregory Wenner.
						</p>
						<p>
							Nowadays, the club continues with two active bots, Big-Ish and Flash-BANG. They attend competitions
							with the main goal being to win NHRL. They also host all-plastic bot competitions &mdash; the first
							was in fall 2023 (1.5lb) followed by a 3lb competition in spring 2025.
						</p>
					</div>
				</div>
			</div>

		</div>
	</div>
</section>

<style>
	.timeline {
		position: relative;
		max-width: 1000px;
		margin: 0 auto;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 2px;
		background: linear-gradient(180deg, var(--gold) 0%, var(--navy) 100%);
		transform: translateX(-50%);
	}

	.timeline-item {
		position: relative;
		margin-bottom: 4rem;
		animation: fadeInUp 0.6s ease both;
	}

	.timeline-item:nth-child(1) { animation-delay: 0s; }
	.timeline-item:nth-child(2) { animation-delay: 0.15s; }
	.timeline-item:nth-child(3) { animation-delay: 0.3s; }

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.timeline-item:last-child {
		margin-bottom: 0;
	}

	.timeline-marker {
		position: absolute;
		left: 50%;
		top: 2rem;
		width: 16px;
		height: 16px;
		background: var(--gold);
		border-radius: 50%;
		transform: translateX(-50%);
		z-index: 1;
		box-shadow: 0 0 0 4px var(--bg-primary), 0 0 12px rgba(235,171,33,0.3);
	}

	.timeline-marker::after {
		content: '';
		position: absolute;
		inset: -4px;
		border: 2px solid rgba(235,171,33,0.3);
		border-radius: 50%;
		animation: pulse 3s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); opacity: 0.5; }
		50% { transform: scale(1.5); opacity: 0; }
	}

	.timeline-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: start;
	}

	.timeline-content.reverse {
		direction: rtl;
	}

	.timeline-content.reverse > * {
		direction: ltr;
	}

	.timeline-image {
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-lg), 0 0 40px rgba(0,0,0,0.2);
		border: 1px solid rgba(235,171,33,0.1);
		transition: all 0.4s ease;
	}

	.timeline-image:hover {
		transform: scale(1.02);
		box-shadow: var(--shadow-lg), 0 0 40px rgba(235,171,33,0.08);
	}

	.timeline-image img {
		width: 100%;
		display: block;
		transition: transform 0.5s ease;
	}

	.timeline-image:hover img {
		transform: scale(1.03);
	}

	.timeline-era {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: rgba(235,171,33,0.1);
		border: 1px solid rgba(235,171,33,0.2);
		border-radius: 100px;
		color: var(--gold);
		font-size: 0.8125rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.timeline-text h2 {
		font-size: 1.75rem;
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	.timeline-text p {
		color: var(--text-secondary);
		margin-bottom: 1rem;
		line-height: 1.8;
		font-size: 0.9375rem;
	}

	.timeline-text p:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		.timeline::before {
			left: 1rem;
		}

		.timeline-marker {
			left: 1rem;
		}

		.timeline-content,
		.timeline-content.reverse {
			grid-template-columns: 1fr;
			padding-left: 3rem;
			gap: 1.5rem;
			direction: ltr;
		}

		.timeline-image {
			max-width: 100%;
		}
	}

	/* Lightbox trigger button */
	.lightbox-trigger {
		all: unset;
		display: block;
		width: 100%;
		height: 100%;
		cursor: zoom-in;
	}

	.lightbox-trigger img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	/* Lightbox overlay */
	.lightbox-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0);
		backdrop-filter: blur(0px);
		transition: background 0.3s ease, backdrop-filter 0.3s ease;
		cursor: zoom-out;
	}

	.lightbox-overlay.lightbox-visible {
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(8px);
	}

	.lightbox-image {
		max-width: 90vw;
		max-height: 85vh;
		border-radius: var(--radius-lg);
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
		cursor: default;
		transform: scale(0.8);
		opacity: 0;
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
	}

	.lightbox-image.lightbox-visible {
		transform: scale(1);
		opacity: 1;
	}

	.lightbox-close {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		background: none;
		border: none;
		color: white;
		font-size: 2.5rem;
		cursor: pointer;
		line-height: 1;
		opacity: 0.7;
		transition: opacity 0.2s ease, transform 0.2s ease;
		z-index: 10000;
	}

	.lightbox-close:hover {
		opacity: 1;
		transform: scale(1.15);
	}
</style>
