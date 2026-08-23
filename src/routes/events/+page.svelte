<script lang="ts">
	import { eventBadge } from '$lib/utils/events';

	let { data } = $props();
</script>

<svelte:head>
	<title>Events | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Events</h1>
	<p>Combat robotics events hosted by KSU Combat Robotics</p>
</section>

<section class="section">
	<div class="container">
		{#if data.upcoming.length === 0 && data.past.length === 0}
			<p class="empty-state">No events are scheduled right now. Check back soon.</p>
		{:else}
			{#if data.upcoming.length > 0}
				<h2 class="section-title">Upcoming <span>Events</span></h2>
				<div class="events-grid">
					{#each data.upcoming as e}
						{@const badge = eventBadge(e.status, e.registrationOpen, e.isFull)}
						<a href="/events/{e.slug}" class="event-card card">
							<img src={e.image} alt={e.name} class="event-image" />
							<div class="event-body">
								<span class="event-badge" data-tone={badge.tone}>{badge.text}</span>
								<h3>{e.name}</h3>
								<p class="event-tagline">{e.tagline}</p>
								<p class="event-meta">{e.eventDate}</p>
								<p class="event-meta">{e.location}</p>
							</div>
						</a>
					{/each}
				</div>
			{/if}

			{#if data.past.length > 0}
				<h2 class="section-title" class:with-margin={data.upcoming.length > 0}>Past <span>Events</span></h2>
				<div class="events-grid">
					{#each data.past as e}
						{@const badge = eventBadge(e.status, e.registrationOpen, e.isFull)}
						<a href="/events/{e.slug}" class="event-card card">
							<img src={e.image} alt={e.name} class="event-image" />
							<div class="event-body">
								<span class="event-badge" data-tone={badge.tone}>{badge.text}</span>
								<h3>{e.name}</h3>
								<p class="event-tagline">{e.tagline}</p>
								<p class="event-meta">{e.eventDate}</p>
								<p class="event-meta">{e.location}</p>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</section>

<style>
	.empty-state {
		text-align: center;
		color: var(--text-muted);
		padding: 3rem 1rem;
		font-size: 1.05rem;
	}

	.section-title.with-margin {
		margin-top: 3rem;
	}

	.events-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.event-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
	}

	.event-image {
		width: 100%;
		height: 160px;
		object-fit: cover;
		display: block;
	}

	.event-body {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.event-badge {
		display: inline-block;
		align-self: flex-start;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		border: 1px solid currentColor;
		margin-bottom: 0.25rem;
	}

	.event-badge[data-tone='open'] {
		color: var(--gold);
	}

	.event-badge[data-tone='closed'] {
		color: var(--text-muted);
	}

	.event-badge[data-tone='past'] {
		color: var(--text-secondary);
	}

	.event-card h3 {
		font-size: 1.125rem;
		color: var(--text-primary);
	}

	.event-tagline {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.event-meta {
		font-size: 0.8125rem;
		color: var(--text-muted);
	}

	@media (max-width: 768px) {
		.events-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.events-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
