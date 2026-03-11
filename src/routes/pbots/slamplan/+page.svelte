<script lang="ts">
	import BotWikiPage from '$lib/components/BotWikiPage.svelte';

	const bot = {
		name: 'SLAM PLAN',
		image: '/pbots/Slam Plan/SlamPlan.png',
		specs: {
			'Weight Class': '12lb',
			'Weapon': 'Vertical Spinner',
			'Drive': '2WD',
			'Description': 'Similar to HUGE with optional cambered wheels',
			'Ranking': '#6 in 12lb class'
		},
		competitions: [
			{ name: 'NHRL October 2024', location: 'Norwalk, CT', date: 'Oct 26, 2024', fights: 6, wins: 6, losses: 0, kos: 6, kod: 0, outcome: '1st Place' },
			{ name: 'NHRL December 2024', location: 'Norwalk, CT', date: 'Dec 7, 2024', fights: 7, wins: 6, losses: 1, kos: 3, kod: 0, outcome: '1st Place' },
			{ name: 'NHRL October 2025', location: 'Norwalk, CT', date: 'Oct 4, 2025', fights: 6, wins: 5, losses: 1, kos: 4, kod: 1, outcome: '2nd Place' },
			{ name: 'NHRL December 2025', location: 'Norwalk, CT', date: 'Dec 6, 2025', fights: 6, wins: 4, losses: 2, kos: 3, kod: 0, outcome: '2nd Place' }
		],
		team: [
			{ role: 'Builder / Driver', name: 'Brendan Steele' }
		]
	};
</script>

<svelte:head>
	<title>SLAM PLAN | KSU Combat Robotics - Personal Bots</title>
</svelte:head>

<BotWikiPage {bot} backLink="/pbots" backLabel="Back to Personal Bots" />
