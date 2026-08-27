<script lang="ts">
	import { page } from '$app/state';
	import { ArrowRight, ShieldAlert } from 'lucide-svelte';

	let { data, form } = $props();

	const canceled = $derived(page.url.searchParams.get('canceled') !== null);
</script>

<svelte:head>
	<title>Register | {data.event.name} | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Register to Compete</h1>
	<p>{data.event.name}</p>
</section>

<section class="section">
	<div class="container">
		<div class="register-layout">
			<form class="register-form card" method="POST">
				{#if form?.error}
					<div class="form-error">{form.error}</div>
				{/if}
				{#if canceled}
					<div class="form-notice">Payment canceled, you can try again.</div>
				{/if}

				<div class="form-group">
					<label for="builderName">Builder Name</label>
					<input
						id="builderName"
						name="builderName"
						type="text"
						value={form?.values?.builderName ?? ''}
						required
					/>
				</div>

				<div class="form-group">
					<label for="email">Email</label>
					<input id="email" name="email" type="email" value={form?.values?.email ?? ''} required />
				</div>

				<div class="form-group">
					<label for="phone">Phone</label>
					<input id="phone" name="phone" type="tel" value={form?.values?.phone ?? ''} />
				</div>

				<div class="form-group">
					<label for="teamName">Team or School</label>
					<input id="teamName" name="teamName" type="text" value={form?.values?.teamName ?? ''} />
				</div>

				<div class="form-group">
					<label for="botName">Bot Name</label>
					<input id="botName" name="botName" type="text" value={form?.values?.botName ?? ''} required />
				</div>

				<div class="form-group">
					<label for="weaponType">Weapon Type</label>
					<input id="weaponType" name="weaponType" type="text" value={form?.values?.weaponType ?? ''} />
				</div>

				<div class="form-group">
					<label for="notes">Notes</label>
					<textarea id="notes" name="notes" rows="4">{form?.values?.notes ?? ''}</textarea>
				</div>

				<label class="waiver-group">
					<input type="checkbox" name="waiverAck" checked={form?.values?.waiverAck ?? false} required />
					<span>
						I have read the event rules and understand that combat robotics carries risk of injury
						and equipment damage. A signed waiver is required at check-in.
					</span>
				</label>

				<button type="submit" class="btn btn-primary submit-btn">
					Continue to Payment
					<ArrowRight size={16} />
				</button>
			</form>

			<div class="register-sidebar">
				<div class="sidebar-card card">
					<h3>{data.event.name}</h3>
					{#if data.event.competitorPrice}
						<p class="sidebar-price">{data.event.competitorPrice}</p>
					{/if}
					{#if data.event.competitorNote}
						<p class="sidebar-note">{data.event.competitorNote}</p>
					{/if}
					<div class="sidebar-warning">
						<ShieldAlert size={18} />
						<span>You will be redirected to Stripe to complete payment.</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.register-layout {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 2rem;
		max-width: 900px;
		margin: 0 auto;
		align-items: start;
	}

	.register-form {
		padding: 2rem;
	}

	.form-error {
		padding: 0.75rem 1rem;
		margin-bottom: 1.25rem;
		border-radius: var(--radius-md);
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.2);
		color: #ef4444;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.form-notice {
		padding: 0.75rem 1rem;
		margin-bottom: 1.25rem;
		border-radius: var(--radius-md);
		background: rgba(235, 171, 33, 0.1);
		border: 1px solid rgba(235, 171, 33, 0.2);
		color: var(--gold);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		font-size: 0.8125rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		font-size: 0.9375rem;
		font-family: inherit;
		transition: all 0.25s ease;
		box-sizing: border-box;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--gold);
		box-shadow: 0 0 0 3px rgba(235, 171, 33, 0.1), 0 0 20px rgba(235, 171, 33, 0.05);
		background: rgba(17, 24, 39, 0.8);
	}

	.form-group textarea {
		resize: vertical;
		min-height: 100px;
	}

	.waiver-group {
		display: flex;
		align-items: flex-start;
		gap: 0.625rem;
		margin-bottom: 1.5rem;
		padding: 0.875rem 1rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		cursor: pointer;
	}

	.waiver-group input {
		margin-top: 0.2rem;
		flex-shrink: 0;
	}

	.waiver-group span {
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.submit-btn {
		width: 100%;
		justify-content: center;
		gap: 0.5rem;
	}

	.sidebar-card {
		padding: 1.5rem;
	}

	.sidebar-card h3 {
		font-size: 1.0625rem;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.sidebar-price {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--gold);
		margin-bottom: 0.25rem;
	}

	.sidebar-note {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.sidebar-warning {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
		font-size: 0.8125rem;
		color: var(--text-muted);
	}

	.sidebar-warning :global(svg) {
		flex-shrink: 0;
		color: var(--gold);
	}

	@media (max-width: 768px) {
		.register-layout {
			grid-template-columns: 1fr;
		}

		.register-form {
			padding: 1.5rem 1rem;
		}

		.sidebar-card {
			padding: 1.5rem 1rem;
		}
	}
</style>
