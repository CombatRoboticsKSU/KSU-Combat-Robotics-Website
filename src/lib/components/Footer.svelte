<script lang="ts">
	const footerSections = [
		{
			title: 'About',
			links: [
				{ label: 'Team Updates', href: '/blog' },
				{ label: 'Leadership', href: '/leadership' },
				{ label: 'History', href: '/history' },
				{ label: 'Projects', href: '/projects' },
			]
		},
		{
			title: 'Our Bots',
			links: [
				{ label: 'Club Owned Bots', href: '/wiki' },
				{ label: 'Personal Bots', href: '/pbots' },
			]
		},
		{
			title: 'Connect',
			links: [
				{ label: 'Instagram', href: 'https://www.instagram.com/ksucombatrobotics/', external: true },
				{ label: 'KSU Engage', href: 'https://kent.campuslabs.com/engage/organization/combatrobotics', external: true },
			]
		},
		{
			title: 'Sponsorship & Contact',
			links: [
				{ label: 'Sponsors', href: '/sponsorship' },
				{ label: 'Email Us', href: '/contact' },
			]
		},
		{
			title: 'Legal',
			links: [
				{ label: 'Kent State CSI', href: 'https://www.kent.edu/csi', external: true },
				{ label: 'Anti-Hazing Policy', href: 'https://www.kent.edu/studentconduct/anti-hazing', external: true },
			]
		}
	];
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
		background: var(--navy-dark);
		border-top: 1px solid rgba(255,255,255,0.05);
		padding: 3.5rem 1.5rem 1.5rem;
		margin-top: auto;
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
		transition: color 0.15s;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	.footer-section a:hover {
		color: var(--gold);
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
		.footer-grid {
			grid-template-columns: 1fr;
			gap: 1.25rem;
		}
		.footer-bottom {
			flex-direction: column;
			gap: 0.5rem;
			text-align: center;
		}
		.footer-brand {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
