<script lang="ts">
	import Icon from '$lib/components/ui/icon.svelte';
</script>

<div class="flex items-stretch h-[var(--spacing-toolbar-controls-height)] bg-[var(--color-toolbar-bg)] shadow-[var(--color-toolbar-shadow)] px-1 select-none overflow-x-auto overflow-y-hidden">

	<!-- Table of Contents -->
	<div class="toolbar-group">
		<button class="toolbar-btn-big" title="Table of Contents">
			<Icon name="btn-contents" size="big" />
			<span class="toolbar-btn-label">Contents</span>
		</button>
	</div>

	<!-- Footnotes -->
	<div class="toolbar-group">
		<div class="flex flex-col gap-0.5">
			<button class="toolbar-btn-sm" title="Footnote">
				<Icon name="btn-footnotes" />
			</button>
			<button class="toolbar-btn-sm" title="Endnote">
				<Icon name="btn-endnotes" />
			</button>
		</div>
	</div>

	<!-- Links -->
	<div class="toolbar-group">
		<div class="flex flex-col gap-0.5">
			<button class="toolbar-btn-sm" title="Hyperlink">
				<Icon name="btn-hyperlink" />
			</button>
			<button class="toolbar-btn-sm" title="Bookmark">
				<Icon name="btn-bookmark" />
			</button>
		</div>
	</div>

	<!-- Captions -->
	<div class="toolbar-group border-r-0">
		<div class="flex flex-col gap-1 items-center justify-center">
			<span class="text-[10px] text-[var(--color-text-tertiary)]">Captions, Index, Citations</span>
			<span class="text-[9px] text-[var(--color-text-tertiary)]">Coming soon</span>
		</div>
	</div>
</div>

<style>
	.toolbar-group {
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 0 6px;
		border-right: 1px solid var(--color-toolbar-border);
	}
</style>
