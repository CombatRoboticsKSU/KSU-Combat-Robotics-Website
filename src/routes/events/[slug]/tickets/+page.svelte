<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Your spectator tickets | {data.event.name}</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="referrer" content="no-referrer" />
</svelte:head>

<main class="tickets-page">
	<a href="/events/{data.event.slug}">&larr; {data.event.name}</a>
	<h1>Your spectator tickets</h1>
	<p>{data.event.eventDate} · {data.event.location}</p>
	{#if data.status === 'pending'}
		<div class="notice" role="status"><h2>Waiting for payment confirmation</h2><p>Your tickets will appear once Stripe confirms payment. Refresh this page in a moment. Don’t pay again.</p><button class="print-button" onclick={() => window.location.reload()}>Refresh ticket status</button></div>
	{:else if data.status !== 'confirmed'}
		<div class="notice" role="alert"><h2>{data.status === 'refunded' ? 'Order refunded' : 'Refund needs review'}</h2><p>These tickets cannot be used for admission. Please contact event staff.</p></div>
	{:else}
		<p>Save this page’s link or print your tickets. Show one QR code per person at the entrance. Staff can also find your order using the email used at checkout.</p>
		<button class="print-button" onclick={() => window.print()}>Print tickets</button>
		<div class="ticket-grid">
			{#each data.tickets as ticket}
				<article class="ticket">
					<h2>Spectator ticket {ticket.ordinal}</h2><p>{data.event.name}</p>
					{#if ticket.checkedInAt}<p class="used">Already checked in</p>{:else}<p>Ready for admission</p>{/if}
					{#if ticket.qr}<img src={ticket.qr} alt="Admission QR code for spectator ticket {ticket.ordinal}" width="280" height="280" />{/if}
					<details><summary>Ticket code for manual check-in</summary><code>{ticket.code}</code></details>
				</article>
			{/each}
		</div>
	{/if}
</main>

<style>
	.tickets-page{max-width:960px;margin:3rem auto;padding:1.5rem;color:var(--text-primary,#eee)}
	h1{font-size:clamp(2rem,5vw,3rem);margin:1rem 0}p{line-height:1.6}a{color:var(--ksu-gold,#ffcc00)}
	.ticket-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-top:2rem}
	.ticket,.notice{padding:1.5rem;border:1px solid #777;border-radius:12px}.ticket{text-align:center;background:#fff;color:#17263b;break-inside:avoid}
	.ticket img{max-width:100%;height:auto}.ticket h2{margin:0}.ticket code{display:block;overflow-wrap:anywhere;font-size:.8rem;margin-top:1rem}.used{font-weight:bold;color:#9b341a}
	.print-button{padding:.7rem 1rem;border:0;border-radius:6px;background:#ffcc00;color:#17263b;font-weight:bold;cursor:pointer}
	@media print{.print-button,.tickets-page>a{display:none}.tickets-page{color:#000;margin:0}.ticket-grid{display:block}.ticket{margin-bottom:1rem}.ticket details{display:none}}
</style>
