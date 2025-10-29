<script lang="ts">
	import '/src/app.css';
	const favicon = '/icons/favicon.ico';
	const logo = '/icons/logo.svg';
	import { onMount } from 'svelte';

	interface NavItem {
		name: string;
		path?: string;
		children?: {name: string; path: string}[];
	}

	const leftNav: NavItem[] = [
		{ name: 'Sponsors', path: '/sponsorship' },
		{ name: 'Contact Us', path: '/contact' },
		{ name: 'KSU BOT Wiki', path: '/wiki' },
		{ name: 'Updates', children: [
			{ name: 'Team Updates', path: '/blog' },
			{ name: 'Project Status', path: '/projects' } ]},
		{ name: 'Leadership', path: '/leadership' },
		{ name: 'Projects', children: [
			{ name: 'Current', path: '/projects/current' },
			{ name: 'Archive', path: '/projects/archive' } ]}
	];

	const rightNav: NavItem[] = [
		{ name: 'Calendar', path: '/calendar' },
		{ name: 'Instagram Feed', path: '/instagram' },
		{ name: 'KSU Engage', path: '/ksu-engage' }
	];

	// (mobile menu will render leftNav + rightNav together)

	// Mobile nav open/close state
	let mobileNavOpen = $state(false);
	// mobile submenu open index (-1 = none)
	let mobileOpenIndex = $state(-1);

	let { children } = $props();

	// Svelte Query setup
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	const queryClient = new QueryClient();

	// Theme (dark/light) state
	let darkMode = $state(true);

	function applyTheme(value: boolean) {
		if (typeof document === 'undefined') return;
		darkMode = value;
		if (darkMode) document.documentElement.classList.add('dark');
		else document.documentElement.classList.remove('dark');
		try {
			localStorage.setItem('theme', darkMode ? 'dark' : 'light');
		} catch (e) {}
	}

	onMount(() => {
		try {
			const saved = localStorage.getItem('theme');
			if (saved === 'dark' || saved === 'light') {
				applyTheme(saved === 'dark');
			} else if (window.matchMedia) {
				applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
			}
		} catch (e) {
			// ignore (SSR or localStorage blocked)
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="site-header">
	<div class="container">
		<div class="header-inner">
			<!-- Left group: logo + left nav (edge-hugging) -->
			<div class="left-group">
				<div class="logo-gap">
					<a href="/" class="inline-flex items-center">
						<img src={logo} alt="KSU Combat Robotics" class="logo-img" />
					</a>
				</div>

				<div class="nav-box-left">
					{#each leftNav as item}
						{#if item.children}
							<div class="nav-group">
								<button class="nav-item" aria-haspopup="true">
									<span>{item.name}</span>
									<svg
										class="icon-sm text-white group-hover:text-ksu-gold"
										viewBox="0 0 20 20"
										fill="none"
										stroke="currentColor"
									>
										<path
											d="M6 8l4 4 4-4"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>
								<div class="nav-dropdown">
									<div class="py-2">
										{#each item.children as child}
											<a href={child.path} class="dropdown-link">{child.name}</a>
										{/each}
									</div>
								</div>
							</div>
						{:else}
							<a href={item.path} class="nav-link">{item.name}</a>
						{/if}
					{/each}
				</div>
			</div>

			<!-- flexible spacer between left and right groups -->
			<div class="flex-1" />

			<!-- Right group: right nav + header actions (edge-hugging) -->
			<div class="right-group">
				<div class="nav-box-right">
					{#each rightNav as item}
						{#if item.children}
							<div class="nav-group">
								<button class="nav-item" aria-haspopup="true">
									<span>{item.name}</span>
									<svg
										class="icon-sm text-white group-hover:text-ksu-gold"
										viewBox="0 0 20 20"
										fill="none"
										stroke="currentColor"
									>
										<path
											d="M6 8l4 4 4-4"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>
								<div class="nav-dropdown">
									<div class="py-2">
										{#each item.children as child}
											<a href={child.path} class="dropdown-link">{child.name}</a>
										{/each}
									</div>
								</div>
							</div>
						{:else}
							<a href={item.path} class="header-link">{item.name}</a>
						{/if}
					{/each}
				</div>
				<!-- Theme toggle on right (animated sun/moon SVG) -->
				<div class="header-actions">
					<button
						type="button"
						class="theme-toggle"
						aria-pressed={darkMode}
						onclick={() => applyTheme(!darkMode)}
						aria-label="Toggle dark mode"
					>
						<span class="sr-only">Toggle dark mode</span>
						<svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
							<g class="sun" stroke="currentColor" stroke-width="1.5" fill="currentColor">
								<circle cx="12" cy="12" r="4" />
								<path d="M12 2v2" />
								<path d="M12 20v2" />
								<path d="M2 12h2" />
								<path d="M20 12h2" />
								<path d="M4.93 4.93l1.41 1.41" />
								<path d="M17.66 17.66l1.41 1.41" />
								<path d="M4.93 19.07l1.41-1.41" />
								<path d="M17.66 6.34l1.41-1.41" />
							</g>
							<g class="moon" fill="currentColor">
								<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
							</g>
						</svg>
					</button>
				</div>

				<!-- Mobile menu button -->
				<div class="mobile-toggle">
					<button
						type="button"
						class="mobile-toggle-btn"
						aria-controls="mobile-menu"
						aria-expanded={mobileNavOpen}
						onclick={() => (mobileNavOpen = !mobileNavOpen)}
					>
						<span class="sr-only">Open main menu</span>
						{#if !mobileNavOpen}
							<svg
								class="icon-md"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg
							>
						{:else}
							<svg
								class="icon-md"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"><path d="M6 18L18 6M6 6l12 12" /></svg
							>
						{/if}
					</button>
				</div>
			</div>
			<!-- header-actions -->
		</div>
		<!-- header-inner -->
	</div>
	<!-- container -->

	<!-- Thin gold accent stripe (inside header) -->
	<div class="accent-stripe"></div>
	<!-- Mobile menu, full-screen panel -->
	{#if mobileNavOpen}
		<div id="mobile-menu" class="mobile-menu-panel">
			<div class="mobile-panel-inner">
				<div class="mobile-panel-header">
					<a href="/" class="inline-flex shrink-0 items-center">
						<img src={logo} alt="KSU Combat Robotics" class="logo-img" />
					</a>
					<button
						type="button"
						class="mobile-close-btn"
						aria-label="Close menu"
						onclick={() => (mobileNavOpen = false)}
					>
						<svg
							class="icon-md"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"><path d="M6 18L18 6M6 6l12 12" /></svg
						>
					</button>
				</div>

				<div class="mobile-list">
					{#each leftNav.concat(rightNav) as item, idx}
						{#if item.children}
							<div>
								<button
									class="mobile-item-toggle"
									onclick={() => (mobileOpenIndex = mobileOpenIndex === idx ? -1 : idx)}
									aria-expanded={mobileOpenIndex === idx}
								>
									<span class="font-medium">{item.name}</span>
									<svg
										class="icon-sm text-gray-400"
										viewBox="0 0 20 20"
										fill="none"
										stroke="currentColor"
										><path
											d="M6 8l4 4 4-4"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/></svg
									>
								</button>
								{#if mobileOpenIndex === idx}
									<div class="mt-1 space-y-1 pl-4">
										{#each item.children as child}
											<a href={child.path} class="mobile-item-link">{child.name}</a>
										{/each}
									</div>
								{/if}
							</div>
						{:else}
							<a href={item.path} class="mobile-item-link">{item.name}</a>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	{/if}
</header>

<QueryClientProvider client={queryClient}>
	<main class="page-main">
		{@render children?.()}
	</main>
</QueryClientProvider>
