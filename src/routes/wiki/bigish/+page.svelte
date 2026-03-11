<script lang="ts">
	import BotWikiPage from '$lib/components/BotWikiPage.svelte';

	const bot = {
		name: 'Big-ISH',
		image: '/USINGimg/Bigish_new.JPG',
		specs: {
			'Weight Class': '12 lbs',
			'Body Material': 'Welded 6061 Aluminum',
			'Weapon': '3lb vertical spinning blade, 1/2" AR500 steel',
			'Weapon Drive': 'Propdrive 4248 650kv, 2:1 reduction',
			'Drive': 'RS-550 motor, 64:1 BaneBots direct drive',
			'Wheels': '12" tall, 1/4" Tegris',
			'Power': '3s LiPo (drive), 5s LiPo (weapon)'
		},
		competitions: [
			{ name: 'NHRL March 2022', location: 'Norwalk, CT', date: 'Mar 26, 2022', fights: 5, wins: 3, losses: 2, kos: 3, kod: 1, outcome: 'Elimination 2A' },
			{ name: 'NHRL November 2022', location: 'Norwalk, CT', date: 'Nov 12, 2022', fights: 6, wins: 4, losses: 2, kos: 2, kod: 1, outcome: '3rd Place' },
			{ name: 'NHRL December 2022', location: 'Norwalk, CT', date: 'Dec 17, 2022', fights: 2, wins: 0, losses: 2, kos: 0, kod: 1, outcome: 'Elimination 1' },
			{ name: 'XtremeBots 2024', location: 'Dayton, Ohio', date: 'Mar 22, 2024', fights: 3, wins: 1, losses: 2, kos: 1, kod: 1 },
			{ name: 'NHRL April 2025', location: 'Norwalk, CT', date: 'Apr 3, 2025', fights: 3, wins: 1, losses: 2, kos: 1, kod: 2, outcome: 'Prelim Round 3' }
		],
		galleryImages: [
			'/wiki/img/big/2025_1.jpg',
			'/wiki/img/big/2025_2.jpg',
			'/wiki/img/bigish_old.jpg',
			'/wiki/img/B_action.jpg',
			'/wiki/img/b_action2.jpg',
			'/wiki/img/b_oldw.jpg',
			'/wiki/img/johnathons.JPG',
			'/wiki/img/team_old.jpg'
		],
		videoSrc: '/wiki/img/big/rumble.mp4',
		youtubeEmbed: 'https://www.youtube.com/embed/NR8GN3DTjRM?si=LLEA8lUsGi5CwimO',
		team: [
			{ role: 'Designer', name: 'Matt Schutzman', history: ['Matt Schutzman (2024 redesign)', 'Brendan Steele (original)'] },
			{ role: 'Builder', name: 'KSU JV Team' },
			{ role: 'Bot Champion', name: 'Wyatt Burke', history: ['Wyatt Burke (2025-Current)', 'Matt Schutzman (2024-2025)', 'Austin Sternberg (2023-2024)', 'Austin Thebner (2022-2023)', 'Brendan Steele (2020-2022)'] },
			{ role: 'Driver', name: 'Ian R.', history: ['Ian R (2023-Current)', 'Austin T (2022-2023)', 'Brendan Steele (2020-2022)'] }
		]
	};
</script>

<svelte:head>
	<title>Big-ISH | KSU Combat Robotics Wiki</title>
</svelte:head>

<BotWikiPage {bot} />
