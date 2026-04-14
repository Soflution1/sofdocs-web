<script lang="ts">
	import { getUIState } from '$lib/stores/ui.svelte';
	import ToolbarTabs from './toolbar-tabs.svelte';
	import ToolbarHome from './toolbar-home.svelte';
	import ToolbarInsert from './toolbar-insert.svelte';
	import ToolbarLayout from './toolbar-layout.svelte';

	const ui = getUIState();
</script>

<div class="flex-shrink-0">
	<ToolbarTabs />
	{#if ui.activeTab === 'home'}
		<ToolbarHome />
	{:else if ui.activeTab === 'insert'}
		<ToolbarInsert />
	{:else if ui.activeTab === 'layout'}
		<ToolbarLayout />
	{:else}
		<div class="flex items-center h-[var(--spacing-toolbar-height)] bg-[var(--color-toolbar-bg)] border-b border-[var(--color-toolbar-border)] px-4">
			<span class="text-xs text-[var(--color-text-muted)]">{ui.activeTab} tab — coming soon</span>
		</div>
	{/if}
</div>
