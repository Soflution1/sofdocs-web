<script lang="ts">
	import { getDocumentState, updateDocumentHtml } from '$lib/stores/document.svelte';
	import { getSelectionState } from '$lib/stores/selection.svelte';
	import {
		toggleBold,
		toggleItalic,
		toggleUnderline,
		toggleStrikethrough,
		setFontFamily,
		setFontSize,
		setAlignment,
		undoEdit,
		redoEdit,
		saveDocx
	} from '$lib/wasm/loader';

	const doc = getDocumentState();
	const sel = getSelectionState();

	let selectedFont = $state('Arial');
	let selectedSize = $state(11);

	async function applyStyle(fn: (sp: number, so: number, ep: number, eo: number) => Promise<string>) {
		if (!doc.isLoaded) return;
		const html = await fn(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset);
		updateDocumentHtml(html);
	}

	async function onBold() { await applyStyle(toggleBold); }
	async function onItalic() { await applyStyle(toggleItalic); }
	async function onUnderline() { await applyStyle(toggleUnderline); }
	async function onStrikethrough() { await applyStyle(toggleStrikethrough); }

	async function onFontChange(e: Event) {
		const font = (e.target as HTMLSelectElement).value;
		selectedFont = font;
		if (!doc.isLoaded) return;
		const html = await setFontFamily(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset, font);
		updateDocumentHtml(html);
	}

	async function onSizeChange(e: Event) {
		const size = parseInt((e.target as HTMLSelectElement).value, 10);
		selectedSize = size;
		if (!doc.isLoaded) return;
		const html = await setFontSize(sel.startPara, sel.startOffset, sel.endPara, sel.endOffset, size);
		updateDocumentHtml(html);
	}

	async function onAlign(alignment: string) {
		if (!doc.isLoaded) return;
		const html = await setAlignment(sel.startPara, alignment);
		updateDocumentHtml(html);
	}

	async function onUndo() {
		if (!doc.isLoaded) return;
		const html = await undoEdit();
		updateDocumentHtml(html);
	}

	async function onRedo() {
		if (!doc.isLoaded) return;
		const html = await redoEdit();
		updateDocumentHtml(html);
	}

	async function onSave() {
		if (!doc.isLoaded) return;
		try {
			const bytes = await saveDocx();
			const blob = new Blob([new Uint8Array(bytes)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = doc.fileName || 'document.docx';
			a.click();
			URL.revokeObjectURL(url);
		} catch (err) {
			alert(`Save failed: ${err}`);
		}
	}

	interface ToolButton {
		icon: string;
		label: string;
		title: string;
		action?: () => void;
	}

	const clipboardGroup: ToolButton[] = [
		{ icon: '📋', label: 'Paste', title: 'Paste (Ctrl+V)' },
		{ icon: '✂️', label: 'Cut', title: 'Cut (Ctrl+X)' },
		{ icon: '📄', label: 'Copy', title: 'Copy (Ctrl+C)' }
	];

	const fontFormats = [
		{ icon: 'B', title: 'Bold (Ctrl+B)', cls: 'font-bold', action: onBold },
		{ icon: 'I', title: 'Italic (Ctrl+I)', cls: 'italic', action: onItalic },
		{ icon: 'U', title: 'Underline (Ctrl+U)', cls: 'underline', action: onUnderline },
		{ icon: 'S', title: 'Strikethrough', cls: 'line-through', action: onStrikethrough }
	];

	const alignments = [
		{ icon: '☰', title: 'Align Left', value: 'left' },
		{ icon: '☰', title: 'Align Center', value: 'center' },
		{ icon: '☰', title: 'Align Right', value: 'right' },
		{ icon: '☰', title: 'Justify', value: 'both' }
	];
</script>

<div class="flex items-stretch h-[var(--spacing-toolbar-height)] bg-[var(--color-toolbar-bg)] border-b border-[var(--color-toolbar-border)] px-2 gap-3 select-none">
	<!-- Undo/Redo + Save -->
	<div class="flex items-center gap-0.5 pr-3 border-r border-[var(--color-toolbar-border)]">
		<button class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[13px]" title="Undo (Ctrl+Z)" onclick={onUndo}>
			↩
		</button>
		<button class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[13px]" title="Redo (Ctrl+Y)" onclick={onRedo}>
			↪
		</button>
		<button class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[13px]" title="Save (Ctrl+S)" onclick={onSave}>
			💾
		</button>
	</div>

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
		<select
			class="h-[22px] w-[120px] text-[11px] border border-[var(--color-toolbar-border)] rounded px-1 bg-white appearance-none cursor-pointer"
			title="Font"
			bind:value={selectedFont}
			onchange={onFontChange}
		>
			<option>Arial</option>
			<option>Times New Roman</option>
			<option>Calibri</option>
			<option>Courier New</option>
			<option>Georgia</option>
			<option>Helvetica</option>
			<option>Verdana</option>
		</select>
		<select
			class="h-[22px] w-[48px] text-[11px] border border-[var(--color-toolbar-border)] rounded px-1 bg-white appearance-none cursor-pointer text-center"
			title="Font Size"
			bind:value={selectedSize}
			onchange={onSizeChange}
		>
			{#each [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72] as size}
				<option value={size}>{size}</option>
			{/each}
		</select>
	</div>

	<!-- Font formatting -->
	<div class="flex items-center gap-0.5 pr-3 border-r border-[var(--color-toolbar-border)]">
		{#each fontFormats as fmt}
			<button
				class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[13px] text-[var(--color-text-primary)] {fmt.cls}"
				title={fmt.title}
				onclick={fmt.action}
			>
				{fmt.icon}
			</button>
		{/each}
	</div>

	<!-- Paragraph alignment -->
	<div class="flex items-center gap-0.5 pr-3 border-r border-[var(--color-toolbar-border)]">
		{#each alignments as align}
			<button
				class="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-[var(--color-toolbar-hover)] transition-all cursor-pointer text-[11px] text-[var(--color-text-secondary)]"
				title={align.title}
				onclick={() => onAlign(align.value)}
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
