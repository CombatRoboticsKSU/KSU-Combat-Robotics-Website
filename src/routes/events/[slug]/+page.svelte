<script lang="ts">
	import { Calendar, Clock, MapPin, Weight } from 'lucide-svelte';
	import { eventBadge } from '$lib/utils/events';

	let { data } = $props();

	const badge = $derived(
		eventBadge(data.event.status, data.event.registrationOpen, data.isFull, data.event.competitorPriceId !== '')
	);
</script>

<svelte:head>
	<title>{data.event.name} | KSU Combat Robotics</title>
</svelte:head>

<section class="hero event-hero">
	<div class="event-hero-image-wrap">
		<img src={data.event.image} alt={data.event.name} class="event-hero-image" />
	</div>
	<div class="event-hero-content">
		<span class="event-badge" data-tone={badge.tone}>{badge.text}</span>
		<h1>{data.event.name}</h1>
		{#if data.event.tagline}
			<p>{data.event.tagline}</p>
		{/if}
	</div>
</section>

<div class="logistics-strip">
	<div class="container logistics-inner">
		<div class="logistics-item">
			<Calendar size={18} />
			<span>{data.event.eventDate}</span>
		</div>
		{#if data.event.doorsTime}
			<div class="logistics-item">
				<Clock size={18} />
				<span>Doors {data.event.doorsTime}</span>
			</div>
		{/if}
		<div class="logistics-item">
			<MapPin size={18} />
			<span>{data.event.location}{#if data.event.address}, {data.event.address}{/if}</span>
		</div>
		{#if data.event.weightClass}
			<div class="logistics-item">
				<Weight size={18} />
				<span>{data.event.weightClass}</span>
			</div>
		{/if}
	</div>
</div>

<section class="section overview-section">
	<div class="container article-content">
		<!-- Admin-authored HTML, same trust model as projects.about and posts.content: this content
		     is only ever written through the /admin routes, which src/hooks.server.ts guards. Not
		     a place to render unsanitized public input. -->
		{@html data.event.overview}

		{#if data.event.rulesPdfUrl}
			<a class="btn btn-secondary rules-btn" href={data.event.rulesPdfUrl} target="_blank" rel="noopener noreferrer">
				{data.event.rulesLabel}
			</a>
		{/if}
	</div>
</section>

{#if data.event.status !== 'past'}
	<section class="section action-section">
		<div class="container">
			<div class="action-cards">
				<!-- Competitor -->
				{#snippet competitorMeta(showSpots: boolean)}
					{#if data.event.competitorPrice}<span class="action-card-price">{data.event.competitorPrice}</span>{/if}
					{#if data.event.competitorNote}<span class="action-card-note">{data.event.competitorNote}</span>{/if}
					{#if showSpots && data.spotsLeft !== null}
						<span class="action-card-spots">{data.spotsLeft} spot{data.spotsLeft === 1 ? '' : 's'} left</span>
					{/if}
				{/snippet}
				{#if data.canRegister}
					<a class="action-card primary" href="/events/{data.event.slug}/register">
						{data.event.competitorLabel}
						{@render competitorMeta(true)}
					</a>
				{:else if data.event.competitorPriceId === ''}
					<div class="action-card disabled">
						Coming soon
						{@render competitorMeta(false)}
					</div>
				{:else if data.isFull}
					<div class="action-card disabled">
						Registration full
						{@render competitorMeta(true)}
					</div>
				{:else}
					<div class="action-card disabled">
						Registration closed
						{@render competitorMeta(true)}
					</div>
				{/if}

				<!-- Spectator -->
				{#snippet spectatorMeta()}
					{#if data.event.spectatorPrice}<span class="action-card-price">{data.event.spectatorPrice}</span>{/if}
					{#if data.event.spectatorNote}<span class="action-card-note">{data.event.spectatorNote}</span>{/if}
				{/snippet}
				{#if data.event.spectatorUrl}
					<a
						class="action-card"
						href={data.event.spectatorUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						{data.event.spectatorLabel}
						{@render spectatorMeta()}
					</a>
				{:else}
					<div class="action-card disabled">
						Coming soon
						{@render spectatorMeta()}
					</div>
				{/if}
			</div>
		</div>
	</section>
{/if}

{#if data.event.schedule.length > 0}
	<section class="section schedule-section">
		<div class="container">
			<h2 class="section-title">Event <span>Schedule</span></h2>
			<div class="schedule-list">
				{#each data.event.schedule as item}
					<div class="schedule-item">
						<span class="schedule-time">{item.time}</span>
						<span class="schedule-label">{item.label}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if data.event.faq.length > 0}
	<section class="section faq-section">
		<div class="container">
			<h2 class="section-title">Frequently Asked <span>Questions</span></h2>
			<div class="faq-list">
				{#each data.event.faq as item}
					<div class="faq-item card">
						<h3>{item.question}</h3>
						<p>{item.answer}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.event-hero {
		position: relative;
		padding: 0;
		text-align: left;
		overflow: hidden;
	}

	.event-hero-image-wrap {
		position: absolute;
		inset: 0;
	}

	.event-hero-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.35;
	}

	.event-hero-content {
		position: relative;
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 4rem 1.5rem;
	}

	.event-hero-content h1 {
		font-size: clamp(1.75rem, 4vw, 2.75rem);
		font-weight: 800;
		margin-bottom: 0.5rem;
		letter-spacing: -0.02em;
	}

	.event-hero-content p {
		font-size: clamp(0.9375rem, 1.8vw, 1.0625rem);
		color: var(--text-secondary);
		max-width: 600px;
		line-height: 1.6;
	}

	.event-badge {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		border: 1px solid currentColor;
		margin-bottom: 0.75rem;
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

	.logistics-strip {
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border-color);
	}

	.logistics-inner {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		padding: 1rem 1.5rem;
	}

	.logistics-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.logistics-item :global(svg) {
		color: var(--gold);
		flex-shrink: 0;
	}

	.article-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.article-content :global(h2) {
		font-size: 1.5rem;
		margin: 2rem 0 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.article-content :global(p) {
		color: var(--text-secondary);
		line-height: 1.8;
		margin-bottom: 1.25rem;
		font-size: 0.9375rem;
	}

	.article-content :global(ul) {
		color: var(--text-secondary);
		padding-left: 1.5rem;
		margin-bottom: 1.25rem;
		line-height: 1.8;
	}

	.rules-btn {
		margin-top: 0.5rem;
	}

	.action-cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.action-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		text-align: center;
		padding: 2rem 1.5rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: var(--bg-card);
		color: var(--text-primary);
		text-decoration: none;
		font-weight: 600;
		font-size: 1.0625rem;
		transition: all 0.2s ease;
	}

	.action-card:not(.disabled):hover {
		border-color: var(--gold);
		background: var(--bg-card-hover);
		transform: translateY(-2px);
	}

	.action-card.primary {
		background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
		color: var(--navy-dark);
		border-color: transparent;
	}

	.action-card.primary:hover {
		background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 100%);
	}

	.action-card.disabled {
		color: var(--text-muted);
		cursor: not-allowed;
		opacity: 0.7;
	}

	.action-card-price {
		font-size: 1.25rem;
		font-weight: 700;
	}

	.action-card-note {
		font-size: 0.8125rem;
		font-weight: 400;
		opacity: 0.85;
	}

	.action-card-spots {
		font-size: 0.8125rem;
		font-weight: 500;
		opacity: 0.85;
	}

	.schedule-list {
		max-width: 700px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.schedule-item {
		display: flex;
		gap: 1.5rem;
		padding: 1rem 1.25rem;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
	}

	.schedule-time {
		flex-shrink: 0;
		font-weight: 600;
		color: var(--gold);
		min-width: 6rem;
	}

	.schedule-label {
		color: var(--text-secondary);
	}

	.faq-list {
		max-width: 700px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.faq-item {
		padding: 1.25rem 1.5rem;
	}

	.faq-item h3 {
		font-size: 1rem;
		margin-bottom: 0.5rem;
		color: var(--text-primary);
	}

	.faq-item p {
		color: var(--text-secondary);
		font-size: 0.9rem;
		line-height: 1.6;
	}

	@media (max-width: 640px) {
		.action-cards {
			grid-template-columns: 1fr;
		}

		.event-hero-content {
			padding: 3rem 1rem;
		}
	}
</style>
