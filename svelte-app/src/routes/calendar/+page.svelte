<svelte:head>
	<title>Calendar | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Meetings & Competition Dates</h1>
	<p>Stay up to date with our schedule</p>
</section>

<section class="section">
	<div class="container">
		<div class="calendar-wrapper">
			<iframe
				src="https://calendar.google.com/calendar/embed?src=ksu.fightingrobotics%40gmail.com&ctz=America%2FNew_York"
				title="KSU Combat Robotics Calendar"
				frameborder="0"
				scrolling="no"
			></iframe>
		</div>
	</div>
</section>

<style>
	.calendar-wrapper {
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		background: white;
	}

	.calendar-wrapper iframe {
		width: 100%;
		height: 700px;
		border: none;
		display: block;
	}

	@media (max-width: 640px) {
		.calendar-wrapper iframe {
			height: 500px;
		}
	}
</style>
