<script lang="ts">
	import Icon from '$lib/components/ui/icon.svelte';
	import { getUIState, setZoom } from '$lib/stores/ui.svelte';

	const ui = getUIState();

	let showRulers = $state(true);
</script>

<div class="flex items-stretch h-[var(--spacing-toolbar-controls-height)] bg-[var(--color-toolbar-bg)] shadow-[var(--color-toolbar-shadow)] px-1 select-none overflow-x-auto overflow-y-hidden">

	<!-- Views -->
	<div class="toolbar-group">
		<div class="flex flex-col gap-1 py-2">
			<label class="flex items-center gap-2 cursor-pointer text-[11px] text-[var(--color-text-primary)]">
				<input type="checkbox" bind:checked={showRulers} class="accent-[var(--color-accent)]" />
				Rulers
			</label>
		</div>
	</div>

	<!-- Zoom -->
	<div class="toolbar-group border-r-0">
		<div class="flex items-center gap-2 py-2">
			<button class="toolbar-btn-sm" title="Zoom Out" onclick={() => setZoom(ui.zoom - 10)}>
				<Icon name="btn-zoomdown" />
			</button>
			<span class="text-[11px] text-[var(--color-text-primary)] w-[40px] text-center">{ui.zoom}%</span>
			<button class="toolbar-btn-sm" title="Zoom In" onclick={() => setZoom(ui.zoom + 10)}>
				<Icon name="btn-zoomup" />
			</button>
			<span class="toolbar-separator-v"></span>
			<button class="toolbar-btn-sm" title="Fit Width" onclick={() => setZoom(100)}>
				<Icon name="btn-zoom-fitwidth" />
			</button>
			<button class="toolbar-btn-sm" title="Fit Page" onclick={() => setZoom(75)}>
				<Icon name="btn-zoom-fitpage" />
			</button>
		</div>
	</div>
</div>

<style>
	.toolbar-group {
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 0 6px;
		border-right: 1px solid var(--color-toolbar-border);
	}
</style>
