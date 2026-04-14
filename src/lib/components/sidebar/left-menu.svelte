<script lang="ts">
	import Icon from '$lib/components/ui/icon.svelte';

	type LeftPanel = 'search' | 'comments' | 'navigation' | 'thumbnails' | null;
	let activePanel: LeftPanel = $state(null);

	function toggle(panel: LeftPanel) {
		activePanel = activePanel === panel ? null : panel;
	}

	const buttons: { id: LeftPanel; icon: string; title: string }[] = [
		{ id: 'search', icon: 'btn-menu-search', title: 'Search' },
		{ id: 'comments', icon: 'btn-add-comment', title: 'Comments' },
		{ id: 'navigation', icon: 'btn-menu-navigation', title: 'Navigation' },
		{ id: 'thumbnails', icon: 'btn-menu-thumbs', title: 'Page Thumbnails' }
	];
</script>

<div class="flex h-full flex-shrink-0">
	<!-- Icon bar -->
	<div class="w-[var(--spacing-sidebar-width)] bg-[var(--color-sidebar-bg)] border-r border-[var(--color-toolbar-border)] flex flex-col items-center pt-1 gap-0.5">
		{#each buttons as btn}
			<button
				class="w-[32px] h-[32px] flex items-center justify-center rounded-[3px] transition-all cursor-pointer
					{activePanel === btn.id ? 'bg-[var(--color-toolbar-hover)]' : 'hover:bg-[var(--color-toolbar-hover)]'}"
				title={btn.title}
				onclick={() => toggle(btn.id)}
			>
				<Icon name={btn.icon} />
			</button>
		{/each}
	</div>

	<!-- Expandable panel -->
	{#if activePanel}
		<div class="w-[var(--spacing-sidebar-panel-width)] bg-[var(--color-sidebar-bg)] border-r border-[var(--color-toolbar-border)] flex flex-col overflow-hidden">
			<!-- Panel header -->
			<div class="flex items-center justify-between h-[32px] px-3 border-b border-[var(--color-toolbar-border)] flex-shrink-0">
				<span class="text-[12px] font-medium text-[var(--color-text-primary)] capitalize">{activePanel}</span>
				<button
					class="w-[20px] h-[20px] flex items-center justify-center rounded-[3px] hover:bg-[var(--color-toolbar-hover)] cursor-pointer text-[var(--color-text-tertiary)] text-[14px]"
					onclick={() => (activePanel = null)}
				>
					×
				</button>
			</div>

			<!-- Panel content -->
			<div class="flex-1 overflow-y-auto p-3">
				{#if activePanel === 'search'}
					<div class="flex flex-col gap-2">
						<input
							type="text"
							placeholder="Search..."
							class="w-full h-[var(--spacing-form-control)] text-[11px] border border-[var(--color-toolbar-border)] rounded-[3px] px-2 bg-white"
						/>
						<div class="flex gap-1">
							<button class="flex-1 h-[var(--spacing-form-control)] text-[10px] border border-[var(--color-toolbar-border)] rounded-[3px] bg-white hover:bg-[var(--color-toolbar-hover)] cursor-pointer">
								Previous
							</button>
							<button class="flex-1 h-[var(--spacing-form-control)] text-[10px] border border-[var(--color-toolbar-border)] rounded-[3px] bg-white hover:bg-[var(--color-toolbar-hover)] cursor-pointer">
								Next
							</button>
						</div>
						<details class="mt-1">
							<summary class="text-[10px] text-[var(--color-text-secondary)] cursor-pointer">Replace</summary>
							<div class="mt-2 flex flex-col gap-2">
								<input
									type="text"
									placeholder="Replace with..."
									class="w-full h-[var(--spacing-form-control)] text-[11px] border border-[var(--color-toolbar-border)] rounded-[3px] px-2 bg-white"
								/>
								<div class="flex gap-1">
									<button class="flex-1 h-[var(--spacing-form-control)] text-[10px] border border-[var(--color-toolbar-border)] rounded-[3px] bg-white hover:bg-[var(--color-toolbar-hover)] cursor-pointer">
										Replace
									</button>
									<button class="flex-1 h-[var(--spacing-form-control)] text-[10px] border border-[var(--color-toolbar-border)] rounded-[3px] bg-white hover:bg-[var(--color-toolbar-hover)] cursor-pointer">
										Replace All
									</button>
								</div>
							</div>
						</details>
					</div>
				{:else if activePanel === 'comments'}
					<div class="text-[11px] text-[var(--color-text-tertiary)] text-center py-8">
						No comments yet
					</div>
				{:else if activePanel === 'navigation'}
					<div class="text-[11px] text-[var(--color-text-tertiary)] text-center py-8">
						Document headings will appear here
					</div>
				{:else if activePanel === 'thumbnails'}
					<div class="text-[11px] text-[var(--color-text-tertiary)] text-center py-8">
						Page thumbnails will appear here
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
