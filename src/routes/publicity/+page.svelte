<script lang="ts">
	let newestFirst = $state(true);

	const newsItems = [
		{
			date: 'May 1, 2022',
			title: 'Kent State XBots at the NHRL Robot Combat League',
			link: 'https://www.kent.edu/cae/news/kent-state-xbots-nhrl-robot-combat-league',
			image: '/USINGimg/xbots_team.jpg',
			summary: 'In March, they competed at the Norwalk Havoc Robot League (NHRL) Robot Combat League in Norwalk, Connecticut. Kent State XBots were able to fight their way to the Semi-Finals.'
		},
		{
			date: 'February 13, 2023',
			title: 'Combat Robotics Team finds Success in first NHRL Season',
			link: 'https://www.kent.edu/cae/news/combat-robotics-team-finds-success-first-nhrl-season',
			image: '/USINGimg/successInFirstNHRLSeason.png',
			summary: 'On November 12th, 2022, the Kent State University Combat Robotics Team placed 3rd at a Norwalk Havoc Robotics League (NHRL) competition, qualifying for the 2022 Championships.'
		},
		{
			date: 'March 29, 2023',
			title: 'Combat Robotics Team Continues to find Success',
			link: 'https://kentstater.com/95378/uncategorized/combat-robotics-team-continues-to-find-success/',
			image: '/USINGimg/FlashBang.jpg',
			summary: 'Thanks to a generous donation from the NHRL, the team has continued competing despite initial funding concerns at the start of the semester.'
		},
		{
			date: 'April 20, 2023',
			title: 'Combat Robotics Team Makes 2023 NHRL Season Debut',
			link: 'https://www.kent.edu/cae/news/combat-robotics-team-makes-2023-nhrl-season-debut',
			image: '/USINGimg/Flashbang_w_Minibot.jpg',
			summary: 'The team made their 2023 NHRL season debut with continued support from generous donations and sponsors.'
		},
		{
			date: 'July 13, 2023',
			title: 'Combat Robotics Team Takes on Robotics Great at NHRL Competition',
			link: 'https://www.kent.edu/cae/news/combat-robotics-team-takes-robotics-great-nhrl-competition',
			image: '/USINGimg/NHRL_June_Team.jpg',
			summary: 'After key modifications to Flash-BANG, the team faced their biggest challenge yet at the National Havoc Robotics League in June.'
		}
	];

	function getDisplayedItems() {
		return newestFirst ? [...newsItems].reverse() : newsItems;
	}
</script>

<svelte:head>
	<title>In the News | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>In the News</h1>
	<p>Media coverage of our club</p>
</section>

<section class="section">
	<div class="container">
		<div class="controls">
			<button class="btn btn-secondary" onclick={() => newestFirst = !newestFirst}>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M2 4h12M2 8h8M2 12h4" stroke-linecap="round"/>
				</svg>
				{newestFirst ? 'Newest First' : 'Oldest First'}
			</button>
		</div>

		<div class="news-list">
			{#each getDisplayedItems() as item}
				<a href={item.link} target="_blank" rel="noopener noreferrer" class="news-card card">
					<div class="news-image">
						<img src={item.image} alt={item.title} />
					</div>
					<div class="news-content">
						<span class="news-date">{item.date}</span>
						<h3>{item.title}</h3>
						<p>{item.summary}</p>
						<span class="read-more">
							Read Article
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h8M8 4l3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.controls {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.news-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.news-card {
		display: grid;
		grid-template-columns: 280px 1fr;
		text-decoration: none;
		color: inherit;
	}

	.news-card:hover {
		color: inherit;
	}

	.news-image {
		aspect-ratio: 16/10;
		overflow: hidden;
	}

	.news-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.news-card:hover .news-image img {
		transform: scale(1.05);
	}

	.news-content {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	.news-date {
		font-size: 0.8125rem;
		color: var(--gold);
		font-weight: 500;
		margin-bottom: 0.5rem;
	}

	.news-content h3 {
		font-size: 1.125rem;
		margin-bottom: 0.75rem;
		line-height: 1.4;
	}

	.news-content p {
		font-size: 0.875rem;
		color: var(--text-secondary);
		line-height: 1.6;
		flex: 1;
	}

	.read-more {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--gold);
		font-size: 0.875rem;
		font-weight: 500;
		margin-top: 0.75rem;
	}

	@media (max-width: 640px) {
		.news-card {
			grid-template-columns: 1fr;
		}

		.news-image {
			aspect-ratio: 16/9;
		}
	}
</style>
