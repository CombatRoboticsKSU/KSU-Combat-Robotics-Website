<script lang="ts">
	import BotWikiPage from '$lib/components/BotWikiPage.svelte';

	const bot = {
		name: 'RAM PLAN',
		image: '/pbots/Ram Plan/RamPlan.jpg',
		specs: {
			'Weight Class': '12lb',
			'Weapon': 'Rotary Lifter',
			'Body Material': 'AR500 Steel / 4130 Chromoly Steel',
			'Weapon Drive': '1x Brushed 550, 132:1 reduction',
			'Drive': '4x Brushless 2830 1200kv, 13.7:1 reduction',
			'Wheels': '3" Compliant BaneBots / TPU w/ Latex',
			'Power': '1000mAh 4S LiPo'
		},
		competitions: [
			{ name: 'NHRL July 2021 (Sportsman)', location: 'Norwalk, CT', date: 'Jul 24, 2021', fights: 3, wins: 3, losses: 0, kos: 3, kod: 0, outcome: '1st Place' },
			{ name: 'NHRL November 2021 (Sportsman)', location: 'Norwalk, CT', date: 'Nov 13, 2021', fights: 3, wins: 1, losses: 2, kos: 0, kod: 0, outcome: '3rd Place' },
			{ name: 'NHRL July 2022 (Full Combat)', location: 'Norwalk, CT', date: 'Jul 16, 2022', fights: 6, wins: 4, losses: 2, kos: 1, kod: 0, outcome: 'Elimination Final - 3rd' },
			{ name: 'NHRL December 2022 (Full Combat)', location: 'Norwalk, CT', date: 'Dec 17, 2022', fights: 8, wins: 6, losses: 2, kos: 1, kod: 2, outcome: 'Elimination Final - 3rd' }
		],
		galleryImages: [
			'/pbots/Ram Plan/planwHat.jpg'
		],
		team: [
			{ role: 'Builder / Driver', name: 'Brendan Steele' }
		]
	};
</script>

<svelte:head>
	<title>RAM PLAN | KSU Combat Robotics - Personal Bots</title>
</svelte:head>

<BotWikiPage {bot} backLink="/pbots" backLabel="Back to Personal Bots" />
