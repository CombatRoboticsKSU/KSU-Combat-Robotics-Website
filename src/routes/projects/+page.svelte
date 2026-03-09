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
</style>
