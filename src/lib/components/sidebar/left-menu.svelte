<script lang="ts">
	import { getUIState, toggleLeftSidebar } from '$lib/stores/ui.svelte';

	const ui = getUIState();

	const menuItems = [
		{ icon: '🔍', title: 'Search', action: () => {} },
		{ icon: '💬', title: 'Comments', action: () => {} },
		{ icon: '📑', title: 'Navigation', action: () => toggleLeftSidebar() }
	];
</script>

<div class="flex flex-col items-center w-[var(--spacing-sidebar-width)] bg-[var(--color-sidebar-bg)] border-r border-[var(--color-toolbar-border)] py-2 gap-1 flex-shrink-0">
	{#each menuItems as item}
		<button
			class="w-[32px] h-[32px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[14px]"
			title={item.title}
			onclick={item.action}
		>
			{item.icon}
		</button>
	{/each}
</div>
