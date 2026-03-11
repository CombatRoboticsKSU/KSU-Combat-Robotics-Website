<script lang="ts">
	const projects = [
		{
			name: 'Club Printer',
			slug: 'printer',
			icon: '🖨️',
			description: 'Custom Voron 3D Printer designed for use during competitions'
		},
		{
			name: 'Test Cage / Mini Arena',
			slug: 'test-cage',
			icon: '🏟️',
			description: 'Our testing and competition arena'
		},
		{
			name: 'Event Countdown Clock',
			slug: 'countdown-clock',
			icon: '⏱️',
			description: 'Custom Countdown Timer for Competitions'
		},
		{
			name: '3lb Event',
			slug: '3lb-event',
			icon: '🤖',
			description: 'Our hosted 3lb plastic competition'
		}
	];
</script>

<svelte:head>
	<title>Projects | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Projects</h1>
	<p>Our team's current project board</p>
</section>

<section class="section">
	<div class="container">
		<div class="board-wrapper">
			<iframe
				src="https://sharing.clickup.com/9011781189/b/h/4-90112834328-2/597252a6b651153"
				title="KSU Combat Robotics Project Board"
				allowfullscreen
			></iframe>
		</div>
		<div class="board-link">
			<a href="https://sharing.clickup.com/9011781189/b/h/4-90112834328-2/597252a6b651153" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
				Open in ClickUp
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12l8-8M5 4h7v7" stroke-linecap="round" stroke-linejoin="round"/></svg>
			</a>
		</div>
	</div>
</section>

<section class="section" style="background: var(--bg-secondary);">
	<div class="container">
		<h2 class="section-title">Club <span>Projects</span></h2>
		<div class="projects-grid">
			{#each projects as project}
				<a href="/projects/{project.slug}" class="project-card card">
					<span class="project-icon">{project.icon}</span>
					<h3>{project.name}</h3>
					<p>{project.description}</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.board-wrapper {
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		border: 1px solid var(--border-color);
	}

	.board-wrapper iframe {
		width: 100%;
		height: 75vh;
		border: none;
		display: block;
	}

	.board-link {
		text-align: center;
		margin-top: 1.5rem;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.project-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 2rem 1.25rem;
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
		border: 2px solid transparent;
	}

	.project-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
		border-color: var(--gold);
		color: inherit;
	}

	.project-icon {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.project-card h3 {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;
		color: var(--gold);
	}

	.project-card p {
		font-size: 0.8125rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.projects-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 400px) {
		.projects-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
