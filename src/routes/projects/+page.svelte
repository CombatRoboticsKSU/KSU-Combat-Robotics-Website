<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		if (browser) {
			window.location.href = 'https://sharing.clickup.com/9011781189/b/h/4-90112834328-2/597252a6b651153';
		}
	});
</script>

<svelte:head>
	<title>Projects | KSU Combat Robotics</title>
</svelte:head>

<section class="redirect">
	<p>Redirecting to project board...</p>
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
