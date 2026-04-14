export type ToolbarTab = 'home' | 'insert' | 'layout' | 'references' | 'view';

interface UIState {
	activeTab: ToolbarTab;
	zoom: number;
	leftSidebarOpen: boolean;
	rightSidebarOpen: boolean;
	currentPage: number;
	totalPages: number;
}

let uiState = $state<UIState>({
	activeTab: 'home',
	zoom: 100,
	leftSidebarOpen: false,
	rightSidebarOpen: false,
	currentPage: 1,
	totalPages: 1
});

export function getUIState() {
	return uiState;
}

export function setActiveTab(tab: ToolbarTab) {
	uiState.activeTab = tab;
}

export function setZoom(zoom: number) {
	uiState.zoom = Math.max(25, Math.min(400, zoom));
}

export function toggleLeftSidebar() {
	uiState.leftSidebarOpen = !uiState.leftSidebarOpen;
}

export function toggleRightSidebar() {
	uiState.rightSidebarOpen = !uiState.rightSidebarOpen;
}
