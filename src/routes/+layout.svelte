<script lang="ts">
	import "/src/app.css";
	import favicon from '/icons/favicon.ico';
	import logo from '/icons/logo.svg';
	import { onMount } from 'svelte';

	const navItems = [
		{ name: 'Sponsors', path: '/sponsors' },
		{ name: 'Contact Us', path: '/contact' },
		{ name: 'Bot Wiki', path: '/wiki' },
		{
			name: 'Projects',
			children: [
				{ name: 'Current', path: '/projects/current' },
				{ name: 'Archive', path: '/projects/archive' },
				{ name: 'Submit a Project', path: '/projects/submit' }
			]
		},
		{
			name: 'Updates',
			children: [
				{ name: 'News', path: '/updates/news' },
				{ name: 'Events', path: '/updates/events' }
			]
		},
		{ name: 'Leadership', path: '/leadership' },
		{ name: 'Calendar', path: '/calendar' }
	];

	// Mobile nav open/close state
	let mobileNavOpen = $state(false);
	// mobile submenu open index (-1 = none)
	let mobileOpenIndex = $state(-1);

	let { children } = $props();

	// Svelte Query setup
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	const queryClient = new QueryClient();

	// onMount(() => { });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="bg-gray-900 text-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center">
				<a href="/" class="flex-shrink-0">
					<img src={logo} alt="KSU Combat Robotics" class="h-10 w-auto logo-img" />
				</a>

				<!-- Desktop nav (visible on lg+) -->
				<nav class="site-nav hidden lg:ml-8 lg:flex lg:items-center lg:space-x-6" aria-label="Primary">
					{#each navItems as item}
						{#if item.children}
							<div class="relative group">
								<button class="inline-flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" aria-haspopup="true">
									<span>{item.name}</span>
									<svg class="h-4 w-4 text-gray-300 group-hover:text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M6 8l4 4 4-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
								</button>
								<!-- Stacked flyout -->
								<div class="absolute left-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 transform transition-all origin-top">
									<div class="py-2">
										{#each item.children as child}
											<a href={child.path} class="block px-4 py-2 text-sm hover:bg-gray-100">{child.name}</a>
										{/each}
									</div>
								</div>
							</div>
						{:else}
							<a href={item.path} class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">{item.name}</a>
						{/if}
					{/each}
				</nav>

			 <!-- Mobile menu button (visible below lg) -->
			 <!-- added .mobile-toggle so we can provide a CSS fallback when Tailwind classes
				 aren't available (ensures correct show/hide behavior across viewports) -->
			 <div class="-mr-2 flex lg:hidden mobile-toggle">
					<button
						type="button"
						class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
						aria-controls="mobile-menu"
						aria-expanded={mobileNavOpen}
						onclick={() => (mobileNavOpen = !mobileNavOpen)}
					>
						<span class="sr-only">Open main menu</span>
						{#if !mobileNavOpen}
							<!-- Menu icon -->
							<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						{:else}
							<!-- Close icon -->
							<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M6 18L18 6M6 6l12 12" />
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	{#if mobileNavOpen}
		<div id="mobile-menu" class="lg:hidden bg-gray-800">
			<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				{#each navItems as item, idx}
					{#if item.children}
						<div class="">
							<button class="w-full flex items-center justify-between px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 rounded-md" onclick={() => (mobileOpenIndex = mobileOpenIndex === idx ? -1 : idx)} aria-expanded={mobileOpenIndex === idx}>
								<span class="font-medium">{item.name}</span>
								<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M6 8l4 4 4-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
							</button>
							{#if mobileOpenIndex === idx}
								<div class="pl-4 mt-1 space-y-1">
									{#each item.children as child}
										<a href={child.path} class="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700">{child.name}</a>
									{/each}
								</div>
							{/if}
						</div>
					{:else}
						<a href={item.path} class="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700">{item.name}</a>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</header>

<QueryClientProvider client={queryClient}>
   <main style="flex: 1; padding: 2rem 1rem; position: relative; z-index: 2;">
	   {@render children?.()}
   </main>
</QueryClientProvider>
