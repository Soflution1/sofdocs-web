<script lang="ts">
	interface Props {
		onconfirm: (name: string) => void;
		onclose: () => void;
	}

	let { onconfirm, onclose }: Props = $props();
	let name = $state('');

	function handleSubmit() {
		if (name.trim().length > 0) {
			onconfirm(name.trim());
		}
		onclose();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 bg-black/30 z-[200] flex items-center justify-center" onkeydown={(e) => e.key === 'Escape' && onclose()}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="bg-white rounded-xl shadow-2xl w-[360px] p-6" onclick={(e) => e.stopPropagation()}>
		<h3 class="text-[14px] font-semibold text-[var(--color-text-primary)] mb-4">Insert Bookmark</h3>
		<div class="flex flex-col gap-3">
			<div>
				<label class="text-[11px] font-medium text-[var(--color-text-secondary)] mb-1 block" for="bk-name">Bookmark Name</label>
				<input
					id="bk-name"
					type="text"
					bind:value={name}
					class="w-full h-[32px] border border-[var(--color-toolbar-border)] rounded-lg px-3 text-[12px] focus:outline-none focus:border-[var(--color-accent)]"
					placeholder="MyBookmark"
				/>
			</div>
			<div class="flex justify-end gap-2 mt-2">
				<button
					class="px-4 py-2 text-[12px] border border-[var(--color-toolbar-border)] rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
					onclick={onclose}
				>Cancel</button>
				<button
					class="px-4 py-2 text-[12px] bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 cursor-pointer transition-all"
					onclick={handleSubmit}
				>Insert</button>
			</div>
		</div>
	</div>
</div>
