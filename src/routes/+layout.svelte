<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>KSU Combat Robotics</title>
	<meta name="description" content="KSU Combat Robotics is a student organization at Kent State University that designs, builds, and competes in combat robotics events." />
</svelte:head>

<div class="app">
	<Navbar />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>

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
