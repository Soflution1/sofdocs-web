<script lang="ts">
	import Icon from '$lib/components/ui/icon.svelte';
</script>

<div class="flex items-stretch h-[var(--spacing-toolbar-controls-height)] bg-[var(--color-toolbar-bg)] shadow-[var(--color-toolbar-shadow)] px-1 select-none overflow-x-auto overflow-y-hidden">

	<!-- Pages -->
	<div class="toolbar-group">
		<button class="toolbar-btn-big" title="Page Break">
			<Icon name="btn-pagebreak" size="big" />
			<span class="toolbar-btn-label">Break</span>
		</button>
		<button class="toolbar-btn-big" title="Blank Page">
			<Icon name="btn-blankpage" size="big" />
			<span class="toolbar-btn-label">Blank Page</span>
		</button>
	</div>

	<!-- Tables -->
	<div class="toolbar-group">
		<button class="toolbar-btn-big" title="Insert Table">
			<Icon name="btn-inserttable" size="big" />
			<span class="toolbar-btn-label">Table</span>
		</button>
	</div>

	<!-- Illustrations -->
	<div class="toolbar-group">
		<button class="toolbar-btn-big" title="Insert Image">
			<Icon name="btn-insertimage" size="big" />
			<span class="toolbar-btn-label">Image</span>
		</button>
		<button class="toolbar-btn-big" title="Insert Shape">
			<Icon name="btn-insertshape" size="big" />
			<span class="toolbar-btn-label">Shape</span>
		</button>
		<button class="toolbar-btn-big" title="Insert Chart">
			<Icon name="btn-insertchart" size="big" />
			<span class="toolbar-btn-label">Chart</span>
		</button>
		<button class="toolbar-btn-big" title="SmartArt">
			<Icon name="btn-smart-art" size="big" />
			<span class="toolbar-btn-label">SmartArt</span>
		</button>
		<button class="toolbar-btn-big" title="Text Art">
			<Icon name="btn-textart" size="big" />
			<span class="toolbar-btn-label">Text Art</span>
		</button>
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

	<!-- Header & Footer -->
	<div class="toolbar-group">
		<div class="flex flex-col gap-0.5">
			<button class="toolbar-btn-sm" title="Header/Footer">
				<Icon name="btn-menu-header" />
			</button>
			<button class="toolbar-btn-sm" title="Footnotes">
				<Icon name="btn-footnotes" />
			</button>
		</div>
	</div>

	<!-- Text -->
	<div class="toolbar-group">
		<button class="toolbar-btn-big" title="Text Box">
			<Icon name="btn-big-text" size="big" />
			<span class="toolbar-btn-label">Text Box</span>
		</button>
		<div class="flex flex-col gap-0.5">
			<button class="toolbar-btn-sm" title="Drop Cap">
				<Icon name="btn-dropcap" />
			</button>
			<button class="toolbar-btn-sm" title="Insert from File">
				<Icon name="btn-text-from-file" />
			</button>
		</div>
	</div>

	<!-- Symbols -->
	<div class="toolbar-group">
		<button class="toolbar-btn-big" title="Equation">
			<Icon name="btn-insertequation" size="big" />
			<span class="toolbar-btn-label">Equation</span>
		</button>
		<button class="toolbar-btn-big" title="Symbol">
			<Icon name="btn-symbol" size="big" />
			<span class="toolbar-btn-label">Symbol</span>
		</button>
	</div>

	<!-- Controls -->
	<div class="toolbar-group border-r-0">
		<button class="toolbar-btn-big" title="Content Controls">
			<Icon name="btn-controls" size="big" />
			<span class="toolbar-btn-label">Controls</span>
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
</style>
