<script lang="ts">
	type IconSize = 'small' | 'big' | 'huge';

	interface Props {
		name: string;
		size?: IconSize;
		class?: string;
	}

	let { name, size = 'small', class: className = '' }: Props = $props();

	const sizeMap: Record<IconSize, number> = {
		small: 20,
		big: 28,
		huge: 32
	};

	const px = $derived(sizeMap[size]);
	const src = $derived(`/icons/${size}/${name}.svg`);
</script>

<img
	{src}
	alt=""
	width={px}
	height={px}
	class="inline-block pointer-events-none select-none {className}"
	style="width: {px}px; height: {px}px;"
	draggable="false"
/>
