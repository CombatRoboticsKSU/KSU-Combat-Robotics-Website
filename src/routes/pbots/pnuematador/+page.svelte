<script lang="ts">
	import BotWikiPage from '$lib/components/BotWikiPage.svelte';

	const bot = {
		name: 'PNUEMATADOR',
		image: '/pbots/PNUEMATADOR/PNUEMATADOR.png',
		specs: {
			'Weight Class': '12lb',
			'Weapon': 'Pneumatic Flipper',
			'Ranking': '#123 in 12lb class'
		},
		competitions: [
			{ name: 'NHRL January 2024', location: 'Norwalk, CT', date: 'Jan 20, 2024', fights: 4, wins: 2, losses: 2, kos: 0, kod: 1, outcome: 'Qualifiers' },
			{ name: 'NHRL June 2024', location: 'Norwalk, CT', date: 'Jun 22, 2024', fights: 3, wins: 1, losses: 2, kos: 0, kod: 0, outcome: 'Qualifiers' }
		],
		team: [
			{ role: 'Builder / Driver', name: 'Austin Thebner' }
		]
	};
</script>

<svelte:head>
	<title>PNUEMATADOR | KSU Combat Robotics - Personal Bots</title>
</svelte:head>

<BotWikiPage {bot} backLink="/pbots" backLabel="Back to Personal Bots" />
