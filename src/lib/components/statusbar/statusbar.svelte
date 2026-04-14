<script lang="ts">
	import { getDocumentState } from '$lib/stores/document.svelte';
	import { getUIState, setZoom } from '$lib/stores/ui.svelte';

	const doc = getDocumentState();
	const ui = getUIState();

	function handleZoomChange(e: Event) {
		const target = e.target as HTMLInputElement;
		setZoom(Number(target.value));
	}
</script>

<div class="flex items-center h-[var(--spacing-statusbar-height)] bg-[var(--color-statusbar-bg)] border-t border-[var(--color-toolbar-border)] px-3 gap-4 select-none flex-shrink-0">
	<span class="text-[10px] text-[var(--color-text-secondary)]">
		Page {ui.currentPage} of {ui.totalPages}
	</span>

	{#if doc.isLoaded}
		<span class="text-[10px] text-[var(--color-text-muted)]">
			{doc.wordCount} words
		</span>
		<span class="text-[10px] text-[var(--color-text-muted)]">
			{doc.paragraphCount} paragraphs
		</span>
	{/if}

	<div class="ml-auto flex items-center gap-2">
		<button
			class="text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
			onclick={() => setZoom(ui.zoom - 10)}
			title="Zoom Out"
		>−</button>
		<input
			type="range"
			min="25"
			max="400"
			value={ui.zoom}
			oninput={handleZoomChange}
			class="w-[80px] h-[3px] accent-[var(--color-accent)] cursor-pointer"
			title="Zoom"
		/>
		<button
			class="text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
			onclick={() => setZoom(ui.zoom + 10)}
			title="Zoom In"
		>+</button>
		<span class="text-[10px] text-[var(--color-text-secondary)] w-[32px] text-right">{ui.zoom}%</span>
	</div>
</div>
