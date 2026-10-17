<script lang="ts">
	import {
		Calendar,
		Clock,
		MapPin,
		Weight,
		FileText,
		ShieldAlert,
		Download,
		ArrowLeft,
		ExternalLink,
		ChevronRight,
		Swords,
		Ticket
	} from 'lucide-svelte';
	import { eventBadge } from '$lib/utils/events';

	let { data } = $props();

	const badge = $derived(
		eventBadge(data.event.status, data.event.registrationOpen, data.isFull, data.event.competitorPriceId !== '' || data.memberCodeEnabled)
	);

	// sortDate is stored from a date input as UTC midnight, so read it back in UTC to avoid an off-by-one day.
	const date = $derived.by(() => {
		const d = new Date(data.event.sortDate);
		return {
			month: d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
			day: d.toLocaleString('en-US', { day: 'numeric', timeZone: 'UTC' })
		};
	});

	// Some events store the full "Doors 9:00 AM" string, so only add the prefix when it is missing.
	const doorsText = $derived(
		/^doors\b/i.test(data.event.doorsTime) ? data.event.doorsTime : `Doors ${data.event.doorsTime}`
	);

	const filledPercent = $derived(
		data.spotsLeft !== null && data.event.capacity > 0
			? Math.round(((data.event.capacity - data.spotsLeft) / data.event.capacity) * 100)
			: 0
	);
</script>

<svelte:head>
	<title>{data.event.name} | KSU Combat Robotics</title>
</svelte:head>

<section class="event-hero">
	<div class="hero-image-wrap" aria-hidden="true">
		<img src={data.event.image} alt="" class="hero-image" />
	</div>
	<div class="container hero-inner">
		<a href="/events" class="back-link"><ArrowLeft size={16} /> All events</a>
		<div class="hero-heading">
			<div class="date-block" aria-hidden="true">
				<span class="date-month">{date.month}</span>
				<span class="date-day">{date.day}</span>
			</div>
			<div class="hero-title">
				<span class="status-badge" data-tone={badge.tone}>{badge.text}</span>
				<h1>{data.event.name}</h1>
				{#if data.event.tagline}
					<p class="hero-tagline">{data.event.tagline}</p>
				{/if}
			</div>
		</div>
		<ul class="facts">
			<li><Calendar size={18} /><span>{data.event.eventDate}</span></li>
			{#if data.event.doorsTime}
				<li>
					<Clock size={18} />
					<span>{doorsText}</span>
				</li>
			{/if}
			<li>
				<MapPin size={18} />
				<span>{data.event.location}{#if data.event.address}, {data.event.address}{/if}</span>
			</li>
			{#if data.event.weightClass}
				<li><Weight size={18} /><span>{data.event.weightClass}</span></li>
			{/if}
		</ul>
	</div>
</section>

<div class="container event-layout">
	<aside class="event-rail">
		{#if data.event.status !== 'past'}
			<div class="panel actions-panel">
				<!-- Competitor -->
				{#snippet competitorMeta(showSpots: boolean)}
					{#if data.event.competitorPriceId === '' && data.memberCodeEnabled}
						<p class="action-note">Members register with the code from Discord.</p>
					{:else if data.event.competitorPrice}
						<p class="action-price">{data.event.competitorPrice}</p>
					{/if}
					{#if data.event.competitorNote}<p class="action-note">{data.event.competitorNote}</p>{/if}
					{#if showSpots && data.spotsLeft !== null}
						<div class="spots">
							<div class="spots-text">
								<span>{data.spotsLeft} spot{data.spotsLeft === 1 ? '' : 's'} left</span>
								<span class="spots-total">of {data.event.capacity}</span>
							</div>
							<div class="spots-bar" aria-hidden="true">
								<div class="spots-fill" style="width: {filledPercent}%"></div>
							</div>
						</div>
					{/if}
				{/snippet}
				<div class="action-block">
					<h2 class="action-heading"><Swords size={18} /> Compete</h2>
					{#if data.canRegister}
						{@render competitorMeta(true)}
						<a class="btn btn-primary action-btn" href="/events/{data.event.slug}/register">
							{data.event.competitorLabel}
							<ChevronRight size={18} />
						</a>
					{:else if data.event.competitorPriceId === '' && !data.memberCodeEnabled}
						{@render competitorMeta(false)}
						<p class="action-disabled">Coming soon</p>
					{:else if data.isFull}
						{@render competitorMeta(true)}
						<p class="action-disabled">Registration full</p>
					{:else}
						{@render competitorMeta(true)}
						<p class="action-disabled">Registration closed</p>
					{/if}
				</div>

				<!-- Spectator -->
				<div class="action-block">
					<h2 class="action-heading"><Ticket size={18} /> Watch</h2>
					{#if data.event.spectatorPrice}<p class="action-price">{data.event.spectatorPrice}</p>{/if}
					{#if data.event.spectatorNote}<p class="action-note">{data.event.spectatorNote}</p>{/if}
					{#if data.event.spectatorUrl}
						<a
							class="btn btn-secondary action-btn"
							href={data.event.spectatorUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							{data.event.spectatorLabel}
							<ExternalLink size={16} />
						</a>
					{:else}
						<p class="action-disabled">Coming soon</p>
					{/if}
				</div>
			</div>
		{/if}

		<div class="panel docs-panel">
			<h2 class="panel-heading">Documents</h2>
			<ul class="doc-list">
				{#if data.event.rulesPdfUrl}
					<li>
						<a class="doc-link" href={data.event.rulesPdfUrl} target="_blank" rel="noopener noreferrer">
							<span class="doc-icon"><FileText size={18} /></span>
							<span class="doc-text">
								<span class="doc-title">{data.event.rulesLabel}</span>
								<span class="doc-sub">PDF, opens in a new tab</span>
							</span>
							<ExternalLink size={16} />
						</a>
					</li>
				{/if}
				<li>
					{#if data.event.waiverPdfUrl}
						<a class="doc-link" href={data.event.waiverPdfUrl} target="_blank" rel="noopener noreferrer">
							<span class="doc-icon"><Download size={18} /></span>
							<span class="doc-text">
								<span class="doc-title">Competitor Waiver</span>
								<span class="doc-sub">PDF, opens in a new tab</span>
							</span>
							<ExternalLink size={16} />
						</a>
					{:else}
						<a class="doc-link" href="/events/{data.event.slug}/waiver">
							<span class="doc-icon"><FileText size={18} /></span>
							<span class="doc-text">
								<span class="doc-title">Competitor Waiver</span>
								<span class="doc-sub">Read online</span>
							</span>
							<ChevronRight size={16} />
						</a>
					{/if}
				</li>
			</ul>
			{#if data.event.rulesPdfUrl || data.event.status === 'upcoming'}
				<div class="hazard-note">
					<ShieldAlert size={20} />
					<div>
						<h3>Hazard Bots</h3>
						<p>Pneumatic systems (150 psi max) and weapons over 50% of robot weight require written technical pre-approval. See section 2 of the rules. Upload documentation when you register.</p>
					</div>
				</div>
			{/if}
		</div>
	</aside>

	<div class="event-main">
		{#if data.event.overview}
			<!-- Admin-authored HTML, same trust model as projects.about and posts.content: this content
			     is only ever written through the /admin routes, which src/hooks.server.ts guards. Not
			     a place to render unsanitized public input. -->
			<div class="article-content">
				{@html data.event.overview}
			</div>
		{/if}

		{#if data.event.schedule.length > 0}
			<section class="main-section">
				<h2 class="main-heading">Schedule</h2>
				<ol class="schedule-list">
					{#each data.event.schedule as item}
						<li class="schedule-item">
							<span class="schedule-time">{item.time}</span>
							<span class="schedule-label">{item.label}</span>
						</li>
					{/each}
				</ol>
			</section>
		{/if}

		{#if data.event.faq.length > 0}
			<section class="main-section">
				<h2 class="main-heading">Frequently asked questions</h2>
				<div class="faq-list">
					{#each data.event.faq as item}
						<div class="faq-item">
							<h3>{item.question}</h3>
							<p>{item.answer}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</div>

<style>
	/* Hero */
	.event-hero {
		position: relative;
		overflow: hidden;
		background: linear-gradient(160deg, var(--navy-dark) 0%, var(--navy) 70%, #01325e 100%);
		border-bottom: 1px solid rgba(235, 171, 33, 0.2);
	}

	.hero-image-wrap {
		position: absolute;
		inset: 0 0 0 35%;
		-webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 55%);
		mask-image: linear-gradient(90deg, transparent 0%, #000 55%);
	}

	.hero-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.45;
	}

	.hero-inner {
		position: relative;
		padding-top: 2rem;
		padding-bottom: 2.5rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.back-link:hover {
		color: var(--gold);
	}

	.hero-heading {
		display: flex;
		align-items: flex-start;
		gap: 1.5rem;
		animation: fadeInUp 0.5s ease both;
	}

	.date-block {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 5.5rem;
		padding: 0.875rem 0.5rem;
		background: rgba(1, 37, 80, 0.85);
		border: 1px solid rgba(235, 171, 33, 0.35);
		border-top: 4px solid var(--gold);
		border-radius: var(--radius-sm);
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.date-month {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--gold);
	}

	.date-day {
		font-size: 2.5rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		margin-top: 0.25rem;
	}

	.hero-title {
		min-width: 0;
	}

	.hero-title h1 {
		font-size: clamp(2rem, 5vw, 3.25rem);
		font-weight: 800;
		letter-spacing: -0.025em;
		line-height: 1.05;
		margin: 0.625rem 0 0.5rem;
		text-wrap: balance;
	}

	.hero-tagline {
		font-size: clamp(1rem, 1.8vw, 1.125rem);
		color: var(--text-secondary);
		max-width: 38rem;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8125rem;
		font-weight: 600;
		padding: 0.25rem 0.7rem;
		border-radius: 999px;
		border: 1px solid rgba(148, 163, 184, 0.3);
		background: rgba(10, 15, 26, 0.5);
		color: var(--text-secondary);
	}

	.status-badge::before {
		content: '';
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: currentColor;
	}

	.status-badge[data-tone='open'] {
		color: var(--gold);
		border-color: rgba(235, 171, 33, 0.45);
		background: rgba(235, 171, 33, 0.12);
	}

	.facts {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 2rem;
		margin-top: 2rem;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.facts li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9375rem;
		color: var(--text-primary);
	}

	.facts :global(svg) {
		color: var(--gold);
		flex-shrink: 0;
	}

	/* Layout */
	.event-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 21rem;
		gap: 3rem;
		align-items: start;
		padding-top: 3rem;
		padding-bottom: 4rem;
	}

	.event-rail {
		grid-column: 2;
		grid-row: 1;
		position: sticky;
		top: 5rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.event-main {
		grid-column: 1;
		grid-row: 1;
		min-width: 0;
	}

	/* Rail panels */
	.panel {
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
	}

	.actions-panel {
		border-color: rgba(235, 171, 33, 0.25);
	}

	.action-block {
		padding: 1.25rem 1.375rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.action-block + .action-block {
		border-top: 1px solid var(--border-color);
	}

	.action-heading,
	.panel-heading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1rem;
		font-weight: 700;
	}

	.action-heading :global(svg) {
		color: var(--gold);
	}

	.action-price {
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: -0.01em;
		font-variant-numeric: tabular-nums;
	}

	.action-note {
		font-size: 0.875rem;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.action-btn {
		justify-content: center;
		width: 100%;
		margin-top: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		text-align: center;
	}

	.action-disabled {
		margin-top: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-sm);
		border: 1px dashed var(--border-color);
		background: rgba(255, 255, 255, 0.02);
		color: var(--text-secondary);
		font-size: 0.9375rem;
		font-weight: 600;
		text-align: center;
	}

	.spots {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		margin-top: 0.25rem;
	}

	.spots-text {
		display: flex;
		justify-content: space-between;
		font-size: 0.8125rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.spots-total {
		color: var(--text-muted);
		font-weight: 500;
	}

	.spots-bar {
		height: 6px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		overflow: hidden;
	}

	.spots-fill {
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, var(--gold-dark), var(--gold));
	}

	.docs-panel {
		padding: 1.25rem 1.375rem;
	}

	.doc-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.875rem;
	}

	.doc-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-color);
		background: var(--bg-secondary);
		color: var(--text-secondary);
		transition:
			border-color var(--transition),
			color var(--transition);
	}

	.doc-link:hover {
		border-color: rgba(235, 171, 33, 0.45);
		color: var(--gold);
	}

	.doc-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: var(--radius-sm);
		background: rgba(235, 171, 33, 0.1);
		color: var(--gold);
	}

	.doc-text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.doc-title {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
		line-height: 1.3;
	}

	.doc-sub {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.doc-link > :global(svg:last-child) {
		flex-shrink: 0;
	}

	.hazard-note {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		margin-top: 1rem;
		padding: 0.875rem 1rem;
		border-radius: var(--radius-sm);
		border-left: 3px solid var(--gold);
		background: rgba(235, 171, 33, 0.06);
	}

	.hazard-note :global(svg) {
		color: var(--gold);
		flex-shrink: 0;
		margin-top: 0.1rem;
	}

	.hazard-note h3 {
		font-size: 0.9rem;
		margin-bottom: 0.25rem;
	}

	.hazard-note p {
		font-size: 0.8125rem;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	/* Main column */
	.article-content {
		max-width: 46rem;
	}

	.article-content :global(h2) {
		font-size: 1.375rem;
		margin: 2rem 0 0.875rem;
		letter-spacing: -0.01em;
	}

	.article-content :global(h2:first-child),
	.article-content :global(p:first-child) {
		margin-top: 0;
	}

	.article-content :global(h3) {
		font-size: 1.0625rem;
		margin: 1.5rem 0 0.625rem;
	}

	.article-content :global(p) {
		color: var(--text-secondary);
		line-height: 1.8;
		margin-bottom: 1.25rem;
		font-size: 1rem;
	}

	.article-content :global(ul),
	.article-content :global(ol) {
		color: var(--text-secondary);
		padding-left: 1.5rem;
		margin-bottom: 1.25rem;
		line-height: 1.8;
	}

	.article-content :global(li::marker) {
		color: var(--gold);
	}

	.article-content :global(a) {
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.article-content :global(strong) {
		color: var(--text-primary);
	}

	.main-section {
		margin-top: 3rem;
		max-width: 46rem;
	}

	.event-main > .main-section:first-child {
		margin-top: 0;
	}

	.main-heading {
		font-size: 1.375rem;
		letter-spacing: -0.01em;
		margin-bottom: 1.25rem;
	}

	.schedule-list {
		list-style: none;
		position: relative;
		border-left: 2px solid rgba(235, 171, 33, 0.3);
		margin-left: 0.375rem;
	}

	.schedule-item {
		position: relative;
		display: grid;
		grid-template-columns: 7rem 1fr;
		gap: 1rem;
		padding: 0.625rem 0 0.625rem 1.5rem;
	}

	.schedule-item::before {
		content: '';
		position: absolute;
		left: -0.4375rem;
		top: 1.0625rem;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		background: var(--bg-primary);
		border: 2px solid var(--gold);
	}

	.schedule-time {
		font-weight: 700;
		color: var(--gold);
		font-variant-numeric: tabular-nums;
	}

	.schedule-label {
		color: var(--text-secondary);
	}

	.faq-list {
		display: flex;
		flex-direction: column;
	}

	.faq-item {
		padding: 1.125rem 0;
		border-top: 1px solid var(--border-color);
	}

	.faq-item:last-child {
		border-bottom: 1px solid var(--border-color);
	}

	.faq-item h3 {
		font-size: 1rem;
		margin-bottom: 0.375rem;
		color: var(--text-primary);
	}

	.faq-item p {
		color: var(--text-secondary);
		font-size: 0.9375rem;
		line-height: 1.65;
	}

	@media (max-width: 960px) {
		.event-layout {
			grid-template-columns: 1fr;
			gap: 2.5rem;
			padding-top: 2rem;
		}

		.event-rail,
		.event-main {
			grid-column: 1;
			grid-row: auto;
		}

		.event-rail {
			position: static;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
			align-items: start;
		}
	}

	@media (max-width: 640px) {
		.hero-image-wrap {
			inset: 0;
			-webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 100%);
			mask-image: linear-gradient(180deg, #000 0%, transparent 100%);
		}

		.hero-image {
			opacity: 0.3;
		}

		.hero-inner {
			padding-top: 1.25rem;
			padding-bottom: 2rem;
		}

		.back-link {
			margin-bottom: 1.5rem;
		}

		.hero-heading {
			gap: 1rem;
		}

		.date-block {
			width: 4.25rem;
			padding: 0.625rem 0.375rem;
		}

		.date-day {
			font-size: 1.875rem;
		}

		.facts {
			flex-direction: column;
			gap: 0.625rem;
		}

		.schedule-item {
			grid-template-columns: 1fr;
			gap: 0.125rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-heading {
			animation: none;
		}

		.doc-link {
			transition: none;
		}
	}
</style>
