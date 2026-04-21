<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const bots = [
		{
			name: 'Flash-BANG',
			image: '/USINGimg/FlashBangIcon.png',
			href: '/wiki/flashbang',
			hit404: "Whatever you were looking for took a direct hit from Flash-BANG and doesn't exist anymore. Or maybe it never did.",
			hitOther: "Flash-BANG spun up too fast and something broke. Our bots are on it."
		},
		{
			name: 'Big-ISH',
			image: '/USINGimg/Bigish_new.JPG',
			href: '/wiki/bigish',
			hit404: "Big-ISH rolled right over whatever you were looking for. It's gone — and it's not coming back.",
			hitOther: "Big-ISH took out something it shouldn't have. An unexpected error occurred."
		}
	];

	let bot = $state(bots[0]);

	onMount(() => {
		bot = bots[Math.floor(Math.random() * bots.length)];
	});
</script>

<svelte:head>
	<title>{page.status} | KSU Combat Robotics</title>
</svelte:head>

<section class="error-page">
	<div class="bg-effects">
		<div class="orb orb-1"></div>
		<div class="orb orb-2"></div>
		<div class="grid-pattern"></div>
	</div>

	<div class="content">
		<div class="bot-wrapper">
			<img src={bot.image} alt={bot.name} class="bot-img {page.status !== 404 ? 'glitch' : ''}" />
			<div class="impact-ring"></div>
		</div>

		{#if page.status === 404}
			<div class="status-label">ERROR <span class="status-num">404</span></div>
			<h1>You Got <span class="hit">Hit.</span></h1>
			<p>{bot.hit404}</p>
		{:else}
			<div class="status-label">ERROR <span class="status-num">{page.status}</span></div>
			<h1>Something <span class="hit">Broke.</span></h1>
			<p>{bot.hitOther}</p>
		{/if}

		<div class="actions">
			<a href="/" class="btn-primary">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
				Back to Safety
			</a>
			<a href={bot.href} class="btn-secondary">Meet {bot.name}</a>
		</div>
	</div>
</section>

<style>
	.error-page {
		min-height: calc(100vh - 64px);
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 40%, #012d60 100%);
		position: relative;
		overflow: hidden;
		padding: 2rem;
		text-align: center;
	}

	.bg-effects {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.4;
	}

	.orb-1 {
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, rgba(235,171,33,0.15) 0%, transparent 70%);
		top: -15%;
		right: -10%;
		animation: drift 10s ease-in-out infinite;
	}

	.orb-2 {
		width: 350px;
		height: 350px;
		background: radial-gradient(circle, rgba(255,0,120,0.08) 0%, transparent 70%);
		bottom: -10%;
		left: -5%;
		animation: drift 14s ease-in-out 2s infinite reverse;
	}

	@keyframes drift {
		0%, 100% { transform: translate(0, 0); }
		50% { transform: translate(20px, -20px); }
	}

	.grid-pattern {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
		-webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
	}

	.content {
		position: relative;
		max-width: 560px;
		animation: fadeInUp 0.5s ease both;
	}

	/* Bot image */
	.bot-wrapper {
		position: relative;
		display: inline-block;
		margin-bottom: 1.5rem;
	}

	.bot-img {
		width: clamp(180px, 35vw, 280px);
		filter: drop-shadow(0 0 40px rgba(235,171,33,0.35));
		animation: hover 4s ease-in-out infinite;
	}

	@keyframes hover {
		0%, 100% { transform: translateY(0) rotate(-1deg); }
		50% { transform: translateY(-12px) rotate(1deg); }
	}

	.impact-ring {
		position: absolute;
		inset: -12px;
		border-radius: 50%;
		border: 2px solid rgba(235,171,33,0.2);
		animation: pulse-ring 2.5s ease-out infinite;
	}

	@keyframes pulse-ring {
		0% { transform: scale(0.85); opacity: 0.6; }
		100% { transform: scale(1.15); opacity: 0; }
	}

	/* Glitch effect for non-404 errors */
	.glitch {
		animation: hover 4s ease-in-out infinite, glitch 3s steps(1) infinite;
	}

	@keyframes glitch {
		0%, 90%, 100% { filter: drop-shadow(0 0 40px rgba(235,171,33,0.35)); }
		92% { filter: drop-shadow(-4px 0 0 rgba(255,0,120,0.8)) drop-shadow(4px 0 0 rgba(0,255,255,0.8)); }
		94% { filter: drop-shadow(0 0 40px rgba(235,171,33,0.35)); }
		96% { filter: drop-shadow(-3px 0 0 rgba(0,255,255,0.8)) drop-shadow(3px 0 0 rgba(255,0,120,0.8)); }
	}

	/* Status label */
	.status-label {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 0.5rem;
	}

	.status-num {
		color: var(--gold);
	}

	h1 {
		font-size: clamp(2rem, 6vw, 3.25rem);
		font-weight: 900;
		color: var(--text-primary);
		margin-bottom: 1rem;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.hit {
		color: var(--gold);
	}

	p {
		color: var(--text-secondary);
		font-size: 1.0625rem;
		line-height: 1.6;
		margin-bottom: 2.5rem;
		max-width: 420px;
		margin-left: auto;
		margin-right: auto;
	}

	.actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--gold);
		color: #000;
		font-weight: 600;
		font-size: 0.9375rem;
		border-radius: 0.625rem;
		text-decoration: none;
		transition: background 0.2s, transform 0.2s;
	}

	.btn-primary:hover {
		background: var(--gold-dark);
		transform: translateY(-2px);
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		background: rgba(255,255,255,0.06);
		color: var(--text-primary);
		font-weight: 500;
		font-size: 0.9375rem;
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 0.625rem;
		text-decoration: none;
		transition: background 0.2s, transform 0.2s;
	}

	.btn-secondary:hover {
		background: rgba(255,255,255,0.1);
		transform: translateY(-2px);
	}
</style>
