<script lang="ts">
	interface BoardMember {
		name: string;
		image: string;
		title: string;
		stats: string[];
		bio: string;
	}

	const currentBoard: BoardMember[] = [
		{
			name: 'Austin Sternberg',
			image: '/USINGimg/BOARD25/austin.JPG',
			title: 'President',
			stats: ['Years in Robotics: 9.5', 'Club Member: 3 years', 'Major: Computer Science', 'Fun Fact: I built this website!'],
			bio: "Austin is the club's President and has been a member for 3 years. He has been in combat robotics since 6th grade and is slowly developing his own 12lb bot."
		},
		{
			name: 'Ian Rohrbacher',
			image: '/USINGimg/BOARD25/ian.JPG',
			title: 'Administrator',
			stats: ['Years in Robotics: 6', 'Club Member: 2 years', 'Major: Computer Science'],
			bio: "Ian is the club's Administration lead. They have done FIRST Robotics Competition throughout high school and are still involved with FIRST, mentoring their high school team and volunteering at events. They are the current driver of Big-ish."
		},
		{
			name: 'Sean Burns',
			image: '/USINGimg/BOARD25/sean.JPG',
			title: 'Treasurer',
			stats: ['Years in Robotics: 2', 'Club Member: 2 years', 'Major: Communications'],
			bio: "Sean is the club's Treasurer and has been a member for 2 years."
		},
		{
			name: 'Adam Turniski',
			image: '/USINGimg/BOARD25/adam.JPG',
			title: 'Project Manager',
			stats: ['Years in Robotics: 2', 'Club Member: 2 years', 'Major: Mechatronics Engineering', 'Fun Fact: I like to fish and cook and I am also apart of the AFS chapter at Kent.'],
			bio: 'Adam is an aspiring engineer from northeast Ohio that loves automation and robotics.'
		}
	];

	const formerBoard: BoardMember[] = [
		{
			name: 'Austin Thebner',
			image: '/USINGimg/austint.jpg',
			title: 'President',
			stats: ['Years in Robotics: 4 with no previous experience', 'Club Member: 4 years', 'Major: Mechanical Engineering Technology', 'Fun Fact: I am colorblind', 'Formerly: President-2024, Vice President-2023'],
			bio: 'Austin led the club for 3 years and specializes in mechanical design and strategy.'
		}
	];
</script>

<svelte:head>
	<title>Leadership | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Current Leadership</h1>
	<p>The team behind the bots</p>
</section>

<section class="section">
	<div class="container">
		<div class="members-grid">
			{#each currentBoard as member}
				<div class="member-card card">
					<div class="member-image-wrapper">
						<img src={member.image} alt={member.name} />
					</div>
					<div class="member-info">
						<h3>{member.name}</h3>
						<span class="member-title">{member.title}</span>
						<ul class="member-stats">
							{#each member.stats as stat}
								<li>{stat}</li>
							{/each}
						</ul>
						<p class="member-bio">{member.bio}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section" style="background: var(--bg-secondary);">
	<div class="container">
		<h2 class="section-title">Former <span>Leadership</span></h2>
		<div class="members-grid former">
			{#each formerBoard as member}
				<div class="member-card card">
					<div class="member-image-wrapper">
						<img src={member.image} alt={member.name} />
					</div>
					<div class="member-info">
						<h3>{member.name}</h3>
						<span class="member-title">{member.title}</span>
						<ul class="member-stats">
							{#each member.stats as stat}
								<li>{stat}</li>
							{/each}
						</ul>
						<p class="member-bio">{member.bio}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.members-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
	}

	.members-grid.former {
		max-width: 600px;
		margin: 0 auto;
		grid-template-columns: 1fr;
	}

	.member-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		text-align: center;
	}

	.member-image-wrapper {
		width: 140px;
		height: 140px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid var(--gold);
		margin-bottom: 1.25rem;
		flex-shrink: 0;
	}

	.member-image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.member-info h3 {
		font-size: 1.375rem;
		margin-bottom: 0.25rem;
	}

	.member-title {
		display: inline-block;
		color: var(--gold);
		font-weight: 600;
		font-size: 0.9375rem;
		margin-bottom: 1rem;
		padding: 0.25rem 0.75rem;
		background: rgba(235,171,33,0.1);
		border-radius: 100px;
	}

	.member-stats {
		list-style: none;
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.member-stats li {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		padding: 0.25rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	.member-stats li:last-child {
		border-bottom: none;
	}

	.member-bio {
		font-size: 0.875rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.members-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
