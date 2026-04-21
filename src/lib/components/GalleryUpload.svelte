<script lang="ts">
	let {
		value = $bindable(''),
		folder = 'gallery',
		label = 'Gallery Images'
	}: {
		value: string;
		folder?: string;
		label?: string;
	} = $props();

	let uploading = $state(false);
	let error = $state('');
	let dragover = $state(false);
	let fileInput: HTMLInputElement;

	function getUrls(): string[] {
		return value.split('\n').map(s => s.trim()).filter(Boolean);
	}

	async function uploadFiles(files: FileList | File[]) {
		uploading = true;
		error = '';
		const newUrls: string[] = [];

		for (const file of files) {
			const form = new FormData();
			form.append('file', file);
			form.append('folder', folder);

			try {
				const res = await fetch('/api/upload', { method: 'POST', body: form });
				if (!res.ok) {
					const data = await res.json().catch(() => ({ message: res.statusText }));
					throw new Error(data.message || res.statusText);
				}
				const data = await res.json();
				newUrls.push(data.url);
			} catch (e: any) {
				error = e.message || 'Upload failed';
			}
		}

		if (newUrls.length) {
			const existing = getUrls();
			value = [...existing, ...newUrls].join('\n');
		}
		uploading = false;
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files?.length) uploadFiles(input.files);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragover = false;
		if (e.dataTransfer?.files?.length) uploadFiles(e.dataTransfer.files);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragover = true;
	}

	function removeUrl(index: number) {
		const urls = getUrls();
		urls.splice(index, 1);
		value = urls.join('\n');
	}

	let urls = $derived(getUrls());
</script>

<div class="gallery-upload">
	<div class="gallery-label">{label}</div>

	<!-- Thumbnails -->
	{#if urls.length > 0}
		<div class="thumbnail-grid">
			{#each urls as url, i}
				<div class="thumb-item">
					{#if url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || url.includes('blob.vercel-storage.com')}
						<img src={url} alt="Gallery {i + 1}" class="thumb-img" />
					{:else}
						<div class="thumb-path">{url.split('/').pop()}</div>
					{/if}
					<button type="button" class="thumb-remove" onclick={() => removeUrl(i)} title="Remove">&times;</button>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Drop zone -->
	<div
		class="gallery-drop"
		class:dragover
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={() => dragover = false}
		role="button"
		tabindex="0"
		onclick={() => fileInput?.click()}
		onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInput?.click(); }}
	>
		{#if uploading}
			<span class="upload-status">Uploading...</span>
		{:else}
			<span class="drop-icon">&#8682;</span>
			<span>Drop images or click to upload</span>
		{/if}
	</div>

	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		multiple
		onchange={handleFileSelect}
		style="display:none"
	/>

	<!-- Raw textarea for manual URL entry -->
	<details class="manual-entry">
		<summary>Manual URL entry</summary>
		<textarea rows="3" bind:value placeholder="One URL per line"></textarea>
	</details>

	{#if error}
		<div class="upload-error">{error}</div>
	{/if}
</div>

<style>
	.gallery-upload {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.gallery-label {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		font-weight: 500;
	}

	.thumbnail-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.thumb-item {
		position: relative;
		width: 80px;
		height: 80px;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		overflow: hidden;
		background: var(--bg-primary);
	}

	.thumb-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.thumb-path {
		font-size: 0.625rem;
		padding: 0.25rem;
		color: var(--text-muted);
		word-break: break-all;
		overflow: hidden;
		height: 100%;
	}

	.thumb-remove {
		position: absolute;
		top: 2px;
		right: 2px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: none;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		font-size: 0.875rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.thumb-item:hover .thumb-remove {
		opacity: 1;
	}

	.gallery-drop {
		border: 2px dashed var(--border-color);
		border-radius: 0.5rem;
		padding: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
		background: var(--bg-primary);
		color: var(--text-muted);
		font-size: 0.8125rem;
	}

	.gallery-drop:hover,
	.gallery-drop.dragover {
		border-color: var(--gold);
		background: rgba(255, 215, 0, 0.03);
	}

	.drop-icon {
		font-size: 1.25rem;
	}

	.upload-status {
		color: var(--gold);
		font-weight: 500;
	}

	.manual-entry {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.manual-entry summary {
		cursor: pointer;
	}

	.manual-entry textarea {
		width: 100%;
		margin-top: 0.375rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background: var(--bg-primary);
		color: inherit;
		font-family: inherit;
		font-size: 0.8125rem;
		box-sizing: border-box;
	}

	.manual-entry textarea:focus {
		outline: none;
		border-color: var(--gold);
	}

	.upload-error {
		color: #ef4444;
		font-size: 0.75rem;
	}
</style>
