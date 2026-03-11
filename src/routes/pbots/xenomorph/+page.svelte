<script lang="ts">
	import BotWikiPage from '$lib/components/BotWikiPage.svelte';

	const bot = {
		name: 'Xenomorph',
		image: '/pbots/Xenomorph/Xenomorph.jpg',
		specs: {
			'Weight Class': '12lb',
			'Weapon': 'Vertical Spinner',
			'Ranking': '#5 in 12lb class'
		},
		competitions: [
			{ name: 'NHRL October 2025', location: 'Norwalk, CT', date: 'Oct 2025', fights: 4, wins: 3, losses: 1, kos: 2, kod: 1, outcome: 'Quarterfinals' },
			{ name: 'NHRL November 2025', location: 'Norwalk, CT', date: 'Nov 2025', fights: 5, wins: 4, losses: 1, kos: 2, kod: 1, outcome: 'Semifinals' },
			{ name: 'NHRL December 2025', location: 'Norwalk, CT', date: 'Dec 2025', fights: 3, wins: 2, losses: 1, kos: 1, kod: 1, outcome: 'Round of 16' },
			{ name: 'NHRL February 2026', location: 'Norwalk, CT', date: 'Feb 2026', fights: 4, wins: 2, losses: 2, kos: 1, kod: 2, outcome: 'Prelims Rd. 3' }
		],
		team: [
			{ role: 'Builder / Driver', name: 'David Dreyer' }
		]
	};
</script>

<svelte:head>
	<title>Xenomorph | KSU Combat Robotics - Personal Bots</title>
</svelte:head>

<BotWikiPage {bot} backLink="/pbots" backLabel="Back to Personal Bots" />
