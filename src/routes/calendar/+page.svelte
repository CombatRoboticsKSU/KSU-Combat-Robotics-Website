<svelte:head>
	<title>Calendar | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Meetings & Competition Dates</h1>
	<p>Stay up to date with our schedule</p>
</section>

<section class="section">
	<div class="container">
		<div class="calendar-intro">
			<div class="cal-badge">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
				We meet every Friday, 4:30 - 6:30 PM in 120 AEB
			</div>
		</div>
		<div class="calendar-wrapper">
			<div class="calendar-frame">
				<iframe
					src="https://calendar.google.com/calendar/embed?src=ksu.fightingrobotics%40gmail.com&ctz=America%2FNew_York"
					title="KSU Combat Robotics Calendar"
					frameborder="0"
					scrolling="no"
				></iframe>
			</div>
		</div>
		<div class="calendar-footer">
			<a href="https://calendar.google.com/calendar?cid=ksu.fightingrobotics%40gmail.com" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
				Subscribe to Calendar
			</a>
		</div>
	</div>
</section>

<style>
	.calendar-intro {
		text-align: center;
		margin-bottom: 2rem;
	}

	.cal-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		background: rgba(235,171,33,0.08);
		border: 1px solid rgba(235,171,33,0.18);
		border-radius: 100px;
		color: var(--gold);
		font-size: 0.9375rem;
		font-weight: 500;
	}

	.calendar-wrapper {
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: white;
		border: 1px solid var(--border-color);
		box-shadow: var(--shadow-lg), 0 0 60px rgba(0,0,0,0.2);
		position: relative;
	}

	.calendar-wrapper::before {
		content: '';
		position: absolute;
		inset: -1px;
		border-radius: var(--radius-lg);
		padding: 1px;
		background: linear-gradient(135deg, rgba(235,171,33,0.2), transparent 50%, rgba(235,171,33,0.1));
		mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		mask-composite: exclude;
		-webkit-mask-composite: xor;
		pointer-events: none;
		z-index: 1;
	}

	.calendar-frame iframe {
		width: 100%;
		height: 700px;
		border: none;
		display: block;
	}

	.calendar-footer {
		text-align: center;
		margin-top: 1.5rem;
	}

	@media (max-width: 640px) {
		.calendar-frame iframe {
			height: 500px;
		}
	}
</style>
