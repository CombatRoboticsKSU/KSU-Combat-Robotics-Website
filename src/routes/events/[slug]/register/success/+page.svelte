<script lang="ts">
	import { CheckCircle2, Clock, ShieldAlert, ArrowLeft } from 'lucide-svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Registration {data.confirmed ? 'Confirmed' : 'Pending'} | {data.event.name} | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Registration {data.confirmed ? 'Confirmed' : 'Received'}</h1>
	<p>{data.event.name}</p>
</section>

<section class="section">
	<div class="container">
		<div class="status-card card">
			{#if data.confirmed}
				<div class="status-icon confirmed">
					<CheckCircle2 size={40} />
				</div>
				<h2>You are registered.</h2>
				<p class="status-detail">
					<strong>{data.botName}</strong> for {data.builderName} is confirmed for {data.event.name}.
				</p>
				<div class="status-note">
					<ShieldAlert size={18} />
					<span>A signed waiver is required at check-in.</span>
				</div>
			{:else}
				<div class="status-icon pending">
					<Clock size={40} />
				</div>
				<h2>Payment received, confirming your registration.</h2>
				<p class="status-detail">
					<strong>{data.botName}</strong> for {data.builderName} is being confirmed for {data.event.name}.
					A confirmation email follows shortly.
				</p>
			{/if}

			<a href="/events/{data.event.slug}" class="btn btn-secondary back-link">
				<ArrowLeft size={16} />
				Back to {data.event.name}
			</a>
		</div>
	</div>
</section>

<style>
	.status-card {
		max-width: 560px;
		margin: 0 auto;
		padding: 2.5rem 2rem;
		text-align: center;
	}

	.status-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		margin-bottom: 1.25rem;
	}

	.status-icon.confirmed {
		background: rgba(34, 197, 94, 0.1);
		color: #22c55e;
	}

	.status-icon.pending {
		background: rgba(235, 171, 33, 0.1);
		color: var(--gold);
	}

	.status-card h2 {
		font-size: 1.375rem;
		margin-bottom: 0.75rem;
	}

	.status-detail {
		color: var(--text-secondary);
		font-size: 0.9375rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.status-note {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.875rem 1rem;
		margin-bottom: 1.5rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		font-size: 0.8125rem;
		color: var(--text-muted);
		text-align: left;
	}

	.status-note :global(svg) {
		flex-shrink: 0;
		color: var(--gold);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
