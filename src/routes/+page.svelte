<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/app/document');
	});
</script>

<div class="flex items-center justify-center h-screen bg-[var(--color-canvas-bg)]">
	<div class="flex flex-col items-center gap-3">
		<div class="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
		<span class="text-sm text-[var(--color-text-secondary)]">Loading SofDocs...</span>
	</div>
</div>
