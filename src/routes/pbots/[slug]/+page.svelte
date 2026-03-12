<script lang="ts">
	import BotWikiPage from '$lib/components/BotWikiPage.svelte';

	let { data } = $props();

	const bot = $derived({
		name: data.bot.name,
		image: data.bot.image,
		description: data.bot.description,
		specs: (data.bot.specs ?? {}) as Record<string, string>,
		competitions: (data.bot.competitions ?? []) as any[],
		team: (data.bot.team ?? []) as any[],
		galleryImages: (data.bot.galleryImages ?? []) as string[],
		videos: (data.bot.videos ?? []) as { src: string; poster?: string }[],
		youtubeLinks: (data.bot.youtubeLinks ?? []) as { url: string; label?: string }[],
		mediaCoverage: (data.bot.mediaCoverage ?? []) as { text: string; link: string }[]
	});
</script>

<svelte:head>
	<title>{data.bot.name} | KSU Combat Robotics</title>
</svelte:head>

<BotWikiPage {bot} backLink={data.bot.backLink ?? '/pbots'} backLabel={data.bot.backLabel ?? 'Back to Personal Bots'} />
