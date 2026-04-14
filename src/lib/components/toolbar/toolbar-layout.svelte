<script lang="ts">
	const layoutItems = [
		{ icon: '📐', label: 'Margins' },
		{ icon: '↕️', label: 'Orientation' },
		{ icon: '📄', label: 'Size' },
		{ icon: '⬜', label: 'Columns' },
		{ icon: '⎯', label: 'Breaks' },
		{ icon: '📏', label: 'Line Numbers' },
		{ icon: '☰', label: 'Spacing' },
		{ icon: '⇥', label: 'Indent' }
	];
</script>

<div class="flex items-stretch h-[var(--spacing-toolbar-height)] bg-[var(--color-toolbar-bg)] border-b border-[var(--color-toolbar-border)] px-2 gap-1 select-none">
	{#each layoutItems as item}
		<button
			class="flex flex-col items-center justify-center px-3 h-[var(--spacing-button-big)] rounded-md hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer"
			title={item.label}
		>
			<span class="text-base leading-none">{item.icon}</span>
			<span class="text-[10px] text-[var(--color-text-secondary)] mt-1">{item.label}</span>
		</button>
	{/each}
</div>
