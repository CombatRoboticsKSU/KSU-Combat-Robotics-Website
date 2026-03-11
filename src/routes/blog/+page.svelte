<script lang="ts">
	let { data } = $props();

	const fallbackPosts = [
		{
			slug: 'brendansteele',
			title: "A Gift Back To Where It All Started",
			date: 'November 1, 2024',
			tags: ['donation'],
			excerpt: "Brendan Steele, a former KSU Combat Robotics club member, recently brought us a $500 prize we had won several years ago out of his pocket.",
			image: '/blog/img/Check_Photo.JPG'
		},
		{
			slug: '2024minicomprules',
			title: 'KSU 3lb Competition Kick-off',
			date: 'August 23, 2024',
			tags: ['events', 'info'],
			excerpt: 'Nearing the end of the semester, it is our goal to run a 3lb plastic bot competition that would be open to competitors across Kent State.',
			image: '/blog/img/bot1.JPG'
		},
		{
			slug: 'akronmakerspace24',
			title: 'Akron Makerspace Event 24',
			date: 'June 29, 2024',
			tags: ['events'],
			excerpt: 'Our team members David Dreyer & alumni Brendan Steele attended Akron Makerspace\'s CHAMP combat event, walking away with 1st place in both weight classes.',
			image: '/blog/img/babycosmo.jpg'
		}
	];

	const posts = data.posts.length > 0 ? data.posts : fallbackPosts;
</script>

<svelte:head>
	<title>Team Updates | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Team Updates</h1>
	<p>News and announcements from the team</p>
</section>

<section class="section">
	<div class="container">
		<div class="posts-list">
			{#each posts as post}
				<a href="/blog/{post.slug}" class="post-card card">
					<div class="post-image">
						<img src={post.image} alt={post.title} />
					</div>
					<div class="post-content">
						<div class="post-meta">
							<span class="post-date">{post.date}</span>
							<div class="post-tags">
								{#each post.tags as tag}
									<span class="post-tag">{tag}</span>
								{/each}
							</div>
						</div>
						<h3>{post.title}</h3>
						<p>{post.excerpt}</p>
						<span class="read-more">
							Read More
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h8M8 4l3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.posts-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.post-card {
		display: grid;
		grid-template-columns: 240px 1fr;
		text-decoration: none;
		color: inherit;
	}

	.post-card:hover {
		color: inherit;
	}

	.post-image {
		aspect-ratio: 4/3;
		overflow: hidden;
	}

	.post-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.post-card:hover .post-image img {
		transform: scale(1.05);
	}

	.post-content {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.post-date {
		font-size: 0.8125rem;
		color: var(--text-muted);
	}

	.post-tags {
		display: flex;
		gap: 0.375rem;
	}

	.post-tag {
		font-size: 0.6875rem;
		padding: 0.125rem 0.5rem;
		background: rgba(235,171,33,0.1);
		border-radius: 100px;
		color: var(--gold);
		text-transform: uppercase;
		font-weight: 600;
		letter-spacing: 0.03em;
	}

	.post-content h3 {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;
		line-height: 1.4;
	}

	.post-content p {
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
		.post-card {
			grid-template-columns: 1fr;
		}
	}
</style>
