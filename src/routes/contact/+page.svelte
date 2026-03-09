<svelte:head>
	<title>Contact Us | KSU Combat Robotics</title>
</svelte:head>

<section class="hero">
	<h1>Contact Us</h1>
	<p>Have questions or comments? Want to support us? Let us know!</p>
</section>

<section class="section">
	<div class="container">
		<div class="contact-content">
			<div class="contact-notice card">
				<div class="notice-icon">
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5">
						<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
						<polyline points="22,6 12,13 2,6"/>
					</svg>
				</div>
				<h2>Contact Form Temporarily Unavailable</h2>
				<p>The contact form is currently disabled. In the meantime, you can reach us through these channels:</p>

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
</section>

<style>
	.contact-content {
		max-width: 600px;
		margin: 0 auto;
	}

	.contact-notice {
		padding: 3rem 2rem;
		text-align: center;
	}

	.notice-icon {
		margin-bottom: 1.5rem;
	}

	.contact-notice h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.contact-notice > p {
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.contact-methods {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		text-align: left;
	}

	.contact-method {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
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
		width: 48px;
		height: 48px;
		border-radius: var(--radius-md);
		background: rgba(235,171,33,0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--gold);
		flex-shrink: 0;
	}

	.contact-method strong {
		display: block;
		font-size: 0.9375rem;
		margin-bottom: 0.125rem;
	}

	.contact-method span {
		font-size: 0.8125rem;
		color: var(--text-muted);
	}
</style>
