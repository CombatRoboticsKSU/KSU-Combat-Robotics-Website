<script lang="ts">
	let { socialLinks = [] } = $props<{ socialLinks?: { label: string; url: string }[] }>();

	const footerSections = $derived([
		{
			title: 'About',
			links: [
				{ label: 'Team Updates', href: '/blog', external: false },
				{ label: 'Leadership', href: '/leadership', external: false },
				{ label: 'History', href: '/history', external: false },
				{ label: 'Projects', href: '/projects', external: false },
			]
		},
		{
			title: 'Our Bots',
			links: [
				{ label: 'Club Owned Bots', href: '/wiki', external: false },
				{ label: 'Personal Bots', href: '/pbots', external: false },
			]
		},
		{
			title: 'Connect',
			links: socialLinks.map((s: { label: string; url: string }) => ({ label: s.label, href: s.url, external: true }))
		},
		{
			title: 'Sponsorship & Contact',
			links: [
				{ label: 'Sponsors', href: '/sponsorship', external: false },
				{ label: 'Email Us', href: '/contact', external: false },
			]
		},
		{
			title: 'Legal',
			links: [
				{ label: 'Kent State CSI', href: 'https://www.kent.edu/csi', external: true },
				{ label: 'Anti-Hazing Policy', href: 'https://www.kent.edu/studentconduct/anti-hazing', external: true },
			]
		}
	]);
</script>

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-top">
			<div class="footer-brand">
				<img src="/USINGimg/Logos.png" alt="KSU Combat Robotics" class="footer-logo" />
				<p>Designing, building, and competing in combat robotics at Kent State University.</p>
			</div>
			<div class="footer-grid">
				{#each footerSections as section}
					<div class="footer-section">
						<h4>{section.title}</h4>
						<ul>
							{#each section.links as link}
								<li>
									<a
										href={link.href}
										target={link.external ? '_blank' : undefined}
										rel={link.external ? 'noopener noreferrer' : undefined}
									>
										{link.label}
										{#if link.external}
											<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2" class="ext-icon">
												<path d="M3.5 1.5H1.5V8.5H8.5V6.5M6 1.5H8.5V4M8.5 1.5L4.5 5.5" stroke-linecap="round" stroke-linejoin="round"/>
											</svg>
										{/if}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<div class="footer-bottom">
			<p>&copy; {new Date().getFullYear()} KSU Combat Robotics &mdash; A registered organization of Kent State University</p>
			<p class="built-with">Built with SvelteKit</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: linear-gradient(180deg, var(--navy-dark) 0%, #010e1f 100%);
		border-top: 1px solid rgba(235,171,33,0.1);
		padding: 3.5rem 1.5rem 1.5rem;
		margin-top: auto;
		position: relative;
	}

	.footer::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent 0%, rgba(235,171,33,0.3) 50%, transparent 100%);
	}

	.footer-inner {
		max-width: var(--max-width);
		margin: 0 auto;
	}

	.footer-top {
		display: grid;
		grid-template-columns: 1fr 3fr;
		gap: 3rem;
		margin-bottom: 2.5rem;
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.footer-logo {
		height: 32px;
		width: auto;
		align-self: flex-start;
		opacity: 0.9;
	}

	.footer-brand p {
		font-size: 0.8125rem;
		color: var(--text-muted);
		line-height: 1.6;
		max-width: 220px;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1.5rem;
	}

	.footer-section h4 {
		color: rgba(255,255,255,0.9);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 0.875rem;
		font-weight: 600;
	}

	.footer-section ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.footer-section a {
		color: var(--text-muted);
		font-size: 0.8125rem;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	.footer-section a:hover {
		color: var(--gold);
		transform: translateX(3px);
	}

	.ext-icon {
		opacity: 0.3;
	}

	.footer-bottom {
		border-top: 1px solid rgba(255,255,255,0.06);
		padding-top: 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.footer-bottom p {
		color: rgba(255,255,255,0.25);
		font-size: 0.75rem;
	}

	@media (max-width: 960px) {
		.footer-top {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.footer-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.footer-brand {
			flex-direction: row;
			align-items: center;
		}

		.footer-brand p {
			max-width: none;
		}
	}

	@media (max-width: 640px) {
		.footer-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.footer {
			padding: 2.5rem 1.25rem 1.5rem;
		}

		.footer-top {
			gap: 2.5rem;
			margin-bottom: 2.5rem;
		}

		.footer-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 2rem 1rem;
		}

		.footer-brand {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.footer-logo {
			height: 44px;
			align-self: flex-start;
		}

		.footer-brand p {
			font-size: 0.875rem;
			max-width: 100%;
		}

		.footer-section h4 {
			font-size: 0.75rem;
			margin-bottom: 1rem;
		}

		.footer-section ul {
			gap: 0.625rem;
		}

		.footer-section a {
			font-size: 0.875rem;
			padding: 0.25rem 0;
		}

		.footer-bottom {
			flex-direction: column;
			gap: 0.875rem;
			text-align: center;
			padding-top: 1.5rem;
		}
	}
</style>
