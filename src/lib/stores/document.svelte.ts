export interface DocumentState {
	fileName: string;
	html: string;
	plainText: string;
	wordCount: number;
	paragraphCount: number;
	isLoaded: boolean;
	isLoading: boolean;
	isDirty: boolean;
}

const defaultState: DocumentState = {
	fileName: '',
	html: '',
	plainText: '',
	wordCount: 0,
	paragraphCount: 0,
	isLoaded: false,
	isLoading: false,
	isDirty: false
};

let documentState = $state<DocumentState>({ ...defaultState });

export function getDocumentState() {
	return documentState;
}

export function setDocumentLoading(fileName: string) {
	documentState.fileName = fileName;
	documentState.isLoading = true;
	documentState.isLoaded = false;
	documentState.isDirty = false;
}

export function setDocumentContent(html: string, plainText: string, wordCount: number, paragraphCount: number) {
	documentState.html = html;
	documentState.plainText = plainText;
	documentState.wordCount = wordCount;
	documentState.paragraphCount = paragraphCount;
	documentState.isLoading = false;
	documentState.isLoaded = true;
}

export function updateDocumentHtml(html: string) {
	documentState.html = html;
	documentState.isDirty = true;
}

export function setDirty(dirty: boolean) {
	documentState.isDirty = dirty;
}

export function resetDocument() {
	Object.assign(documentState, defaultState);
}
