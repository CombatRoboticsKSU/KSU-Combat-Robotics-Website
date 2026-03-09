<svelte:head>
	<title>KSU 3lb Competition Kick-off | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>KSU 3lb Competition Kick-off</h1>
	<p>August 23, 2024</p>
</section>

<article class="section">
	<div class="container article-content">
		<h2>Our Upcoming University 3lb Event</h2>
		<p>
			Nearing the end of the semester, it is our goal to run a 3lb plastic bot competition that would be open to competitors across Kent State.
		</p>
		<p>
			Last year we ran a similar event, but it was 1.5lbs and only open to the members of the club.
		</p>

		<h2>General Overview</h2>
		<ul>
			<li>We are choosing to do it as a plastic event (i.e. 3D printed except for electronics, wheels, and screws)</li>
			<li>Bots can weigh up to 3lb, but do not have a minimum weight requirement</li>
			<li>Multi-bot configurations are allowed under our rules</li>
			<li>Teams can be individual, or many (we recommend 3-5 in a team)</li>
			<li>The club has sponsors that can provide discounts on parts and materials</li>
			<li>The club can 3D print parts for you as needed</li>
			<li>Please have some kind of weapon lock for your bot for safety</li>
		</ul>

		<h2>Workshops & Lessons</h2>
		<p>We will be running multiple workshops/lessons across the semester. These will range in content, but by the end you will have the knowledge to build your own combat robot at any weight class.</p>
		<ul>
			<li><strong>So You Want to Build a Battlebot Eh?</strong> &mdash; An overview of typical bot designs/strategies (Austin S., 8/30/24)</li>
			<li><strong>Introduction to CAD</strong> &mdash; Computer Aided Design (Matt S., 9/13/24)</li>
			<li><strong>Part Selection & Where to Buy Them</strong> &mdash; (Austin T., 9/20/24)</li>
			<li><strong>Screws, Bolts, & Nuts</strong> &mdash; An overview of fasteners & McMaster Carr (Greg W., 9/27/24)</li>
		</ul>

		<h2>Inspiration</h2>
		<div class="gallery">
			<img src="/blog/img/bot1.JPG" alt="Bot 1" class="article-img" />
			<img src="/blog/img/bot2.JPG" alt="Bot 2" class="article-img" />
			<img src="/blog/img/bot3.jpg" alt="Bot 3" class="article-img" />
			<img src="/blog/img/bot4.jpg" alt="Bot 4" class="article-img" />
		</div>

		<a href="/blog" class="back-link">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 8H3M7 12l-4-4 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
			Back to Updates
		</a>
	</div>
</article>

<style>
	.article-content {
		max-width: 700px;
	}

	.article-content h2 {
		font-size: 1.5rem;
		margin: 2.5rem 0 1rem;
	}

	.article-content p {
		color: var(--text-secondary);
		line-height: 1.8;
		margin-bottom: 1.5rem;
	}

	.article-content ul {
		color: var(--text-secondary);
		padding-left: 1.5rem;
		margin-bottom: 1.5rem;
		line-height: 1.8;
	}

	.article-content li {
		margin-bottom: 0.5rem;
	}

	.article-img {
		width: 100%;
		border-radius: var(--radius-lg);
		margin-bottom: 1.5rem;
		box-shadow: var(--shadow-md);
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--gold);
		font-weight: 500;
		margin-top: 2rem;
	}

	@media (max-width: 640px) {
		.gallery {
			grid-template-columns: 1fr;
		}
	}
</style>
