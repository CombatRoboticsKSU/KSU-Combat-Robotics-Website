<script lang="ts">
	import '/src/app.css';
	const favicon = '/icons/favicon.ico';
	const logo = '/icons/logo.svg';
	import { onMount, tick } from 'svelte';

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
	// Controls whether the mobile panel is mounted in the DOM. We mount the
	// panel first (mobilePanelVisible = true) then set `mobileNavOpen = true`
	// to play the opening animation. On close we reverse that sequence so the
	// closing animation can play before unmounting.
	let mobilePanelVisible = $state(false);
	// mobile submenu open indices (Set to allow multiple open)
	let mobileOpenIndices = $state(new Set<number>());

	let { children } = $props();

	// Svelte Query setup
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	const queryClient = new QueryClient();

	// Theme (dark/light) state
	let theme = $state('system');

	// Mobile panel control helpers
	async function openMobile() {
		mobilePanelVisible = true;
		// wait for DOM to update so the element is mounted, then ensure the
		// next frame applies the open class. Using tick() avoids layout flashes
		// caused by setting both mount and open in the same frame.
		await tick();
		// Use requestAnimationFrame to ensure the browser has applied initial
		// styles before we toggle the `mobileNavOpen` flag that starts the
		// animation.
		requestAnimationFrame(() => (mobileNavOpen = true));
	}

	function closeMobile() {
		// trigger closing animation
		mobileNavOpen = false;
		// wait for the animation to finish before unmounting.
		// Use an animationend listener on the panel element for robust timing
		const el = document.getElementById('mobile-menu');
		if (!el) {
			// fallback: unmount after a delay
			setTimeout(() => (mobilePanelVisible = false), 300);
			return;
		}
		function onAnimEnd(e: Event) {
			// only react to the animation on the panel itself
			if (e.target !== el) return;
			if (el) el.removeEventListener('animationend', onAnimEnd);
			mobilePanelVisible = false;
		}
		el.addEventListener('animationend', onAnimEnd);
	}

	function toggleMobile() {
		if (!mobilePanelVisible) openMobile();
		else closeMobile();
	}

   function applyTheme(value: 'dark' | 'light' | 'system') {
      theme = value;

      const root = document.documentElement;
      const body = document.body;

      if (theme === 'dark') {
         root.classList.add('dark');
         root.classList.remove('light');
         body.classList.add('bg-main-black', 'text-text-white');
         body.classList.remove('bg-main-white', 'text-text-black');
      } else if (theme === 'light') {
         root.classList.add('light');
         root.classList.remove('dark');
         body.classList.add('bg-main-white', 'text-text-black');
         body.classList.remove('bg-main-black', 'text-text-white');
      } else {
         root.classList.remove('dark');
         root.classList.remove('light');

         if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('dark');
            body.classList.add('bg-main-black', 'text-text-white');
            body.classList.remove('bg-main-white', 'text-text-black');
         } else {
            root.classList.add('light');
            body.classList.add('bg-main-white', 'text-text-black');
            body.classList.remove('bg-main-black', 'text-text-white');
         }
      }

      try {
         localStorage.setItem('theme', theme);
      } catch (e) {
         console.error('Failed to save theme preference:', e);
      }
   }

   function toggleTheme() {
      if (theme === 'dark') {
         applyTheme('light');
      } else {
         applyTheme('dark');
      }
   }

   onMount(() => {
      try {
         const savedTheme = localStorage.getItem('theme');
         if (savedTheme === 'dark' || savedTheme === 'light') {
            applyTheme(savedTheme);
         } else {
            applyTheme('system');
         }
      } catch (e) {
         console.error('Failed to load theme preference:', e);
         applyTheme('system');
      }
   });

	let darkMode = $state(theme === 'dark');
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
			<div class="flex-1"></div>

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
						aria-pressed={theme === 'dark'}
						onclick={() => toggleTheme()}
						aria-label="Toggle dark mode"
					>
						<span class="sr-only">Toggle dark mode</span>
						{#if theme === 'dark'}
							<svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
								<g class="moon" fill="currentColor">
									<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
								</g>
							</svg>
						{:else}
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
							</svg>
						{/if}
					</button>
				</div>

				<!-- Mobile menu button -->
				<div class="mobile-toggle">
					<button
						type="button"
						class="mobile-toggle-btn"
						aria-controls="mobile-menu"
						aria-expanded={mobileNavOpen}
						onclick={() => toggleMobile()}
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
	{#if mobilePanelVisible}
			<div id="mobile-menu" class="mobile-menu-panel" class:mobile-open={mobileNavOpen} class:mobile-closing={!mobileNavOpen}>
				<div class="mobile-panel-inner">
					<div class="mobile-list">
					{#each leftNav.concat(rightNav) as item, idx}
						{#if item.children}
							<div>
								<button
									class="mobile-item-toggle {idx === leftNav.concat(rightNav).length - 1 ? 'mobile-item-no-border' : ''}"
									onclick={() => {
										const newSet = new Set(mobileOpenIndices);
										if (newSet.has(idx)) {
											newSet.delete(idx);
										} else {
											newSet.add(idx);
										}
										mobileOpenIndices = newSet;
									}}
									aria-expanded={mobileOpenIndices.has(idx)}
								>
									<span class="font-medium">{item.name}</span>
									<svg
										class="icon-md text-gray-400"
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
								{#if mobileOpenIndices.has(idx)}
									<div class="mt-1 space-y-1 pl-4">
										{#each item.children as child}
											<a href={child.path} class="mobile-item-link">{child.name}</a>
										{/each}
									</div>
								{/if}
							</div>
						{:else}
							<a href={item.path} class="mobile-item-link {idx === leftNav.concat(rightNav).length - 1 ? 'mobile-item-no-border' : ''}">{item.name}</a>
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

	<footer class="site-footer">
		<div class="footer-top">
			<div class="footer-container">
				<div class="footer-grid">
					<!-- About Section -->
					<div class="footer-section">
						<h3 class="footer-heading">About</h3>
						<ul class="footer-links">
							<li><a href="/blog" class="footer-link">Team Updates</a></li>
							<li><a href="/leadership" class="footer-link">Leadership</a></li>
							<li><a href="/history" class="footer-link">History</a></li>
							<li><a href="/projects" class="footer-link">Project Status</a></li>
							<li><a href="/bots/personal" class="footer-link">Personal Bots</a></li>
							<li><a href="/bots/club" class="footer-link">Club Owned Bots</a></li>
						</ul>
					</div>

					<!-- Connect & Sponsorship Section -->
					<div class="footer-section">
						<h3 class="footer-heading">Connect & Sponsorship</h3>
						<ul class="footer-links">
							<li><a href="/instagram" class="footer-link">Instagram</a></li>
							<li><a href="/contact" class="footer-link">Email</a></li>
							<li><a href="/sponsorship" class="footer-link">Sponsors</a></li>
						</ul>
					</div>

					<!-- Legal Section -->
					<div class="footer-section">
						<h3 class="footer-heading">Legal</h3>
						<ul class="footer-links">
							<li><a href="https://www.kent.edu/csi" target="_blank" rel="noopener noreferrer" class="footer-link">Kent State CSI</a></li>
							<li><a href="https://www.kent.edu/antihazing" target="_blank" rel="noopener noreferrer" class="footer-link">Anti-Hazing Policy</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<div class="footer-bottom">
			<div class="footer-container">
				<p class="footer-copyright">
					KSU Combat Robotics is a registered organization of Kent State University
				</p>
			</div>
		</div>
	</footer>
</QueryClientProvider>
