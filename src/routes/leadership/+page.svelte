<script lang="ts">
	import { slide } from 'svelte/transition';

	interface BoardMember {
		name: string;
		image: string;
		title: string;
		stats: string[];
		bio: string;
	}

	let { data } = $props();

	let expandedCurrent: string | null = $state(null);
	let expandedFormer: string | null = $state(null);

	function toggleMember(group: 'current' | 'former', name: string) {
		if (group === 'current') {
			expandedCurrent = expandedCurrent === name ? null : name;
		} else {
			expandedFormer = expandedFormer === name ? null : name;
		}
	}

	function getExpandedMember(board: BoardMember[], name: string | null): BoardMember | undefined {
		return board.find(m => m.name === name);
	}

	// Fallback hardcoded data if DB is empty
	const fallbackCurrent: BoardMember[] = [
		{
			name: 'Austin Sternberg',
			image: '/USINGimg/BOARD25/austin.JPG',
			title: 'President',
			stats: ['Years in Robotics: 9.5', 'Club Member: 3 years', 'Major: Computer Science', 'Fun Fact: I built this website!', 'Formerly: Project Manager-2024'],
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
			title: 'Fundraising Chair',
			stats: ['Years in Robotics: 2', 'Club Member: 2 years', 'Major: Communications'],
			bio: "Sean is the club's Fundraising Chair and has been a member for 2 years."
		},
		{
			name: 'Adam Turniski',
			image: '/USINGimg/BOARD25/adam.JPG',
			title: 'Project Manager',
			stats: ['Years in Robotics: 2', 'Club Member: 2 years', 'Major: Mechatronics Engineering', 'Fun Fact: I like to fish and cook and I am also apart of the AFS chapter at Kent.'],
			bio: 'Adam is an aspiring engineer from northeast Ohio that loves automation and robotics.'
		},
		{
			name: 'Unknown',
			image: '/USINGimg/placeholder.png',
			title: 'Public Relations Chair',
			stats: ['Years in Robotics: N/A', 'Club Member: N/A', 'Major: N/A'],
			bio: 'This position is currently vacant. If you are interested in helping out with PR, please reach out to the club!'
		}
	];

	const fallbackFormer: BoardMember[] = [
		{
			name: 'Austin Thebner',
			image: '/USINGimg/austint.jpg',
			title: 'President',
			stats: ['Years in Robotics: 4 with no previous experience', 'Club Member: 4 years', 'Major: Mechanical Engineering Technology', 'Fun Fact: I am colorblind', 'Formerly: President-2024, Vice President-2023'],
			bio: 'Austin led the club for 3 years and specializes in mechanical design and strategy.'
		},
		{
			name: 'David Dreyer',
			image: '/USINGimg/david.jpg',
			title: 'President',
			stats: ['Years in Robotics:', 'Club Member:', 'Major: Aerospace Engineering', 'Fun Fact: I have designed many robots and competed at NRHL quite a bit.', 'Formerly: President-2022-2023'],
			bio: 'David was the clubs President to start the current age. He now currently works for NASA Glenn',
		},
	];

	const currentBoard: BoardMember[] = $derived.by(() => data.currentBoard.length > 0 ? data.currentBoard : fallbackCurrent);
	const formerBoard: BoardMember[] = $derived.by(() => data.formerBoard.length > 0 ? data.formerBoard : fallbackFormer);
</script>

<svelte:head>
	<title>Leadership | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Current Leadership</h1>
	<p>The team keeping the club running smoothly</p>
</section>

<section class="section">
	<div class="container">
		<img src={data.groupPhoto || '/USINGimg/BOARD25/group.JPG'} alt="Current Leadership" class="leadership-group-photo" />
	</div>
	<br />
	<div class="container">
		<div class="members-grid">
			{#each currentBoard as member}
				<button
					class="member-card card"
					class:active={expandedCurrent === member.name}
					onclick={() => toggleMember('current', member.name)}
				>
					<div class="member-image-wrapper">
						<img src={member.image} alt={member.name} />
					</div>
					<h3>{member.name}</h3>
					<span class="member-title">{member.title}</span>
				</button>
			{/each}
		</div>

		{#if expandedCurrent}
			{@const member = getExpandedMember(currentBoard, expandedCurrent)}
			{#if member}
				<div class="detail-panel" transition:slide={{ duration: 300 }}>
					<button class="detail-close" onclick={() => expandedCurrent = null}>&times;</button>
					<div class="detail-inner">
						<div class="detail-image-wrapper">
							<img src={member.image} alt={member.name} />
						</div>
						<div class="detail-info">
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
				</div>
			{/if}
		{/if}
	</div>
</section>

<section class="section" style="background: var(--bg-secondary);">
	<div class="container">
		<h2 class="section-title">Former <span>Leadership</span></h2>
		<div class="members-grid">
			{#each formerBoard as member}
				<button
					class="member-card card"
					class:active={expandedFormer === member.name}
					onclick={() => toggleMember('former', member.name)}
				>
					<div class="member-image-wrapper">
						<img src={member.image} alt={member.name} />
					</div>
					<h3>{member.name}</h3>
					<span class="member-title">{member.title}</span>
				</button>
			{/each}
		</div>

		{#if expandedFormer}
			{@const member = getExpandedMember(formerBoard, expandedFormer)}
			{#if member}
				<div class="detail-panel" transition:slide={{ duration: 300 }}>
					<button class="detail-close" onclick={() => expandedFormer = null}>&times;</button>
					<div class="detail-inner">
						<div class="detail-image-wrapper">
							<img src={member.image} alt={member.name} />
						</div>
						<div class="detail-info">
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
				</div>
			{/if}
		{/if}
	</div>
</section>

<style>
	.members-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5rem;
	}

	.member-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem 1rem;
		text-align: center;
		cursor: pointer;
		transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
		border: 2px solid transparent;
		background: var(--bg-card, var(--bg-secondary));
		color: inherit;
		font-family: inherit;
		width: 200px;
		border-radius: 0.75rem;
	}

	.member-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
	}

	.member-card.active {
		border-color: var(--gold);
		transform: none;
		box-shadow: 0 4px 16px rgba(235, 171, 33, 0.15);
	}

	.member-image-wrapper {
		width: 110px;
		height: 110px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid var(--gold);
		margin-bottom: 0.75rem;
		flex-shrink: 0;
	}

	.member-image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.member-card h3 {
		font-size: 1.125rem;
		margin-bottom: 0.25rem;
	}

	.member-title {
		display: inline-block;
		color: var(--gold);
		font-weight: 600;
		font-size: 0.875rem;
		padding: 0.2rem 0.6rem;
		background: rgba(235,171,33,0.1);
		border-radius: 100px;
	}

	/* Group photo */
	.leadership-group-photo {
		width: 100%;
		max-width: 600px;
		display: block;
		margin: 0 auto;
		border-radius: 0.75rem;
		border: 2px solid var(--border-color);
		object-fit: cover;
	}

	/* Full-width detail panel */
	.detail-panel {
		margin-top: 1.5rem;
		background: var(--bg-card, var(--bg-secondary));
		border: 2px solid var(--gold);
		border-radius: 0.75rem;
		padding: 2rem;
		position: relative;
	}

	.detail-close {
		position: absolute;
		top: 0.75rem;
		right: 1rem;
		background: none;
		border: none;
		color: var(--text-secondary);
		font-size: 1.75rem;
		cursor: pointer;
		line-height: 1;
		padding: 0.25rem 0.5rem;
		border-radius: 0.5rem;
		transition: color 0.15s, background 0.15s;
	}

	.detail-close:hover {
		color: var(--gold);
		background: rgba(235,171,33,0.1);
	}

	.detail-inner {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
	}

	.detail-image-wrapper {
		width: 140px;
		height: 140px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid var(--gold);
		flex-shrink: 0;
	}

	.detail-image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.detail-info {
		flex: 1;
	}

	.detail-info h3 {
		font-size: 1.5rem;
		margin-bottom: 0.25rem;
	}

	.detail-info .member-title {
		margin-bottom: 1rem;
	}

	.member-stats {
		list-style: none;
		margin: 1rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.member-stats li {
		font-size: 0.875rem;
		color: var(--text-secondary);
		padding: 0.3rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	.member-stats li:last-child {
		border-bottom: none;
	}

	.member-bio {
		font-size: 0.9375rem;
		color: var(--text-muted);
		line-height: 1.6;
		margin-top: 0.75rem;
	}

	@media (max-width: 768px) {
		.detail-inner {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.detail-image-wrapper {
			width: 120px;
			height: 120px;
		}
	}

	@media (max-width: 400px) {
		.member-card {
			width: 150px;
		}

		.members-grid {
			gap: 1rem;
		}
	}
</style>
