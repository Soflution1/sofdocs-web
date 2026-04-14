<script lang="ts">
	import { getUIState, setActiveTab, type ToolbarTab } from '$lib/stores/ui.svelte';

	const ui = getUIState();

	const tabs: { id: ToolbarTab; label: string }[] = [
		{ id: 'home', label: 'Home' },
		{ id: 'insert', label: 'Insert' },
		{ id: 'layout', label: 'Layout' },
		{ id: 'references', label: 'References' },
		{ id: 'view', label: 'View' }
	];
</script>

<div class="flex items-center h-[28px] bg-[var(--color-toolbar-header)] px-2 gap-0.5 select-none">
	<button class="px-3 py-0.5 text-[11px] font-semibold text-white/90 hover:bg-white/15 rounded-sm transition-all cursor-pointer mr-1">
		File
	</button>
	{#each tabs as tab}
		<button
			class="px-3 py-0.5 text-[11px] font-medium rounded-sm transition-all cursor-pointer
				{ui.activeTab === tab.id
					? 'bg-[var(--color-toolbar-bg)] text-[var(--color-text-primary)] shadow-sm'
					: 'text-white/80 hover:bg-white/15'}"
			onclick={() => setActiveTab(tab.id)}
		>
			{tab.label}
		</button>
	{/each}
</div>
