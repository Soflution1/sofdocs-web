<script lang="ts">
	const insertItems = [
		{ icon: '🖼️', label: 'Image' },
		{ icon: '📊', label: 'Table' },
		{ icon: '📈', label: 'Chart' },
		{ icon: '🔗', label: 'Link' },
		{ icon: '📝', label: 'Comment' },
		{ icon: '—', label: 'Break' },
		{ icon: '①', label: 'Header' },
		{ icon: '②', label: 'Footer' },
		{ icon: '#', label: 'Page No.' },
		{ icon: '□', label: 'Shape' },
		{ icon: '≡', label: 'Equation' }
	];
</script>

<div class="flex items-stretch h-[var(--spacing-toolbar-height)] bg-[var(--color-toolbar-bg)] border-b border-[var(--color-toolbar-border)] px-2 gap-1 select-none">
	{#each insertItems as item}
		<button
			class="flex flex-col items-center justify-center px-3 h-[var(--spacing-button-big)] rounded-md hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer"
			title={item.label}
		>
			<span class="text-base leading-none">{item.icon}</span>
			<span class="text-[10px] text-[var(--color-text-secondary)] mt-1">{item.label}</span>
		</button>
	{/each}
</div>
