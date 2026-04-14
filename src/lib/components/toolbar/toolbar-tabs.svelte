<script lang="ts">
	import { getUIState, setActiveTab, type ToolbarTab } from '$lib/stores/ui.svelte';

	const ui = getUIState();

	interface Props {
		onfileclick?: () => void;
	}

	let { onfileclick }: Props = $props();

	const tabs: { id: ToolbarTab; label: string }[] = [
		{ id: 'home', label: 'Home' },
		{ id: 'insert', label: 'Insert' },
		{ id: 'layout', label: 'Layout' },
		{ id: 'references', label: 'References' },
		{ id: 'view', label: 'View' }
	];
</script>

<div class="flex items-end h-[var(--spacing-toolbar-tabs-height)] bg-[var(--color-toolbar-header)] px-1 select-none">
	<!-- File button -->
	<button
		class="px-4 h-[28px] text-[11px] font-semibold text-white/90 hover:bg-[var(--color-toolbar-header-hover)] transition-all cursor-pointer rounded-t-[3px] flex items-center"
		onclick={onfileclick}
	>
		File
	</button>

	<!-- Tab buttons -->
	{#each tabs as tab}
		<button
			class="relative px-3 h-[28px] text-[11px] font-medium transition-all cursor-pointer rounded-t-[3px] flex items-center
				{ui.activeTab === tab.id
					? 'bg-[var(--color-toolbar-bg)] text-[var(--color-text-primary)]'
					: 'text-white/85 hover:bg-[var(--color-toolbar-header-hover)]'}"
			onclick={() => setActiveTab(tab.id)}
		>
			{tab.label}
			{#if ui.activeTab === tab.id}
				<span class="absolute bottom-0 left-[6px] right-[6px] h-0"></span>
			{/if}
		</button>
	{/each}
</div>
