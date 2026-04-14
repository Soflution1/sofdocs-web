<script lang="ts">
	import Icon from '$lib/components/ui/icon.svelte';
	import { getDocumentState } from '$lib/stores/document.svelte';
	import { getUIState, setZoom } from '$lib/stores/ui.svelte';

	const doc = getDocumentState();
	const ui = getUIState();

	function handleZoomChange(e: Event) {
		const target = e.target as HTMLInputElement;
		setZoom(Number(target.value));
	}

	const zoomPresets = [50, 75, 100, 125, 150, 200];
</script>

<div class="flex items-center h-[var(--spacing-statusbar-height)] bg-[var(--color-statusbar-bg)] shadow-[inset_0_1px_0_0_var(--color-statusbar-border)] px-2 gap-3 select-none flex-shrink-0">
	<!-- Page info -->
	<button class="statusbar-item cursor-pointer hover:text-[var(--color-accent)]" title="Go to page">
		Page {ui.currentPage} of {ui.totalPages}
	</button>

	{#if doc.isLoaded}
		<span class="statusbar-separator"></span>
		<span class="statusbar-item">
			{doc.wordCount} words
		</span>
		<span class="statusbar-separator"></span>
		<span class="statusbar-item">
			{doc.paragraphCount} paragraphs
		</span>
	{/if}

	<!-- Right side: zoom controls -->
	<div class="ml-auto flex items-center gap-1">
		<button
			class="statusbar-btn" title="Fit Width"
			onclick={() => setZoom(100)}
		>
			<Icon name="btn-zoom-fitwidth" />
		</button>
		<button
			class="statusbar-btn" title="Fit Page"
			onclick={() => setZoom(75)}
		>
			<Icon name="btn-zoom-fitpage" />
		</button>

		<span class="statusbar-separator"></span>

		<button
			class="statusbar-btn" title="Zoom Out"
			onclick={() => setZoom(ui.zoom - 10)}
		>
			<Icon name="btn-zoomdown" />
		</button>

		<input
			type="range"
			min="25"
			max="400"
			value={ui.zoom}
			oninput={handleZoomChange}
			class="w-[80px] h-[2px] accent-[var(--color-accent)] cursor-pointer"
			title="Zoom"
		/>

		<button
			class="statusbar-btn" title="Zoom In"
			onclick={() => setZoom(ui.zoom + 10)}
		>
			<Icon name="btn-zoomup" />
		</button>

		<select
			class="h-[18px] text-[10px] border border-[var(--color-toolbar-border)] rounded-[2px] bg-white px-0.5 cursor-pointer appearance-none text-center w-[42px]"
			value={ui.zoom}
			onchange={(e) => setZoom(Number((e.target as HTMLSelectElement).value))}
		>
			{#each zoomPresets as z}
				<option value={z}>{z}%</option>
			{/each}
		</select>
	</div>
</div>

<style>
	.statusbar-item {
		font-size: 10px;
		color: var(--color-text-secondary);
		white-space: nowrap;
	}
	.statusbar-separator {
		width: 1px;
		height: 12px;
		background: var(--color-toolbar-border);
		flex-shrink: 0;
	}
	.statusbar-btn {
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 2px;
		border: none;
		background: transparent;
		cursor: pointer;
		padding: 0;
		transition: all 0.15s;
	}
	.statusbar-btn:hover {
		background: var(--color-toolbar-hover);
	}
</style>
