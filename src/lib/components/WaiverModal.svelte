<script lang="ts">
	import { tick } from 'svelte';
	import { X, Download } from 'lucide-svelte';

	let {
		pdfUrl = '',
		text = '',
		onagree
	}: { pdfUrl?: string; text?: string; onagree: () => void } = $props();

	type PageInfo = { n: number; width: number; height: number; srText: string };

	let dialogEl: HTMLDialogElement;
	let scrollEl = $state<HTMLDivElement | null>(null);
	let canvasEls = $state<HTMLCanvasElement[]>([]);

	let pages = $state<PageInfo[]>([]);
	let loading = $state(false);
	let loadError = $state('');
	let reachedEnd = $state(false);
	let currentPage = $state(1);
	let hasRendered = false;

	// The agree button unlocks only once the reader has reached the bottom of the document.
	// A short document that fits without scrolling is already at the bottom, so this has to
	// be checked after render too, not only on scroll.
	function checkEnd() {
		if (!scrollEl) return;
		if (scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 8) {
			reachedEnd = true;
		}
	}

	function onScroll() {
		checkEnd();
		if (pages.length === 0 || !scrollEl) return;
		const midpoint = scrollEl.scrollTop + scrollEl.clientHeight / 2;
		let n = 1;
		for (let i = 0; i < canvasEls.length; i++) {
			const el = canvasEls[i];
			if (el && el.offsetTop <= midpoint) n = i + 1;
		}
		currentPage = n;
	}

	async function renderPdf() {
		loading = true;
		loadError = '';
		try {
			const pdfjs = await import('pdfjs-dist');
			// Vite resolves ?url to the emitted worker asset, so it is served same-origin
			// and needs no CDN.
			pdfjs.GlobalWorkerOptions.workerSrc = (
				await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
			).default;

			const doc = await pdfjs.getDocument({
				url: pdfUrl,
				// Base-14 fonts (Helvetica, Times, Courier) are not embedded in a PDF by
				// convention, so without this data their text renders as nothing. Copied into
				// static/ by scripts/copy-pdfjs-assets.js.
				standardFontDataUrl: '/pdfjs/standard_fonts/'
			}).promise;

			// Render width is measured once, when the modal opens. A later resize rescales the
			// canvases via CSS rather than re-rendering: slightly softer after a rotate, but far
			// cheaper than re-rasterising every page.
			const targetWidth = Math.max(320, (scrollEl?.clientWidth ?? 800) - 32);
			const dpr = Math.min(window.devicePixelRatio || 1, 2);

			const infos: PageInfo[] = [];
			const scales: number[] = [];
			for (let n = 1; n <= doc.numPages; n++) {
				const page = await doc.getPage(n);
				const base = page.getViewport({ scale: 1 });
				const scale = targetWidth / base.width;
				const vp = page.getViewport({ scale });
				// A canvas is invisible to a screen reader. Pulling the text layer into a
				// visually hidden block gives assistive tech the wording in reading order.
				// A scanned PDF yields nothing here, which is why waiverText still matters.
				const content = await page.getTextContent();
				const srText = content.items
					.map((i: unknown) => (i as { str?: string }).str ?? '')
					.join(' ')
					.trim();
				infos.push({ n, width: vp.width, height: vp.height, srText });
				scales.push(scale);
			}
			pages = infos;

			// The canvases only exist after Svelte has flushed the {#each} below.
			await tick();

			for (let i = 0; i < infos.length; i++) {
				const canvas = canvasEls[i];
				if (!canvas) continue;
				const page = await doc.getPage(infos[i].n);
				const vp = page.getViewport({ scale: scales[i] });
				canvas.width = Math.floor(vp.width * dpr);
				canvas.height = Math.floor(vp.height * dpr);
				const ctx = canvas.getContext('2d');
				if (!ctx) continue;
				await page.render({
					canvas,
					canvasContext: ctx,
					viewport: vp,
					transform: dpr === 1 ? undefined : [dpr, 0, 0, dpr, 0, 0]
				}).promise;
			}
			hasRendered = true;
		} catch (err) {
			console.error('Waiver PDF failed to render', err);
			loadError =
				'The waiver PDF could not be displayed here. Use the download link above to read it, then close this window and try again.';
		} finally {
			loading = false;
			await tick();
			checkEnd();
		}
	}

	export async function open() {
		dialogEl.showModal();
		reachedEnd = false;
		await tick();
		if (scrollEl) scrollEl.scrollTop = 0;
		if (pdfUrl && !hasRendered) {
			await renderPdf();
		} else {
			await tick();
			checkEnd();
		}
	}

	function close() {
		dialogEl.close();
	}

	function agree() {
		onagree();
		dialogEl.close();
	}
</script>

<dialog bind:this={dialogEl} class="waiver-dialog">
	<header class="wd-header">
		<h2>Competitor Waiver</h2>
		<div class="wd-header-actions">
			{#if pdfUrl}
				<a class="wd-download" href={pdfUrl} target="_blank" rel="noopener noreferrer">
					<Download size={15} />
					Download PDF
				</a>
			{/if}
			<button type="button" class="wd-close" onclick={close} aria-label="Close waiver">
				<X size={18} />
			</button>
		</div>
	</header>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- tabindex is deliberate: this box scrolls, and a keyboard-only user must be able to
	     reach the bottom of the document they are being asked to agree to. -->
	<div
		class="wd-scroll"
		bind:this={scrollEl}
		onscroll={onScroll}
		tabindex="0"
		role="region"
		aria-label="Waiver document"
	>
		{#if loading}
			<p class="wd-status">Loading waiver...</p>
		{/if}

		{#if loadError}
			<p class="wd-error">{loadError}</p>
		{/if}

		{#if pdfUrl && !loadError}
			{#each pages as page, i (page.n)}
				<div class="wd-page">
					<canvas bind:this={canvasEls[i]} style="aspect-ratio: {page.width} / {page.height}"
					></canvas>
					<div class="wd-sr-only">{page.srText}</div>
				</div>
			{/each}
		{:else if !loading}
			<div class="wd-text">{text}</div>
		{/if}
	</div>

	<footer class="wd-footer">
		<span class="wd-progress">
			{#if pdfUrl && pages.length > 0}
				<span>Page {currentPage} of {pages.length}</span>
			{/if}
			{#if !reachedEnd && !loading}
				<span class="wd-hint">Scroll to the end to continue</span>
			{/if}
		</span>
		<div class="wd-buttons">
			<button type="button" class="btn btn-secondary" onclick={close}>Cancel</button>
			<button type="button" class="btn btn-primary" disabled={!reachedEnd} onclick={agree}>
				I Agree
			</button>
		</div>
	</footer>
</dialog>

<style>
	.waiver-dialog {
		width: min(880px, 94vw);
		max-width: 94vw;
		height: min(90vh, 900px);
		/* [open] sets display:flex below, which overrides the UA stylesheet's centring
		   margins, so they have to be restored here. */
		margin: auto;
		padding: 0;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		background: var(--bg-primary);
		color: var(--text-primary);
		overflow: hidden;
	}

	.waiver-dialog::backdrop {
		background: rgb(0 0 0 / 0.6);
	}

	.waiver-dialog[open] {
		display: flex;
		flex-direction: column;
	}

	.wd-header,
	.wd-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.875rem 1.125rem;
		flex-shrink: 0;
	}

	.wd-header {
		border-bottom: 1px solid var(--border-color);
	}

	.wd-header h2 {
		margin: 0;
		font-size: 1rem;
	}

	.wd-header-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.wd-download {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		color: var(--text-secondary);
		text-decoration: none;
	}

	.wd-download:hover {
		color: var(--text-primary);
		text-decoration: underline;
	}

	.wd-close {
		display: inline-flex;
		padding: 0.25rem;
		border: none;
		background: none;
		color: var(--text-secondary);
		cursor: pointer;
	}

	.wd-close:hover {
		color: var(--text-primary);
	}

	.wd-scroll {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		background: var(--bg-secondary);
	}

	.wd-page {
		position: relative;
		margin: 0 auto 1rem;
		max-width: 100%;
	}

	.wd-page canvas {
		display: block;
		width: 100%;
		height: auto;
		background: #fff;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
	}

	.wd-text {
		white-space: pre-wrap;
		font-size: 0.875rem;
		line-height: 1.65;
		color: var(--text-secondary);
		padding: 1rem 1.125rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
	}

	.wd-status,
	.wd-error {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.wd-error {
		color: var(--text-primary);
	}

	.wd-footer {
		border-top: 1px solid var(--border-color);
	}

	.wd-progress {
		display: flex;
		align-items: baseline;
		gap: 0.625rem;
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.wd-hint {
		font-size: 0.75rem;
	}

	.wd-buttons {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.wd-buttons button:disabled {
		opacity: 0.45;
		filter: grayscale(1);
		cursor: not-allowed;
	}

	.wd-sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 600px) {
		.waiver-dialog {
			width: 100vw;
			max-width: 100vw;
			height: 100dvh;
			max-height: 100dvh;
			border-radius: 0;
			border: none;
		}

		.wd-footer {
			flex-direction: column;
			align-items: stretch;
			gap: 0.625rem;
		}

		.wd-buttons {
			justify-content: stretch;
		}

		.wd-buttons button {
			flex: 1;
		}
	}
</style>
