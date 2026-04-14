export interface EditorSelection {
	startPara: number;
	startOffset: number;
	endPara: number;
	endOffset: number;
	collapsed: boolean;
}

let selectionState = $state<EditorSelection>({
	startPara: 0,
	startOffset: 0,
	endPara: 0,
	endOffset: 0,
	collapsed: true
});

export function getSelectionState() {
	return selectionState;
}

export function updateSelection(sel: EditorSelection) {
	selectionState.startPara = sel.startPara;
	selectionState.startOffset = sel.startOffset;
	selectionState.endPara = sel.endPara;
	selectionState.endOffset = sel.endOffset;
	selectionState.collapsed = sel.collapsed;
}
