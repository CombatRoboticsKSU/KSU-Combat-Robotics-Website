<script lang="ts">
	let {
		value = $bindable(''),
		name = 'image',
		folder = 'uploads',
		label = 'Image',
		placeholder = '/USINGimg/placeholder.png',
		accept = 'image/*'
	}: {
		value: string;
		name?: string;
		folder?: string;
		label?: string;
		placeholder?: string;
		accept?: string;
	} = $props();

	let uploading = $state(false);
	let error = $state('');
	let dragover = $state(false);
	let fileInput: HTMLInputElement;

	async function uploadFile(file: File) {
		uploading = true;
		error = '';

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
			value = data.url;
		} catch (e: any) {
			error = e.message || 'Upload failed';
		} finally {
			uploading = false;
		}
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) uploadFile(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragover = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) uploadFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragover = true;
	}

	function clear() {
		value = '';
		error = '';
		if (fileInput) fileInput.value = '';
	}

	let isImage = $derived(
		value && (
			value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
			value.includes('blob.vercel-storage.com')
		)
	);
</script>

<div class="image-upload">
	<div class="image-upload-label">{label}</div>

	<!-- Drop zone / preview -->
	<div
		class="drop-zone"
		class:dragover
		class:has-preview={!!value}
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={() => dragover = false}
		role="button"
		tabindex="0"
		onclick={() => fileInput?.click()}
		onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInput?.click(); }}
	>
		{#if uploading}
			<div class="upload-status">Uploading...</div>
		{:else if value && isImage}
			<img src={value} alt="Preview" class="preview-img" />
		{:else if value}
			<div class="file-indicator">
				<span class="file-icon">&#128206;</span>
				<span class="file-url">{value.split('/').pop()}</span>
			</div>
		{:else}
			<div class="drop-prompt">
				<span class="drop-icon">&#8682;</span>
				<span>Drop file or click to upload</span>
			</div>
		{/if}
	</div>

	<input
		bind:this={fileInput}
		type="file"
		{accept}
		onchange={handleFileSelect}
		style="display:none"
	/>

	<!-- URL input + clear -->
	<div class="url-row">
		<input
			type="text"
			{name}
			bind:value
			placeholder={placeholder}
			class="url-input"
		/>
		{#if value}
			<button type="button" class="btn-clear" onclick={clear} title="Clear">&times;</button>
		{/if}
	</div>

	{#if error}
		<div class="upload-error">{error}</div>
	{/if}
</div>

<style>
	.image-upload {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.image-upload-label {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		font-weight: 500;
	}

	.drop-zone {
		border: 2px dashed var(--border-color);
		border-radius: 0.5rem;
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 80px;
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
		background: var(--bg-primary);
		overflow: hidden;
	}

	.drop-zone:hover,
	.drop-zone.dragover {
		border-color: var(--gold);
		background: rgba(255, 215, 0, 0.03);
	}

	.drop-zone.has-preview {
		padding: 0.375rem;
		min-height: 60px;
	}

	.preview-img {
		max-height: 120px;
		max-width: 100%;
		object-fit: contain;
		border-radius: 0.25rem;
	}

	.file-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-secondary);
		font-size: 0.8125rem;
	}

	.file-icon {
		font-size: 1.25rem;
	}

	.file-url {
		word-break: break-all;
	}

	.drop-prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		color: var(--text-muted);
		font-size: 0.8125rem;
	}

	.drop-icon {
		font-size: 1.5rem;
		line-height: 1;
	}

	.upload-status {
		color: var(--gold);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.url-row {
		display: flex;
		gap: 0.375rem;
	}

	.url-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background: var(--bg-primary);
		color: inherit;
		font-family: inherit;
		font-size: 0.8125rem;
	}

	.url-input:focus {
		outline: none;
		border-color: var(--gold);
	}

	.btn-clear {
		width: 32px;
		height: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 1.125rem;
		transition: all 0.15s;
		flex-shrink: 0;
	}

	.btn-clear:hover {
		border-color: #ef4444;
		color: #ef4444;
	}

	.upload-error {
		color: #ef4444;
		font-size: 0.75rem;
	}
</style>
