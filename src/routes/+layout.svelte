<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children, data } = $props();

	let isAdmin = $derived($page.url.pathname.startsWith('/admin') && $page.url.pathname !== '/admin/login');
</script>

<svelte:head>
	<title>KSU Combat Robotics</title>
	<meta name="description" content="KSU Combat Robotics is a student organization at Kent State University that designs, builds, and competes in combat robotics events." />
</svelte:head>

{#if isAdmin}
	{@render children()}
{:else}
	<div class="app">
		<Navbar socialLinks={data.socialLinks} />
		<main>
			{@render children()}
		</main>
		<Footer socialLinks={data.socialLinks} />
	</div>
{/if}

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
	}
</style>
