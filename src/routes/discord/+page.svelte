<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		if (browser) {
			window.location.href = 'https://www.discord.gg/qxqDEgcKns';
		}
	});
</script>

<svelte:head>
	<title>Discord | KSU Combat Robotics</title>
</svelte:head>

<section class="redirect">
	<p>Redirecting to Discord...</p>
</section>

<style>
	.redirect {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
		color: var(--text-secondary);
	}
</style>
