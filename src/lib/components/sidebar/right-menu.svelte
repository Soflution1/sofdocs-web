<script lang="ts">
	import Icon from '$lib/components/ui/icon.svelte';
	import { getDocumentState, updateDocumentHtml } from '$lib/stores/document.svelte';
	import { getSelectionState } from '$lib/stores/selection.svelte';
	import { setAlignment, setIndent, setSpacing } from '$lib/wasm/loader';

	const doc = getDocumentState();
	const sel = getSelectionState();

	type RightPanel = 'paragraph' | 'table' | 'image' | 'shape' | null;
	let activePanel: RightPanel = $state(null);

	function toggle(panel: RightPanel) {
		activePanel = activePanel === panel ? null : panel;
	}

	const buttons: { id: RightPanel; icon: string; title: string }[] = [
		{ id: 'paragraph', icon: 'btn-paragraph', title: 'Paragraph Settings' },
		{ id: 'table', icon: 'btn-inserttable', title: 'Table Settings' },
		{ id: 'image', icon: 'btn-insertimage', title: 'Image Settings' },
		{ id: 'shape', icon: 'btn-insertshape', title: 'Shape Settings' }
	];

	let indentLeft = $state(0);
	let indentRight = $state(0);
	let indentFirst = $state(0);
	let spacingBefore = $state(0);
	let spacingAfter = $state(10);
	let lineSpacing = $state('276');
	let currentAlign = $state('left');

	async function applyAlign(align: string) {
		if (!doc.isLoaded) return;
		currentAlign = align;
		const html = await setAlignment(sel.startPara, align);
		updateDocumentHtml(html);
	}

	async function applyIndent() {
		if (!doc.isLoaded) return;
		const leftTwips = Math.round(indentLeft * 567);
		const rightTwips = Math.round(indentRight * 567);
		const firstTwips = Math.round(indentFirst * 567);
		const html = await setIndent(sel.startPara, leftTwips, rightTwips, firstTwips);
		updateDocumentHtml(html);
	}

	async function applySpacing() {
		if (!doc.isLoaded) return;
		const beforeTwips = spacingBefore * 20;
		const afterTwips = spacingAfter * 20;
		const lineTwips = parseInt(lineSpacing, 10);
		const html = await setSpacing(sel.startPara, beforeTwips, afterTwips, lineTwips);
		updateDocumentHtml(html);
	}
</script>

<div class="flex h-full flex-shrink-0">
	{#if activePanel}
		<div class="w-[var(--spacing-sidebar-panel-width)] bg-[var(--color-sidebar-bg)] border-l border-[var(--color-toolbar-border)] flex flex-col overflow-hidden">
			<div class="flex items-center justify-between h-[32px] px-3 border-b border-[var(--color-toolbar-border)] flex-shrink-0">
				<span class="text-[12px] font-medium text-[var(--color-text-primary)] capitalize">{activePanel}</span>
				<button class="w-[20px] h-[20px] flex items-center justify-center rounded-[3px] hover:bg-[var(--color-toolbar-hover)] cursor-pointer text-[var(--color-text-tertiary)] text-[14px]" onclick={() => (activePanel = null)}>×</button>
			</div>
			<div class="flex-1 overflow-y-auto" style="padding: 7px 10px 0 15px;">
				{#if activePanel === 'paragraph'}
					<div class="flex flex-col gap-3">
						<div class="settings-section">
							<div class="settings-label">Alignment</div>
							<div class="flex gap-1">
								{#each [{align:'left',icon:'btn-align-left',title:'Left'},{align:'center',icon:'btn-align-center',title:'Center'},{align:'right',icon:'btn-align-right',title:'Right'},{align:'both',icon:'btn-align-just',title:'Justify'}] as item}
									<button class="toolbar-btn-sm {currentAlign === item.align ? 'bg-[var(--color-toolbar-hover)]' : ''}" title={item.title} onclick={() => applyAlign(item.align)}>
										<Icon name={item.icon} />
									</button>
								{/each}
							</div>
						</div>
						<div class="settings-section">
							<div class="settings-label">Indentation (cm)</div>
							<div class="flex gap-2">
								<div class="flex flex-col gap-0.5">
									<span class="text-[9px] text-[var(--color-text-tertiary)]">Left</span>
									<input type="number" class="settings-input" bind:value={indentLeft} min="0" step="0.1" onchange={applyIndent} />
								</div>
								<div class="flex flex-col gap-0.5">
									<span class="text-[9px] text-[var(--color-text-tertiary)]">Right</span>
									<input type="number" class="settings-input" bind:value={indentRight} min="0" step="0.1" onchange={applyIndent} />
								</div>
								<div class="flex flex-col gap-0.5">
									<span class="text-[9px] text-[var(--color-text-tertiary)]">First line</span>
									<input type="number" class="settings-input" bind:value={indentFirst} step="0.1" onchange={applyIndent} />
								</div>
							</div>
						</div>
						<div class="settings-section">
							<div class="settings-label">Spacing (pt)</div>
							<div class="flex gap-2">
								<div class="flex flex-col gap-0.5">
									<span class="text-[9px] text-[var(--color-text-tertiary)]">Before</span>
									<input type="number" class="settings-input" bind:value={spacingBefore} min="0" step="1" onchange={applySpacing} />
								</div>
								<div class="flex flex-col gap-0.5">
									<span class="text-[9px] text-[var(--color-text-tertiary)]">After</span>
									<input type="number" class="settings-input" bind:value={spacingAfter} min="0" step="1" onchange={applySpacing} />
								</div>
							</div>
						</div>
						<div class="settings-section">
							<div class="settings-label">Line Spacing</div>
							<select class="w-full settings-input" bind:value={lineSpacing} onchange={applySpacing}>
								<option value="240">Single</option>
								<option value="276">1.15</option>
								<option value="360">1.5</option>
								<option value="480">Double</option>
								<option value="600">2.5</option>
								<option value="720">Triple</option>
							</select>
						</div>
					</div>
				{:else if activePanel === 'table'}
					<div class="text-[11px] text-[var(--color-text-tertiary)] text-center py-8">Select a table to see its settings</div>
				{:else if activePanel === 'image'}
					<div class="text-[11px] text-[var(--color-text-tertiary)] text-center py-8">Select an image to see its settings</div>
				{:else if activePanel === 'shape'}
					<div class="text-[11px] text-[var(--color-text-tertiary)] text-center py-8">Select a shape to see its settings</div>
				{/if}
			</div>
		</div>
	{/if}
	<div class="w-[var(--spacing-sidebar-width)] bg-[var(--color-sidebar-bg)] border-l border-[var(--color-toolbar-border)] flex flex-col items-center pt-1 gap-0.5">
		{#each buttons as btn}
			<button class="w-[32px] h-[32px] flex items-center justify-center rounded-[3px] transition-all cursor-pointer {activePanel === btn.id ? 'bg-[var(--color-toolbar-hover)]' : 'hover:bg-[var(--color-toolbar-hover)]'}" title={btn.title} onclick={() => toggle(btn.id)}>
				<Icon name={btn.icon} />
			</button>
		{/each}
	</div>
</div>

<style>
	.settings-section { display: flex; flex-direction: column; gap: 4px; }
	.settings-label { font-size: 11px; font-weight: 500; color: var(--color-text-primary); }
	.settings-input { height: var(--spacing-form-control); font-size: 11px; border: 1px solid var(--color-toolbar-border); border-radius: 3px; padding: 0 4px; background: white; color: var(--color-text-primary); width: 60px; }
	.settings-input:focus { outline: none; border-color: var(--color-accent); }
</style>
