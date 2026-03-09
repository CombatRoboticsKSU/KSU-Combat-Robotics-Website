<script lang="ts">
	import { page } from '$app/state';

	let mobileOpen = $state(false);
	let updatesOpen = $state(false);
	let scrolled = $state(false);

	const navLinks = [
		{ href: '/sponsorship', label: 'Sponsors' },
		{ href: '/contact', label: 'Contact' },
		{ href: '/wiki', label: 'Bot Wiki' },
		{ href: '/leadership', label: 'Leadership' },
	];

	const updatesLinks = [
		{ href: '/blog', label: 'Team Updates' },
		{ href: '/publicity', label: 'Media Coverage' },
	];

	const rightLinks = [
		{ href: '/calendar', label: 'Calendar' },
		{ href: 'https://www.instagram.com/ksucombatrobotics/', label: 'Instagram', external: true },
		{ href: 'https://kent.campuslabs.com/engage/organization/combatrobotics', label: 'KSU Engage', external: true },
	];

	function isActive(href: string): boolean {
		return page.url?.pathname === href;
	}

	function closeMobile() {
		mobileOpen = false;
		updatesOpen = false;
	}

	function handleScroll() {
		scrolled = window.scrollY > 10;
	}
</script>

<svelte:window onscroll={handleScroll} />

<nav class="navbar" class:scrolled>
	<div class="nav-accent"></div>
	<div class="nav-inner">
		<a href="/" class="nav-logo" onclick={closeMobile}>
			<img src="/USINGimg/Logos.png" alt="KSU Combat Robotics" />
		</a>

		<div class="nav-links" class:open={mobileOpen}>
			{#each navLinks as link}
				<a
					href={link.href}
					class="nav-link"
					class:active={isActive(link.href)}
					onclick={closeMobile}
				>
					{link.label}
				</a>
			{/each}

			<div class="dropdown">
				<button
					class="nav-link dropdown-toggle"
					onclick={() => updatesOpen = !updatesOpen}
					class:active={isActive('/blog') || isActive('/publicity')}
				>
					Updates
					<svg width="10" height="10" viewBox="0 0 10 10" fill="none" class="chevron" class:rotated={updatesOpen}>
						<path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				{#if updatesOpen}
					<div class="dropdown-menu">
						{#each updatesLinks as link}
							<a href={link.href} class="dropdown-item" onclick={closeMobile}>
								{link.label}
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<div class="nav-spacer"></div>

			{#each rightLinks as link}
				<a
					href={link.href}
					class="nav-link"
					class:active={isActive(link.href)}
					target={link.external ? '_blank' : undefined}
					rel={link.external ? 'noopener noreferrer' : undefined}
					onclick={closeMobile}
				>
					{link.label}
					{#if link.external}
						<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.3" class="external-icon">
							<path d="M3.5 1.5H1.5V8.5H8.5V6.5M6 1.5H8.5V4M8.5 1.5L4.5 5.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					{/if}
				</a>
			{/each}
		</div>

		<button class="mobile-toggle" onclick={() => mobileOpen = !mobileOpen} aria-label="Toggle menu">
			<div class="hamburger" class:open={mobileOpen}>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</button>
	</div>
</nav>

<style>
	.navbar {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(1, 57, 117, 0.92);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		transition: all 0.3s ease;
	}

	.navbar.scrolled {
		background: rgba(1, 42, 88, 0.98);
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
	}

	.nav-accent {
		height: 3px;
		background: linear-gradient(90deg, var(--gold) 0%, var(--gold-dark) 50%, var(--gold) 100%);
	}

	.nav-inner {
		max-width: var(--max-width);
		margin: 0 auto;
		display: flex;
		align-items: center;
		padding: 0 1.5rem;
		height: 60px;
		gap: 0.5rem;
	}

	.nav-logo {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		transition: opacity 0.2s;
	}

	.nav-logo:hover {
		opacity: 0.85;
	}

	.nav-logo img {
		height: 36px;
		width: auto;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.125rem;
		flex: 1;
		margin-left: 1.5rem;
	}

	.nav-link {
		color: rgba(255,255,255,0.75);
		padding: 0.4375rem 0.75rem;
		border-radius: var(--radius-sm);
		font-size: 0.8125rem;
		font-weight: 500;
		transition: all 0.15s ease;
		white-space: nowrap;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		background: none;
		border: none;
		cursor: pointer;
		text-decoration: none;
		letter-spacing: 0.01em;
	}

	.nav-link:hover {
		color: white;
		background: rgba(255,255,255,0.08);
	}

	.nav-link.active {
		color: var(--gold);
		background: rgba(235,171,33,0.12);
	}

	.external-icon {
		opacity: 0.4;
		transition: opacity 0.15s;
	}

	.nav-link:hover .external-icon {
		opacity: 0.7;
	}

	.chevron {
		transition: transform 0.2s ease;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.nav-spacer {
		flex: 1;
	}

	.dropdown {
		position: relative;
	}

	.dropdown-toggle {
		font-family: inherit;
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 4px);
		left: 50%;
		transform: translateX(-50%);
		background: var(--navy);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: var(--radius-md);
		padding: 0.375rem;
		min-width: 170px;
		box-shadow: 0 8px 32px rgba(0,0,0,0.4);
		animation: dropIn 0.15s ease;
	}

	@keyframes dropIn {
		from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
		to { opacity: 1; transform: translateX(-50%) translateY(0); }
	}

	.dropdown-item {
		display: block;
		color: rgba(255,255,255,0.75);
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-sm);
		font-size: 0.8125rem;
		transition: all 0.15s;
		text-decoration: none;
	}

	.dropdown-item:hover {
		color: white;
		background: rgba(255,255,255,0.08);
	}

	/* Hamburger animation */
	.mobile-toggle {
		display: none;
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		padding: 0.5rem;
	}

	.hamburger {
		width: 20px;
		height: 14px;
		position: relative;
	}

	.hamburger span {
		display: block;
		position: absolute;
		height: 2px;
		width: 100%;
		background: white;
		border-radius: 2px;
		left: 0;
		transition: all 0.25s ease;
	}

	.hamburger span:nth-child(1) { top: 0; }
	.hamburger span:nth-child(2) { top: 6px; }
	.hamburger span:nth-child(3) { top: 12px; }

	.hamburger.open span:nth-child(1) {
		top: 6px;
		transform: rotate(45deg);
	}

	.hamburger.open span:nth-child(2) {
		opacity: 0;
	}

	.hamburger.open span:nth-child(3) {
		top: 6px;
		transform: rotate(-45deg);
	}

	@media (max-width: 860px) {
		.mobile-toggle {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.nav-links {
			display: none;
			position: absolute;
			top: 63px;
			left: 0;
			right: 0;
			flex-direction: column;
			background: rgba(1, 42, 88, 0.98);
			backdrop-filter: blur(16px);
			padding: 0.75rem 1rem 1rem;
			border-bottom: 1px solid rgba(255,255,255,0.08);
			gap: 0.125rem;
		}

		.nav-links.open {
			display: flex;
		}

		.nav-spacer {
			display: none;
		}

		.nav-link {
			width: 100%;
			justify-content: flex-start;
			padding: 0.625rem 0.75rem;
		}

		.dropdown-menu {
			position: static;
			transform: none;
			margin-top: 0;
			border: none;
			padding-left: 1rem;
			box-shadow: none;
			background: transparent;
			animation: none;
		}
	}
</style>
