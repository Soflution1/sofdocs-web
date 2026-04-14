<script lang="ts">
	interface Props {
		onselect: (rows: number, cols: number) => void;
		onclose: () => void;
	}

	let { onselect, onclose }: Props = $props();

	const maxRows = 10;
	const maxCols = 10;
	let hoverRow = $state(0);
	let hoverCol = $state(0);

	function handleCellHover(row: number, col: number) {
		hoverRow = row;
		hoverCol = col;
	}

	function handleCellClick(row: number, col: number) {
		onselect(row, col);
		onclose();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="absolute top-full left-0 mt-1 bg-white border border-[var(--color-toolbar-border)] rounded-[3px] shadow-lg p-2 z-50"
	onmouseleave={onclose}
>
	<div class="text-[10px] text-[var(--color-text-secondary)] text-center mb-1.5">
		{hoverRow > 0 ? `${hoverRow} × ${hoverCol} Table` : 'Insert Table'}
	</div>
	<div class="grid gap-[1px]" style="grid-template-columns: repeat({maxCols}, 16px);">
		{#each Array(maxRows) as _, ri}
			{#each Array(maxCols) as _, ci}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					class="w-[16px] h-[16px] border cursor-pointer transition-all
						{ri < hoverRow && ci < hoverCol
							? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]'
							: 'bg-white border-[var(--color-toolbar-border)]'}"
					onmouseenter={() => handleCellHover(ri + 1, ci + 1)}
					onclick={() => handleCellClick(ri + 1, ci + 1)}
					role="gridcell"
					tabindex="-1"
				></div>
			{/each}
		{/each}
	</div>
</div>
