<script lang="ts">
	import { Printer, Box, Timer, Bot, Wrench, Cpu, Hammer, Zap, Cog, Code, Shield, Hexagon, Component, Radio, Rocket, Activity, Gamepad2, PenTool } from 'lucide-svelte';

	const availableIcons: Record<string, any> = {
		Printer, Box, Timer, Bot, Wrench, Cpu, Hammer, Zap, Cog, Code, Shield, Hexagon, Component, Radio, Rocket, Activity, Gamepad2, PenTool
	};

	let { data } = $props();
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
			{#each data.projects as project}
				{@const Icon = availableIcons[project.icon] || availableIcons.Box}
				<a href="/projects/{project.slug}" class="project-card card">
					<span class="project-icon"><Icon size={40} /></span>
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
		box-shadow: var(--shadow-lg), 0 0 60px rgba(0,0,0,0.2);
		border: 1px solid rgba(235,171,33,0.1);
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
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border: 1px solid var(--border-color);
		position: relative;
	}

	.project-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40px;
		height: 3px;
		background: var(--gold);
		border-radius: 0 0 2px 2px;
		opacity: 0;
		transition: all 0.3s ease;
	}

	.project-card:hover::before {
		opacity: 1;
		width: 60%;
	}

	.project-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(235,171,33,0.06);
		border-color: rgba(235,171,33,0.2);
		color: inherit;
	}

	.project-icon {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		width: 64px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(235,171,33,0.06);
		border-radius: var(--radius-md);
		transition: all 0.3s ease;
	}

	.project-card:hover .project-icon {
		background: rgba(235,171,33,0.12);
		transform: scale(1.1);
	}

	.project-card h3 {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;
		color: var(--gold);
		transition: color 0.2s ease;
	}

	.project-card:hover h3 {
		color: var(--gold-light);
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

		.board-wrapper iframe {
			height: 50vh;
		}
	}

	@media (max-width: 480px) {
		.projects-grid {
			grid-template-columns: 1fr;
		}

		.project-card {
			padding: 1.5rem 1rem;
		}

		.board-link .btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
