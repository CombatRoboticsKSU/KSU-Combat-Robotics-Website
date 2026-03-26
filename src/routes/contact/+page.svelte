<script lang="ts">
	import emailjs from '@emailjs/browser';
	import { PUBLIC_EMAILJS_SERVICE_ID, PUBLIC_EMAILJS_TEMPLATE_ID, PUBLIC_EMAILJS_USER_ID } from '$env/static/public';

	let name = $state('');
	let email = $state('');
	let title = $state('');
	let message = $state('');
	let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		status = 'sending';

		try {
			await emailjs.send(
				PUBLIC_EMAILJS_SERVICE_ID,
				PUBLIC_EMAILJS_TEMPLATE_ID,
				{
					from_name: name,
					subject: title,
					message: `${message}\n\nSender Email: ${email}`,
					reply_to: email
				},
				PUBLIC_EMAILJS_USER_ID
			);
			status = 'sent';
			name = '';
			email = '';
			title = '';
			message = '';
		} catch (error) {
			status = 'error';
			console.error('Email send failed:', error);
		}
	}
</script>

<svelte:head>
	<title>Contact Us | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Contact Us</h1>
	<p>Have questions or comments? Want to support us? Let us know!</p>
</section>

<section class="section">
	<div class="container">
		<div class="contact-layout">
			<form class="contact-form card" onsubmit={handleSubmit}>
				<div class="form-group">
					<label for="name">Name</label>
					<input type="text" id="name" bind:value={name} required placeholder="Your name" />
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" bind:value={email} required placeholder="your@email.com" />
				</div>
				<div class="form-group">
					<label for="title">Subject</label>
					<input type="text" id="title" bind:value={title} required placeholder="What's this about?" />
				</div>
				<div class="form-group">
					<label for="message">Message</label>
					<textarea id="message" bind:value={message} required rows="5" placeholder="Your message..."></textarea>
				</div>

				<button type="submit" class="btn btn-primary submit-btn" disabled={status === 'sending'}>
					{#if status === 'sending'}
						Sending...
					{:else}
						Send Message
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/></svg>
					{/if}
				</button>

				{#if status === 'sent'}
					<div class="status-msg success">Message sent successfully!</div>
				{:else if status === 'error'}
					<div class="status-msg error">Failed to send. Please try again or email us directly.</div>
				{/if}
			</form>

			<div class="contact-sidebar">
				<div class="sidebar-card card">
					<h3>Other Ways to Reach Us</h3>
					<div class="contact-methods">
						<a href="mailto:ksu.fightingrobotics@gmail.com" class="contact-method">
							<div class="method-icon">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
									<polyline points="22,6 12,13 2,6"/>
								</svg>
							</div>
							<div>
								<strong>Email</strong>
								<span>ksu.fightingrobotics@gmail.com</span>
							</div>
						</a>

						<a href="https://www.instagram.com/ksucombatrobotics/" target="_blank" rel="noopener noreferrer" class="contact-method">
							<div class="method-icon">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<rect x="2" y="2" width="20" height="20" rx="5"/>
									<circle cx="12" cy="12" r="5"/>
									<circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
								</svg>
							</div>
							<div>
								<strong>Instagram</strong>
								<span>@ksucombatrobotics</span>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.contact-layout {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 2rem;
		max-width: 900px;
		margin: 0 auto;
		align-items: start;
	}

	.contact-form {
		padding: 2rem;
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
		box-shadow: 0 0 0 3px rgba(235,171,33,0.1), 0 0 20px rgba(235,171,33,0.05);
		background: rgba(17,24,39,0.8);
	}

	.form-group input::placeholder,
	.form-group textarea::placeholder {
		color: var(--text-muted);
		opacity: 0.6;
	}

	.form-group textarea {
		resize: vertical;
		min-height: 120px;
	}

	.submit-btn {
		width: 100%;
		justify-content: center;
		gap: 0.5rem;
	}

	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.status-msg {
		text-align: center;
		margin-top: 1rem;
		padding: 0.75rem;
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.status-msg.success {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.2);
		color: #22c55e;
	}

	.status-msg.error {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.2);
		color: #ef4444;
	}

	.sidebar-card {
		padding: 1.5rem;
	}

	.sidebar-card h3 {
		font-size: 1rem;
		color: var(--gold);
		margin-bottom: 1rem;
	}

	.contact-methods {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.contact-method {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		border-radius: var(--radius-md);
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		color: inherit;
		text-decoration: none;
		transition: all var(--transition);
	}

	.contact-method:hover {
		border-color: var(--gold);
		color: inherit;
		transform: translateX(4px);
	}

	.method-icon {
		width: 40px;
		height: 40px;
		border-radius: var(--radius-md);
		background: rgba(235, 171, 33, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--gold);
		flex-shrink: 0;
	}

	.contact-method strong {
		display: block;
		font-size: 0.875rem;
		margin-bottom: 0.125rem;
	}

	.contact-method span {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	@media (max-width: 768px) {
		.contact-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
