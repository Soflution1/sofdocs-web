<script lang="ts">
	import Icon from '$lib/components/ui/icon.svelte';
</script>

<div class="flex items-stretch h-[var(--spacing-toolbar-controls-height)] bg-[var(--color-toolbar-bg)] shadow-[var(--color-toolbar-shadow)] px-1 select-none overflow-x-auto overflow-y-hidden">

	<!-- Page Setup -->
	<div class="toolbar-group">
		<button class="toolbar-btn-big" title="Margins">
			<Icon name="btn-pagemargins" size="big" />
			<span class="toolbar-btn-label">Margins</span>
		</button>
		<button class="toolbar-btn-big" title="Orientation">
			<Icon name="btn-pageorient" size="big" />
			<span class="toolbar-btn-label">Orientation</span>
		</button>
		<button class="toolbar-btn-big" title="Size">
			<Icon name="btn-pagesize" size="big" />
			<span class="toolbar-btn-label">Size</span>
		</button>
		<button class="toolbar-btn-big" title="Columns">
			<Icon name="btn-columns" size="big" />
			<span class="toolbar-btn-label">Columns</span>
		</button>
		<div class="flex flex-col gap-0.5">
			<button class="toolbar-btn-sm" title="Breaks">
				<Icon name="btn-pagebreak" />
			</button>
			<button class="toolbar-btn-sm" title="Line Numbers">
				<Icon name="btn-line-numbering" />
			</button>
		</div>
	</div>

	<!-- Paragraph -->
	<div class="toolbar-group">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-1">
				<span class="toolbar-field-label">Indent</span>
				<input type="number" class="toolbar-input w-[50px]" value="0" min="0" step="0.1" title="Left Indent (cm)" />
				<input type="number" class="toolbar-input w-[50px]" value="0" min="0" step="0.1" title="Right Indent (cm)" />
			</div>
			<div class="flex items-center gap-1">
				<span class="toolbar-field-label">Spacing</span>
				<input type="number" class="toolbar-input w-[50px]" value="0" min="0" step="1" title="Before (pt)" />
				<input type="number" class="toolbar-input w-[50px]" value="0" min="0" step="1" title="After (pt)" />
			</div>
		</div>
	</div>

	<!-- Arrange -->
	<div class="toolbar-group">
		<div class="flex flex-col gap-0.5">
			<button class="toolbar-btn-sm" title="Text Wrapping">
				<Icon name="btn-img-wrap" />
			</button>
			<button class="toolbar-btn-sm" title="Bring Forward">
				<Icon name="btn-arrange-forward" />
			</button>
		</div>
		<div class="flex flex-col gap-0.5">
			<button class="toolbar-btn-sm" title="Align">
				<Icon name="btn-img-align" />
			</button>
			<button class="toolbar-btn-sm" title="Send Backward">
				<Icon name="btn-arrange-backward" />
			</button>
		</div>
		<div class="flex flex-col gap-0.5">
			<button class="toolbar-btn-sm" title="Group">
				<Icon name="btn-img-group" />
			</button>
		</div>
	</div>

	<!-- Page Background -->
	<div class="toolbar-group">
		<button class="toolbar-btn-big" title="Watermark">
			<Icon name="btn-watermark" size="big" />
			<span class="toolbar-btn-label">Watermark</span>
		</button>
		<button class="toolbar-btn-big" title="Page Color">
			<Icon name="btn-page-color" size="big" />
			<span class="toolbar-btn-label">Page Color</span>
		</button>
	</div>

	<!-- Themes -->
	<div class="toolbar-group border-r-0">
		<button class="toolbar-btn-big" title="Color Schemes">
			<Icon name="btn-big-colorschemas" size="big" />
			<span class="toolbar-btn-label">Colors</span>
		</button>
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
	.toolbar-field-label {
		font-size: 10px;
		color: var(--color-text-secondary);
		width: 44px;
		text-align: right;
	}
	.toolbar-input {
		height: var(--spacing-form-control);
		font-size: 11px;
		border: 1px solid var(--color-toolbar-border);
		border-radius: 3px;
		padding: 0 4px;
		background: white;
		color: var(--color-text-primary);
	}
	.toolbar-input:focus {
		outline: none;
		border-color: var(--color-accent);
	}
</style>
