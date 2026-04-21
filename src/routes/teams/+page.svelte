<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		if (browser) {
			window.location.href = 'https://teams.microsoft.com/l/team/19%3AAuUT5tyjbeWyBIqBtbaxXsHSR3LuFIDW_VicpuGOWOo1%40thread.tacv2/conversations?groupId=cd19e8af-e1e0-4385-9c5a-1f68a121e687&tenantId=e5a06f4a-1ec4-4d01-8f73-e7dd15f26134';
		}
	});
</script>

<svelte:head>
	<title>Teams | KSU Combat Robotics</title>
</svelte:head>

<section class="redirect">
	<p>Redirecting to Teams...</p>
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
