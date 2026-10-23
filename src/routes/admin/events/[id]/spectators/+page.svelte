<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
	let search = $state('');
	let status = $state('all');
	let busy = $state(false);
	const scanned = $derived(data.rows.find(r => r.ticket.token === data.scanned));
	const filtered = $derived(data.rows.filter(r => {
		const q = search.trim().toLowerCase();
		return (!q || [r.order.buyerName, r.order.email, r.ticket.token, r.order.stripeSessionId].some(v => v.toLowerCase().includes(q))) &&
			(status === 'all' || (status === 'ready' ? r.order.status === 'confirmed' && !r.ticket.checkedInAt : status === 'used' ? !!r.ticket.checkedInAt : r.order.status !== 'confirmed'));
	}));
	const orders = $derived(new Set(data.rows.map(r => r.order.id)).size);
	const checkedIn = $derived(data.rows.filter(r => r.ticket.checkedInAt).length);
	function formatDate(value: Date | string) { return new Date(value).toLocaleString(); }
	function formatMoney(amount: number, currency: string) { return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100); }
</script>

<svelte:head><title>{data.event.name} Spectators | Admin</title><meta name="referrer" content="no-referrer" /></svelte:head>

<div class="admin-page">
	<div class="page-header"><div><h1>{data.event.name} · Spectators</h1><a class="item-sub" href="/admin/events">&larr; Back to events</a></div><a class="btn-admin ghost" href="/admin/events/{data.event.id}/sponsor-codes">Sponsor codes</a></div>
	<div class="form-card"><strong>{orders} orders · {data.rows.length} tickets · {checkedIn} checked in</strong><p class="help-text">Scan a QR code with your phone’s camera while signed in as an admin, or look up the buyer below. Scanning opens a ticket for review; press Check in to admit one person.</p></div>
	{#if form?.error}<p class="alert-error" role="alert">{form.error}</p>{/if}
	{#if form?.success}<p class="alert-success" role="status">{form.success}</p>{/if}
	{#if data.invalidScan}<p class="alert-error" role="alert">Invalid ticket. This code does not belong to this event. Do not admit.</p>{/if}
	{#if scanned}
		<section class="form-card scanned"><h2>Scanned ticket · #{scanned.ticket.ordinal}</h2><p>{scanned.order.buyerName || 'Spectator'} · {scanned.order.email}</p>
			{#if scanned.order.status !== 'confirmed'}<p class="alert-error">{scanned.order.status === 'refunded' ? 'Refunded' : 'Refund needs review'} — do not admit.</p>
			{:else if scanned.ticket.checkedInAt}<p class="alert-error">Already checked in at {formatDate(scanned.ticket.checkedInAt)}. Do not admit again.</p>
			{:else}<p>Valid ticket · ready for admission</p><form method="POST" action="?/checkIn" use:enhance={() => { busy = true; return async ({ update }) => { try { await update(); } finally { busy = false; } }; }}><input type="hidden" name="ticket" value={scanned.ticket.token} /><button class="btn-admin primary" disabled={busy}>{busy ? 'Checking in…' : 'Check in · admit one'}</button></form>{/if}
		</section>
	{/if}
	<div class="form-card">
		<div class="filters"><div class="field-group"><label class="field-label" for="search">Find a buyer or ticket</label><input class="field-input" id="search" bind:value={search} placeholder="Name, email, ticket code, or session ID" /></div><div class="field-group"><label class="field-label" for="status">Admission status</label><select class="field-input" id="status" bind:value={status}><option value="all">All tickets</option><option value="ready">Ready for admission</option><option value="used">Checked in</option><option value="blocked">Refunded / review</option></select></div></div>
		<form method="GET" class="manual"><label class="field-label" for="ticket">Open a scanned URL or ticket code</label><input class="field-input" id="ticket" name="ticket" required /><button class="btn-admin ghost">Find ticket</button></form>
	</div>
	<div class="table-wrap"><table class="data-table"><thead><tr><th>Buyer</th><th>Order</th><th>Ticket</th><th>Status</th><th>Admission</th></tr></thead><tbody>
		{#each filtered as row}
			<tr><td><strong>{row.order.buyerName || 'Spectator'}</strong><div class="item-sub">{row.order.email}</div></td><td>{row.order.quantity} ticket{row.order.quantity === 1 ? '' : 's'} · {formatMoney(row.order.amountTotal, row.order.currency)} total<div class="item-sub"><a href="/events/{data.event.slug}/tickets?session_id={row.order.stripeSessionId}" target="_blank" rel="noreferrer">Open buyer tickets</a></div></td><td>#{row.ticket.ordinal}<div class="item-sub">{row.ticket.token.slice(0, 10)}…</div></td><td>{row.order.status === 'confirmed' ? row.order.amountTotal === 0 ? 'Sponsor / complimentary' : 'Paid' : row.order.status === 'refunded' ? 'Refunded' : 'Refund needs review'}</td><td>
				{#if row.order.status !== 'confirmed'}<strong>Do not admit</strong>{:else if row.ticket.checkedInAt}<span>Checked in</span><div class="item-sub">{formatDate(row.ticket.checkedInAt)}</div>{:else}<form method="POST" action="?/checkIn" use:enhance={() => { busy = true; return async ({ update }) => { try { await update(); } finally { busy = false; } }; }}><input type="hidden" name="ticket" value={row.ticket.token} /><button class="btn-admin primary" disabled={busy}>Check in</button></form>{/if}
			</td></tr>
		{:else}<tr><td colspan="5">{data.rows.length ? 'No matching tickets.' : 'No spectator purchases yet. Orders appear here after Stripe confirms checkout.'}</td></tr>{/each}
	</tbody></table></div>
	<details class="form-card setup"><summary>Ticket setup and order recovery</summary><p>Connect this event’s Stripe Payment Link so buyers see their QR tickets after checkout. This updates the link’s post-payment redirect to this site.</p><form method="POST" action="?/connectLink" use:enhance><button class="btn-admin ghost">Connect ticket confirmation page</button></form><p>For a purchase made before this feature was connected, copy its Checkout Session ID from Stripe to import it. Re-importing preserves existing tickets and check-ins.</p><form method="POST" action="?/importOrder" use:enhance><label class="field-label" for="sessionId">Stripe Checkout Session ID</label><input class="field-input" id="sessionId" name="sessionId" placeholder="cs_…" required /><button class="btn-admin ghost">Sync order from Stripe</button></form><p class="help-text">Partial refunds hold the entire order for review. Arrange the remaining admissions with staff before allowing entry.</p></details>
</div>

<style>
	.filters{display:grid;grid-template-columns:2fr 1fr;gap:1rem}.manual{display:grid;gap:.6rem;margin-top:1rem}.table-wrap{overflow-x:auto}.scanned{border:2px solid #d5b541}.setup{margin-top:1.5rem}.setup summary{cursor:pointer;font-weight:bold}.setup form{display:grid;gap:.6rem;justify-items:start}.setup p{line-height:1.6}.data-table td{vertical-align:top;min-width:130px}.help-text{line-height:1.6}@media(max-width:650px){.filters{grid-template-columns:1fr}}
</style>
