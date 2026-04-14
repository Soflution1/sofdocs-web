<script lang="ts">
	import { getUIState } from '$lib/stores/ui.svelte';
	import ToolbarTabs from './toolbar-tabs.svelte';
	import ToolbarHome from './toolbar-home.svelte';
	import ToolbarInsert from './toolbar-insert.svelte';
	import ToolbarLayout from './toolbar-layout.svelte';
	import ToolbarReferences from './toolbar-references.svelte';
	import ToolbarView from './toolbar-view.svelte';
	import FileMenu from './file-menu.svelte';

	const ui = getUIState();
	let fileMenuOpen = $state(false);
</script>

<div class="flex-shrink-0 relative">
	<ToolbarTabs onfileclick={() => (fileMenuOpen = !fileMenuOpen)} />
	{#if ui.activeTab === 'home'}
		<ToolbarHome />
	{:else if ui.activeTab === 'insert'}
		<ToolbarInsert />
	{:else if ui.activeTab === 'layout'}
		<ToolbarLayout />
	{:else if ui.activeTab === 'references'}
		<ToolbarReferences />
	{:else if ui.activeTab === 'view'}
		<ToolbarView />
	{/if}
</div>

{#if fileMenuOpen}
	<FileMenu onclose={() => (fileMenuOpen = false)} />
{/if}
