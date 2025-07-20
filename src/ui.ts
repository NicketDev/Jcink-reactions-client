/**
 * Initialize CSS styles for the reactions system
 */
export function initializeStyles(cssStyles: string): void {
	const style = document.createElement("style");
	style.textContent = cssStyles;
	document.head.appendChild(style);
}

/**
 * Update a count display element
 */
export function updateCountDisplay(
	element: HTMLElement | null,
	count: number
): void {
	if (!element) return;

	element.textContent = count.toString();
	element.setAttribute("data-count", count.toString());
}

/**
 * Get current count from a count display element
 */
export function getCurrentCount(element: HTMLElement | null): number {
	if (!element) return 0;

	return parseInt(element.getAttribute("data-count") || "0");
}

/**
 * Add or remove a CSS class based on a condition
 */
export function toggleClass(
	element: HTMLElement,
	className: string,
	condition: boolean
): void {
	if (condition) {
		element.classList.add(className);
	} else {
		element.classList.remove(className);
	}
}

/**
 * Remove a CSS class from all elements in a collection
 */
export function removeClassFromAll(
	elements: NodeListOf<Element> | Element[],
	className: string
): void {
	elements.forEach((element) => element.classList.remove(className));
}
