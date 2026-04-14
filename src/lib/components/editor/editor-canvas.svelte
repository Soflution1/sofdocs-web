<script lang="ts">
	import { getDocumentState } from '$lib/stores/document.svelte';
	import { getUIState } from '$lib/stores/ui.svelte';

	const doc = getDocumentState();
	const ui = getUIState();
</script>

<div class="flex-1 overflow-auto bg-[var(--color-canvas-bg)] flex justify-center py-8">
	{#if doc.isLoading}
		<div class="flex items-center justify-center">
			<div class="flex flex-col items-center gap-3">
				<div class="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
				<span class="text-sm text-[var(--color-text-secondary)]">Loading document...</span>
			</div>
		</div>
	{:else if doc.isLoaded}
		<div
			class="bg-[var(--color-page-bg)] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.08)] mx-auto"
			style="
				width: {(816 * ui.zoom) / 100}px;
				min-height: {(1056 * ui.zoom) / 100}px;
				padding: {(96 * ui.zoom) / 100}px;
				transform-origin: top center;
			"
		>
			<div class="sofdocs-content" style="font-size: {(11 * ui.zoom) / 100}pt; line-height: 1.5;">
				{@html doc.html}
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center h-full gap-6">
			<div class="text-6xl opacity-20">📄</div>
			<div class="text-center">
				<p class="text-lg font-medium text-[var(--color-text-secondary)]">Open a document</p>
				<p class="text-sm text-[var(--color-text-muted)] mt-1">Drop a .docx file or click the upload button below</p>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.sofdocs-content p) {
		margin: 0 0 0.5em 0;
	}
	:global(.sofdocs-content h1) {
		font-size: 2em;
		font-weight: bold;
		margin: 0.67em 0;
	}
	:global(.sofdocs-content h2) {
		font-size: 1.5em;
		font-weight: bold;
		margin: 0.83em 0;
	}
	:global(.sofdocs-content h3) {
		font-size: 1.17em;
		font-weight: bold;
		margin: 1em 0;
	}
	:global(.sofdocs-content table) {
		border-collapse: collapse;
		width: 100%;
		margin: 1em 0;
	}
	:global(.sofdocs-content td) {
		border: 1px solid #ccc;
		padding: 4px 8px;
	}
</style>
