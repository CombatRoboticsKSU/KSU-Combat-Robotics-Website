<script lang="ts">
	import { Calendar, MapPin, Weight, ChevronRight } from 'lucide-svelte';
	import { eventBadge } from '$lib/utils/events';

	let { data } = $props();

	// sortDate is stored from a date input as UTC midnight, so read it back in UTC to avoid an off-by-one day.
	function dateParts(d: Date | string) {
		const date = new Date(d);
		return {
			month: date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
			day: date.toLocaleString('en-US', { day: 'numeric', timeZone: 'UTC' }),
			year: date.toLocaleString('en-US', { year: 'numeric', timeZone: 'UTC' })
		};
	}

	function badgeFor(e: (typeof data.upcoming)[number]) {
		return eventBadge(e.status, e.registrationOpen, e.isFull, e.competitorPriceId !== '' || e.memberCodeEnabled);
	}
</script>

<svelte:head>
	<title>Events | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Events</h1>
	<p>Combat robotics competitions hosted by KSU Combat Robotics. Register a bot or grab a spectator ticket.</p>
</section>

<section class="section">
	<div class="container">
		{#if data.upcoming.length === 0 && data.past.length === 0}
			<div class="empty-state">
				<Calendar size={32} />
				<p>No events are scheduled right now.</p>
				<p class="empty-sub">Check back soon for the next competition.</p>
			</div>
		{:else}
			{#if data.upcoming.length > 0}
				<h2 class="list-heading">Upcoming</h2>
				<ul class="upcoming-list">
					{#each data.upcoming as e (e.id)}
						{@const badge = badgeFor(e)}
						{@const d = dateParts(e.sortDate)}
						<li>
							<a href="/events/{e.slug}" class="event-row">
								<div class="date-block" aria-hidden="true">
									<span class="date-month">{d.month}</span>
									<span class="date-day">{d.day}</span>
									<span class="date-year">{d.year}</span>
								</div>
								<img src={e.image} alt="" class="row-image" loading="lazy" />
								<div class="row-body">
									<h3>{e.name}</h3>
									{#if e.tagline}<p class="row-tagline">{e.tagline}</p>{/if}
									<ul class="row-meta">
										<li><Calendar size={15} /><span>{e.eventDate}</span></li>
										{#if e.location}<li><MapPin size={15} /><span>{e.location}</span></li>{/if}
										{#if e.weightClass}<li><Weight size={15} /><span>{e.weightClass}</span></li>{/if}
									</ul>
								</div>
								<div class="row-status">
									<span class="status-badge" data-tone={badge.tone}>{badge.text}</span>
									<span class="row-cta">View event <ChevronRight size={16} /></span>
								</div>
							</a>
						</li>
					{/each}
				</ul>
			{/if}

			{#if data.past.length > 0}
				<h2 class="list-heading" class:with-margin={data.upcoming.length > 0}>Past events</h2>
				<ul class="past-grid">
					{#each data.past as e (e.id)}
						<li>
							<a href="/events/{e.slug}" class="past-card">
								<img src={e.image} alt="" class="past-image" loading="lazy" />
								<div class="past-body">
									<span class="past-date">{e.eventDate}</span>
									<h3>{e.name}</h3>
									{#if e.location}<p class="past-meta">{e.location}</p>{/if}
								</div>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		{/if}
	</div>
</section>

<style>
	ul {
		list-style: none;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text-secondary);
		font-size: 1.05rem;
	}

	.empty-state :global(svg) {
		color: var(--gold);
		margin-bottom: 0.5rem;
	}

	.empty-sub {
		color: var(--text-muted);
		font-size: 0.9375rem;
	}

	.list-heading {
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border-color);
	}

	.list-heading.with-margin {
		margin-top: 4rem;
	}

	/* Upcoming rows */
	.upcoming-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.event-row {
		display: grid;
		grid-template-columns: 5.5rem 13rem 1fr auto;
		align-items: stretch;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		overflow: hidden;
		color: inherit;
		transition:
			border-color var(--transition),
			background var(--transition);
	}

	.event-row:hover {
		border-color: rgba(235, 171, 33, 0.45);
		background: var(--bg-card-hover);
		color: inherit;
	}

	.event-row:focus-visible {
		outline-offset: 3px;
		border-radius: var(--radius-md);
	}

	.date-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem 0.5rem;
		background: linear-gradient(180deg, var(--navy) 0%, var(--navy-dark) 100%);
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.date-month {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--gold);
	}

	.date-day {
		font-size: 2.25rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		margin: 0.25rem 0;
		color: var(--text-primary);
	}

	.date-year {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.row-image {
		width: 100%;
		height: 100%;
		min-height: 9rem;
		object-fit: cover;
		display: block;
	}

	.row-body {
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.375rem;
		min-width: 0;
	}

	.row-body h3 {
		font-size: 1.25rem;
		color: var(--text-primary);
		letter-spacing: -0.01em;
	}

	.row-tagline {
		font-size: 0.9375rem;
		color: var(--text-secondary);
	}

	.row-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem 1.25rem;
		margin-top: 0.375rem;
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.row-meta li {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
	}

	.row-meta :global(svg) {
		color: var(--gold);
		flex-shrink: 0;
	}

	.row-status {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 1.5rem 1.25rem 0;
	}

	.row-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--gold);
		white-space: nowrap;
	}

	.row-cta :global(svg) {
		transition: transform var(--transition);
	}

	.event-row:hover .row-cta :global(svg) {
		transform: translateX(3px);
	}

	.status-badge {
		font-size: 1.0625rem;
		font-weight: 700;
		white-space: nowrap;
		color: var(--text-secondary);
	}

	.status-badge[data-tone='open'] {
		color: var(--gold);
	}

	/* Past events */
	.past-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: 1rem;
	}

	.past-card {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		overflow: hidden;
		color: inherit;
		transition: border-color var(--transition);
	}

	.past-card:hover {
		border-color: rgba(235, 171, 33, 0.35);
		color: inherit;
	}

	.past-image {
		width: 100%;
		height: 8rem;
		object-fit: cover;
		display: block;
		filter: grayscale(0.6) brightness(0.8);
		transition: filter var(--transition);
	}

	.past-card:hover .past-image {
		filter: none;
	}

	.past-body {
		padding: 1rem 1.125rem 1.125rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.past-date {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
	}

	.past-card h3 {
		font-size: 1rem;
		color: var(--text-primary);
	}

	.past-meta {
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	@media (max-width: 900px) {
		.event-row {
			grid-template-columns: 5rem 1fr;
			grid-template-areas:
				'date image'
				'body body'
				'status status';
		}

		.date-block {
			grid-area: date;
		}

		.row-image {
			grid-area: image;
			min-height: 0;
			height: 8.5rem;
		}

		.row-body {
			grid-area: body;
			padding: 1.125rem 1.25rem 0.5rem;
		}

		.row-status {
			grid-area: status;
			flex-direction: row;
			align-items: center;
			padding: 0.75rem 1.25rem 1.125rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.event-row,
		.past-card,
		.past-image,
		.row-cta :global(svg) {
			transition: none;
		}
	}
</style>
