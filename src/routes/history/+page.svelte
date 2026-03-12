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
						<img src="/USINGimg/team_w.JPG" alt="Early team" />
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
						<img src="/USINGimg/bigish_old.jpg" alt="Big-Ish" />
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
						<img src="/USINGimg/FlashBang.jpg" alt="Flash-BANG" />
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
		box-shadow: var(--shadow-lg);
	}

	.timeline-image img {
		width: 100%;
		display: block;
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
	}

	.timeline-text p {
		color: var(--text-secondary);
		margin-bottom: 1rem;
		line-height: 1.7;
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
</style>
