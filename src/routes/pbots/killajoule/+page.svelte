<script lang="ts">
	import BotWikiPage from '$lib/components/BotWikiPage.svelte';

	const bot = {
		name: 'KillaJoule',
		image: '/pbots/Killajoule/KillaJoule.jpg',
		specs: {
			'Weight Class': '12lb',
			'Weapon': 'Horizontal Undercutter Tribar',
			'Body Material': 'Welded 6061 Aluminum, AR500 Steel & UHMW Armor',
			'Weapon Drive': '4248 PropDrive',
			'Drive': 'ServoCity Gearmotor',
			'Power': '4S & 5S LiPo',
			'Ranking': '#56 in 12lb class'
		},
		competitions: [
			{ name: 'NHRL May 2022', location: 'Norwalk, CT', date: 'May 14, 2022', fights: 2, wins: 0, losses: 2, kos: 0, kod: 0, outcome: 'Elimination Round 2' },
			{ name: 'NHRL July 2022', location: 'Norwalk, CT', date: 'Jul 16, 2022', fights: 2, wins: 0, losses: 2, kos: 0, kod: 0, outcome: 'Elimination Round 1' },
			{ name: 'NHRL September 2022', location: 'Norwalk, CT', date: 'Sep 17, 2022', fights: 5, wins: 3, losses: 2, kos: 3, kod: 0, outcome: 'Elimination Round 4 - 5th' },
			{ name: 'NHRL November 2022', location: 'Norwalk, CT', date: 'Nov 12, 2022', fights: 4, wins: 2, losses: 2, kos: 2, kod: 1, outcome: 'Elimination 4 - 4th' },
			{ name: 'NHRL March 2023', location: 'Norwalk, CT', date: 'Mar 18, 2023', fights: 4, wins: 3, losses: 1, kos: 3, kod: 0, outcome: 'Quarterfinals' },
			{ name: 'NHRL June 2023', location: 'Norwalk, CT', date: 'Jun 24, 2023', fights: 3, wins: 1, losses: 2, kos: 1, kod: 1, outcome: 'Round 1' },
			{ name: 'NHRL April 2024', location: 'Norwalk, CT', date: 'Apr 20, 2024', fights: 3, wins: 1, losses: 2, kos: 1, kod: 1, outcome: 'Qualifiers Rd. 3 - 3rd' },
			{ name: 'NHRL June 2024', location: 'Norwalk, CT', date: 'Jun 22, 2024', fights: 3, wins: 1, losses: 2, kos: 0, kod: 1, outcome: 'Qualifiers Rd. 3 - 3rd' },
			{ name: 'NHRL September 2024', location: 'Norwalk, CT', date: 'Sep 14, 2024', fights: 3, wins: 1, losses: 2, kos: 1, kod: 2, outcome: 'Qualifiers Rd. 3 - 3rd' },
			{ name: 'NHRL May 2025', location: 'Norwalk, CT', date: 'May 3, 2025', fights: 3, wins: 1, losses: 2, kos: 0, kod: 0, outcome: 'Prelim Rd. 3 - 3rd' }
		],
		team: [
			{ role: 'Builder / Driver', name: 'David Dreyer' }
		]
	};
</script>

<svelte:head>
	<title>KillaJoule | KSU Combat Robotics - Personal Bots</title>
</svelte:head>

<BotWikiPage {bot} backLink="/pbots" backLabel="Back to Personal Bots" />
