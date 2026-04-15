<script lang="ts">
	import Icon from '$lib/components/ui/icon.svelte';
	import { getDocumentState, resetDocument, setDocumentLoading, setDocumentContent } from '$lib/stores/document.svelte';
	import { saveDocx, loadDocx, getPlainText, getWordCount, getParagraphCount } from '$lib/wasm/loader';

	interface Props {
		onclose: () => void;
	}

	let { onclose }: Props = $props();

	const doc = getDocumentState();

	let fileInput: HTMLInputElement | undefined = $state();

	async function handleSave() {
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
		onclose();
	}

	function handleNew() {
		resetDocument();
		onclose();
	}

	async function handleFileSelected(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file || !file.name.endsWith('.docx')) return;

		setDocumentLoading(file.name);
		onclose();

		try {
			const buffer = await file.arrayBuffer();
			const bytes = new Uint8Array(buffer);
			const html = await loadDocx(bytes);
			const plainText = await getPlainText();
			const wordCount = await getWordCount();
			const paragraphCount = await getParagraphCount();
			setDocumentContent(html, plainText, wordCount, paragraphCount);
		} catch (err) {
			alert(`Failed to parse document: ${err}`);
			setDocumentContent('', '', 0, 0);
		}
	}

	const menuItems = [
		{ icon: 'btn-save', label: 'New', description: 'Create a new document', action: handleNew },
		{ icon: 'btn-download', label: 'Open', description: 'Open an existing document', action: () => { fileInput?.click(); } },
		{ icon: 'btn-save', label: 'Save', description: 'Download the current document', action: handleSave },
		{ icon: 'btn-print', label: 'Print', description: 'Print the document', action: () => { window.print(); onclose(); } },
	];
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-[100] flex"
	onkeydown={(e) => e.key === 'Escape' && onclose()}
>
	<!-- Left panel -->
	<div class="w-[300px] bg-[var(--color-toolbar-header)] flex flex-col pt-2 shadow-xl">
		<div class="px-6 py-4">
			<h2 class="text-white text-lg font-semibold">SofDocs</h2>
		</div>

		<nav class="flex flex-col mt-2">
			{#each menuItems as item}
				<button
					class="flex items-center gap-4 px-6 py-3 text-white/90 hover:bg-white/10 transition-all cursor-pointer text-left"
					onclick={item.action}
				>
					<Icon name={item.icon} class="opacity-90 invert brightness-200" />
					<div>
						<div class="text-[13px] font-medium">{item.label}</div>
						<div class="text-[11px] text-white/60">{item.description}</div>
					</div>
				</button>
			{/each}
		</nav>

		<div class="mt-auto px-6 py-4 border-t border-white/10">
			<div class="text-white/50 text-[10px]">SofDocs v0.1.0</div>
			<div class="text-white/40 text-[9px]">Soflution LTD</div>
		</div>
	</div>

	<!-- Right area (click to close) -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="flex-1 bg-black/30 backdrop-blur-[2px]" onclick={onclose}></div>

	<input
		bind:this={fileInput}
		type="file"
		accept=".docx"
		onchange={handleFileSelected}
		class="hidden"
	/>
</div>
