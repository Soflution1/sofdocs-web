<script lang="ts">
	interface ToolButton {
		icon: string;
		label: string;
		title: string;
	}

	const clipboardGroup: ToolButton[] = [
		{ icon: '📋', label: 'Paste', title: 'Paste (Ctrl+V)' },
		{ icon: '✂️', label: 'Cut', title: 'Cut (Ctrl+X)' },
		{ icon: '📄', label: 'Copy', title: 'Copy (Ctrl+C)' }
	];

	const fontFormats = [
		{ icon: 'B', title: 'Bold (Ctrl+B)', cls: 'font-bold' },
		{ icon: 'I', title: 'Italic (Ctrl+I)', cls: 'italic' },
		{ icon: 'U', title: 'Underline (Ctrl+U)', cls: 'underline' },
		{ icon: 'S', title: 'Strikethrough', cls: 'line-through' }
	];

	const alignments = [
		{ icon: '☰', title: 'Align Left' },
		{ icon: '☰', title: 'Align Center' },
		{ icon: '☰', title: 'Align Right' },
		{ icon: '☰', title: 'Justify' }
	];
</script>

<div class="flex items-stretch h-[var(--spacing-toolbar-height)] bg-[var(--color-toolbar-bg)] border-b border-[var(--color-toolbar-border)] px-2 gap-3 select-none">
	<!-- Clipboard group -->
	<div class="flex items-center gap-0.5 pr-3 border-r border-[var(--color-toolbar-border)]">
		<button class="flex flex-col items-center justify-center w-[var(--spacing-button-big)] h-[var(--spacing-button-big)] rounded-md hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer" title={clipboardGroup[0].title}>
			<span class="text-lg leading-none">{clipboardGroup[0].icon}</span>
			<span class="text-[10px] text-[var(--color-text-secondary)] mt-0.5">{clipboardGroup[0].label}</span>
		</button>
		<div class="flex flex-col gap-0.5">
			{#each clipboardGroup.slice(1) as btn}
				<button class="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer" title={btn.title}>
					<span class="text-xs">{btn.icon}</span>
					<span class="text-[10px] text-[var(--color-text-secondary)]">{btn.label}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Font family & size -->
	<div class="flex items-center gap-1 pr-3 border-r border-[var(--color-toolbar-border)]">
		<select class="h-[22px] w-[120px] text-[11px] border border-[var(--color-toolbar-border)] rounded px-1 bg-white appearance-none cursor-pointer" title="Font">
			<option>Arial</option>
			<option>Times New Roman</option>
			<option>Calibri</option>
			<option>Courier New</option>
			<option>Georgia</option>
			<option>Helvetica</option>
			<option>Verdana</option>
		</select>
		<select class="h-[22px] w-[48px] text-[11px] border border-[var(--color-toolbar-border)] rounded px-1 bg-white appearance-none cursor-pointer text-center" title="Font Size">
			{#each [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72] as size}
				<option value={size} selected={size === 11}>{size}</option>
			{/each}
		</select>
	</div>

	<!-- Font formatting -->
	<div class="flex items-center gap-0.5 pr-3 border-r border-[var(--color-toolbar-border)]">
		{#each fontFormats as fmt}
			<button
				class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[13px] text-[var(--color-text-primary)] {fmt.cls}"
				title={fmt.title}
			>
				{fmt.icon}
			</button>
		{/each}
		<button class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer" title="Font Color">
			<span class="text-[13px] font-bold text-red-600 border-b-2 border-red-600">A</span>
		</button>
		<button class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer" title="Highlight Color">
			<span class="text-[13px] font-bold bg-yellow-200 px-0.5">ab</span>
		</button>
	</div>

	<!-- Paragraph alignment -->
	<div class="flex items-center gap-0.5 pr-3 border-r border-[var(--color-toolbar-border)]">
		{#each alignments as align, i}
			<button
				class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[11px] text-[var(--color-text-secondary)]"
				title={align.title}
				style={i === 1 ? 'text-align:center' : i === 2 ? 'text-align:right' : ''}
			>
				{align.icon}
			</button>
		{/each}
	</div>

	<!-- Lists -->
	<div class="flex items-center gap-0.5 pr-3 border-r border-[var(--color-toolbar-border)]">
		<button class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[12px]" title="Bulleted List">
			•≡
		</button>
		<button class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[12px]" title="Numbered List">
			1.
		</button>
		<button class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[12px]" title="Decrease Indent">
			⇤
		</button>
		<button class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[12px]" title="Increase Indent">
			⇥
		</button>
	</div>

	<!-- Styles -->
	<div class="flex items-center gap-1">
		<select class="h-[22px] w-[100px] text-[11px] border border-[var(--color-toolbar-border)] rounded px-1 bg-white appearance-none cursor-pointer" title="Paragraph Style">
			<option>Normal</option>
			<option>Heading 1</option>
			<option>Heading 2</option>
			<option>Heading 3</option>
			<option>Title</option>
			<option>Subtitle</option>
		</select>
	</div>
</div>
