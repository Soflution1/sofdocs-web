<script lang="ts">
	import Toolbar from '$lib/components/toolbar/toolbar.svelte';
	import EditorCanvas from '$lib/components/editor/editor-canvas.svelte';
	import LeftMenu from '$lib/components/sidebar/left-menu.svelte';
	import RightMenu from '$lib/components/sidebar/right-menu.svelte';
	import Statusbar from '$lib/components/statusbar/statusbar.svelte';
	import { getDocumentState, setDocumentLoading, setDocumentContent } from '$lib/stores/document.svelte';
	import { loadDocx, getPlainText, getWordCount, getParagraphCount } from '$lib/wasm/loader';

	const doc = getDocumentState();
	let fileInput: HTMLInputElement | undefined = $state();
	let dragOver = $state(false);

	async function handleFile(file: File) {
		if (!file.name.endsWith('.docx')) {
			alert('Only .docx files are supported.');
			return;
		}

		setDocumentLoading(file.name);

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

	function onFileSelected(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) handleFile(file);
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files[0];
		if (file) handleFile(file);
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function onDragLeave() {
		dragOver = false;
	}
</script>

<div
	class="flex flex-col h-screen w-screen overflow-hidden"
	ondrop={onDrop}
	ondragover={onDragOver}
	ondragleave={onDragLeave}
	role="application"
>
	<Toolbar />

	<div class="flex flex-1 overflow-hidden relative">
		<LeftMenu />
		<EditorCanvas />
		<RightMenu />

		{#if dragOver}
			<div class="absolute inset-0 bg-[var(--color-accent)]/10 border-2 border-dashed border-[var(--color-accent)] z-50 flex items-center justify-center">
				<div class="text-center">
					<div class="text-4xl mb-2">📄</div>
					<p class="text-sm font-medium text-[var(--color-accent)]">Drop .docx file here</p>
				</div>
			</div>
		{/if}
	</div>

	<Statusbar />

	{#if !doc.isLoaded && !doc.isLoading}
		<div class="fixed bottom-12 left-1/2 -translate-x-1/2 z-40">
			<input
				bind:this={fileInput}
				type="file"
				accept=".docx"
				onchange={onFileSelected}
				class="hidden"
			/>
			<button
				class="px-6 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium rounded-xl shadow-lg transition-all cursor-pointer"
				onclick={() => fileInput?.click()}
			>
				Open .docx file
			</button>
		</div>
	{/if}
</div>
