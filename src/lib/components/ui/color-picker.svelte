<script lang="ts">
	interface Props {
		onselect: (color: string) => void;
		onclose: () => void;
	}

	let { onselect, onclose }: Props = $props();

	const colors = [
		['#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF'],
		['#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'],
		['#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC'],
		['#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD'],
		['#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0'],
		['#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79'],
		['#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#741B47'],
		['#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'],
	];

	let customColor = $state('#000000');
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="absolute top-full left-0 mt-1 bg-white border border-[var(--color-toolbar-border)] rounded-[3px] shadow-lg p-2 z-50 w-[220px]"
	onmouseleave={onclose}
>
	<div class="text-[10px] text-[var(--color-text-secondary)] mb-1.5">Theme Colors</div>
	{#each colors as row}
		<div class="flex gap-[2px] mb-[2px]">
			{#each row as color}
				<button
					class="w-[18px] h-[18px] rounded-[1px] border border-transparent hover:border-[var(--color-accent)] hover:scale-110 transition-all cursor-pointer"
					style="background-color: {color};"
					onclick={() => { onselect(color); onclose(); }}
					title={color}
				></button>
			{/each}
		</div>
	{/each}
	<div class="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--color-toolbar-border)]">
		<input
			type="color"
			bind:value={customColor}
			class="w-[24px] h-[24px] border-none cursor-pointer p-0"
		/>
		<button
			class="text-[10px] text-[var(--color-accent)] hover:underline cursor-pointer"
			onclick={() => { onselect(customColor); onclose(); }}
		>
			Custom: {customColor}
		</button>
	</div>
</div>
