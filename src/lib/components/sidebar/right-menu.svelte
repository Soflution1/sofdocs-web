<script lang="ts">
	import { getUIState } from '$lib/stores/ui.svelte';

	const ui = getUIState();
</script>

{#if ui.rightSidebarOpen}
	<div class="w-[240px] bg-[var(--color-sidebar-bg)] border-l border-[var(--color-toolbar-border)] flex-shrink-0 p-3">
		<h3 class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-3">Properties</h3>
		<p class="text-xs text-[var(--color-text-muted)]">Select an element to view its properties.</p>
	</div>
{/if}
