<script lang="ts">
	import BotWikiPage from '$lib/components/BotWikiPage.svelte';

	const bot = {
		name: 'Katana',
		image: '/pbots/Katana/Katana.png',
		specs: {
			'Weight Class': '3lb',
			'Weapon': 'Vertical Spinner',
			'Ranking': '#117 in 3lb class'
		},
		competitions: [
			{ name: 'NHRL January 2024', location: 'Norwalk, CT', date: 'Jan 20, 2024', fights: 5, wins: 3, losses: 2, kos: 3, kod: 1, outcome: 'Qualifiers Rd. 3' },
			{ name: 'NHRL April 2024', location: 'Norwalk, CT', date: 'Apr 20, 2024', fights: 4, wins: 2, losses: 2, kos: 2, kod: 1, outcome: 'Opening Round' },
			{ name: 'NHRL February 2025', location: 'Norwalk, CT', date: 'Feb 1, 2025', fights: 4, wins: 2, losses: 2, kos: 2, kod: 1, outcome: 'Opening Round' },
			{ name: 'NHRL April 2025', location: 'Norwalk, CT', date: 'Apr 3, 2025', fights: 4, wins: 2, losses: 2, kos: 2, kod: 1, outcome: 'Opening Round' }
		],
		team: [
			{ role: 'Builder / Driver', name: 'David Dreyer' }
		]
	};
</script>

<svelte:head>
	<title>Katana | KSU Combat Robotics - Personal Bots</title>
</svelte:head>

<BotWikiPage {bot} backLink="/pbots" backLabel="Back to Personal Bots" />
