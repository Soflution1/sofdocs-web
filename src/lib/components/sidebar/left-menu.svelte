<script lang="ts">
	import Icon from '$lib/components/ui/icon.svelte';
	import { getDocumentState, updateDocumentHtml } from '$lib/stores/document.svelte';
	import { findText, replaceText, replaceAll } from '$lib/wasm/loader';

	const doc = getDocumentState();

	type LeftPanel = 'search' | 'comments' | 'navigation' | 'thumbnails' | null;
	let activePanel: LeftPanel = $state(null);

	function toggle(panel: LeftPanel) {
		activePanel = activePanel === panel ? null : panel;
	}

	const buttons: { id: LeftPanel; icon: string; title: string }[] = [
		{ id: 'search', icon: 'btn-replace', title: 'Search' },
		{ id: 'comments', icon: 'btn-bookmark', title: 'Comments' },
		{ id: 'navigation', icon: 'btn-multilevels', title: 'Navigation' },
		{ id: 'thumbnails', icon: 'btn-blankpage', title: 'Thumbnails' }
	];

	let searchQuery = $state('');
	let replaceQuery = $state('');
	let searchResults: Array<[number, number, number]> = $state([]);
	let currentResultIdx = $state(-1);

	async function doSearch() {
		if (!doc.isLoaded || !searchQuery) { searchResults = []; return; }
		const raw = await findText(searchQuery);
		try {
			searchResults = JSON.parse(raw);
			currentResultIdx = searchResults.length > 0 ? 0 : -1;
		} catch {
			searchResults = [];
			currentResultIdx = -1;
		}
	}

	function goNext() {
		if (searchResults.length === 0) return;
		currentResultIdx = (currentResultIdx + 1) % searchResults.length;
		scrollToResult();
	}

	function goPrev() {
		if (searchResults.length === 0) return;
		currentResultIdx = (currentResultIdx - 1 + searchResults.length) % searchResults.length;
		scrollToResult();
	}

	function scrollToResult() {
		if (currentResultIdx < 0 || currentResultIdx >= searchResults.length) return;
		const [para] = searchResults[currentResultIdx];
		const el = document.querySelector(`[data-para="${para}"]`);
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	async function doReplace() {
		if (currentResultIdx < 0 || currentResultIdx >= searchResults.length) return;
		const [para, offset, len] = searchResults[currentResultIdx];
		const html = await replaceText(para, offset, len, replaceQuery);
		updateDocumentHtml(html);
		await doSearch();
	}

	async function doReplaceAll() {
		if (!searchQuery) return;
		const result = await replaceAll(searchQuery, replaceQuery);
		const [countStr, ...htmlParts] = result.split('\n');
		const html = htmlParts.join('\n');
		if (html) updateDocumentHtml(html);
		searchResults = [];
		currentResultIdx = -1;
	}
</script>

<div class="flex h-full flex-shrink-0">
	<!-- Icon bar -->
	<div class="w-[var(--spacing-sidebar-width)] bg-[var(--color-sidebar-bg)] border-r border-[var(--color-toolbar-border)] flex flex-col items-center pt-1 gap-0.5">
		{#each buttons as btn}
			<button
				class="w-[32px] h-[32px] flex items-center justify-center rounded-[3px] transition-all cursor-pointer
					{activePanel === btn.id ? 'bg-[var(--color-toolbar-hover)]' : 'hover:bg-[var(--color-toolbar-hover)]'}"
				title={btn.title}
				onclick={() => toggle(btn.id)}
			>
				<Icon name={btn.icon} />
			</button>
		{/each}
	</div>

	<!-- Panel -->
	{#if activePanel}
		<div class="w-[var(--spacing-sidebar-panel-width)] bg-[var(--color-sidebar-bg)] border-r border-[var(--color-toolbar-border)] flex flex-col overflow-hidden">
			<div class="flex items-center justify-between h-[32px] px-3 border-b border-[var(--color-toolbar-border)] flex-shrink-0">
				<span class="text-[12px] font-medium text-[var(--color-text-primary)] capitalize">{activePanel}</span>
				<button
					class="w-[20px] h-[20px] flex items-center justify-center rounded-[3px] hover:bg-[var(--color-toolbar-hover)] cursor-pointer text-[var(--color-text-tertiary)] text-[14px]"
					onclick={() => (activePanel = null)}
				>×</button>
			</div>

			<div class="flex-1 overflow-y-auto p-3">
				{#if activePanel === 'search'}
					<div class="flex flex-col gap-2">
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Find..."
							class="w-full h-[28px] border border-[var(--color-toolbar-border)] rounded-[3px] px-2 text-[11px] focus:outline-none focus:border-[var(--color-accent)]"
							onkeydown={(e) => e.key === 'Enter' && doSearch()}
						/>
						<div class="flex gap-1">
							<button class="toolbar-btn-sm" title="Previous" onclick={goPrev}><Icon name="btn-arrow-up" /></button>
							<button class="toolbar-btn-sm" title="Next" onclick={goNext}><Icon name="btn-arrow-down" /></button>
							<span class="text-[10px] text-[var(--color-text-tertiary)] self-center ml-1">
								{#if searchResults.length > 0}
									{currentResultIdx + 1} / {searchResults.length}
								{:else if searchQuery}
									No results
								{/if}
							</span>
						</div>
						<div class="border-t border-[var(--color-toolbar-border)] pt-2 mt-1">
							<input
								type="text"
								bind:value={replaceQuery}
								placeholder="Replace with..."
								class="w-full h-[28px] border border-[var(--color-toolbar-border)] rounded-[3px] px-2 text-[11px] focus:outline-none focus:border-[var(--color-accent)]"
							/>
							<div class="flex gap-1 mt-1.5">
								<button
									class="px-2 py-1 text-[10px] border border-[var(--color-toolbar-border)] rounded-[3px] hover:bg-[var(--color-toolbar-hover)] cursor-pointer"
									onclick={doReplace}
								>Replace</button>
								<button
									class="px-2 py-1 text-[10px] border border-[var(--color-toolbar-border)] rounded-[3px] hover:bg-[var(--color-toolbar-hover)] cursor-pointer"
									onclick={doReplaceAll}
								>Replace All</button>
							</div>
						</div>
					</div>
				{:else if activePanel === 'comments'}
					<div class="text-[11px] text-[var(--color-text-tertiary)] text-center py-8">
						No comments yet
					</div>
				{:else if activePanel === 'navigation'}
					<div class="text-[11px] text-[var(--color-text-tertiary)] text-center py-8">
						Document headings will appear here
					</div>
				{:else if activePanel === 'thumbnails'}
					<div class="text-[11px] text-[var(--color-text-tertiary)] text-center py-8">
						Page thumbnails will appear here
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
