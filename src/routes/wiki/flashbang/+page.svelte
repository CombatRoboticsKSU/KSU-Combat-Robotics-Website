<script lang="ts">
	import BotWikiPage from '$lib/components/BotWikiPage.svelte';

	const bot = {
		name: 'Flash-BANG',
		image: '/USINGimg/FlashBang25.png',
		specs: {
			'Weight Class': '12lb',
			'Body Material': 'Welded 6061 Aluminum, TPU Armor',
			'Weapon': '3 Tooth Welded Stack Drum',
			'Weapon Drive': 'BA 2826',
			'Drive': 'Brushless Longbox',
			'Power': '6S Lipo'
		},
		competitions: [
			{ name: 'NHRL March 2023', location: 'Norwalk, CT', date: 'Mar 18, 2023', fights: 3, wins: 2, losses: 1, kos: 2, kod: 0, outcome: 'Rival' },
			{ name: 'NHRL June 2023', location: 'Norwalk, CT', date: 'Jun 24, 2023', fights: 3, wins: 1, losses: 2, kos: 1, kod: 1, outcome: 'Round 1' },
			{ name: 'XtremeBots 2024', location: 'Dayton, Ohio', date: 'Mar 22, 2024', fights: 3, wins: 0, losses: 3, kos: 0, kod: 3 },
			{ name: 'NHRL April 2025', location: 'Norwalk, CT', date: 'Apr 3, 2025', fights: 5, wins: 3, losses: 2, kos: 1, kod: 2, outcome: 'Prelim Round 3' }
		],
		galleryImages: [
			'/wiki/img/frame.jpg',
			'/wiki/img/work_in_p.jpg',
			'/wiki/img/rayb.jpg',
			'/wiki/img/hi2.jpg',
			'/USINGimg/FlashBangIcon.png',
			'/USINGimg/FlashBang.jpg'
		],
		videoSrc: '/img/Flashbang_Hero_Shot.mp4',
		videoPoster: '/USINGimg/FlashBang25.png',
		youtubeEmbed: 'https://www.youtube.com/embed/SXWNAOSV5uQ?si=6WTQPxattuutYVdX',
		mediaCoverageText: 'Our local newspaper has covered our bot a few years ago.',
		mediaCoverageLink: 'https://kentwired.com/95378/latest-updates/combat-robotics-team-continues-to-find-success/',
		team: [
			{ role: 'Designer', name: 'Austin Thebner & Gregory Wenner' },
			{ role: 'Builder', name: 'KSU Combat Varsity Team' },
			{ role: 'Bot Champion', name: 'Mike U.', history: ['Mike U. (2024-Current)', 'Austin T (2022-2024)'] },
			{ role: 'Driver', name: 'Austin T.', history: ['Austin T (2022-Current)'] }
		]
	};
</script>

<svelte:head>
	<title>Flash-BANG | KSU Combat Robotics Wiki</title>
</svelte:head>

<BotWikiPage {bot} />
