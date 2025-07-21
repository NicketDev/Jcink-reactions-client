import type {
	PostElements,
	ReactionData,
	UserInfo,
	ReactionIcons
} from "../types";
import type { ReactionsConfig } from "../config";
import type { ReactionsAPI } from "../api";
import type { StateManager } from "../state";
import {
	updateCountDisplay,
	getCurrentCount,
	toggleClass,
	removeClassFromAll
} from "../ui";

const REACTION_ICONS: ReactionIcons = {
	heart: "❤️",
	smile: "😊",
	laughing: "😂",
	clap: "👏",
	sad: "😢",
	thumbsup: "👍",
	thumbsdown: "👎",
	angry: "😠",
	surprised: "😮",
	prayer: "🙏"
};

/**
 * Create reaction UI elements for a post with compact and expanded views
 */
export function createReactionElements(
	config: ReactionsConfig,
	reactionsContainer: HTMLElement
): HTMLElement | null {
	if (!config.reactions) return null;

	const reactions = Object.assign(document.createElement("div"), {
		className: "reactions-reactions"
	});

	// Create compact view container
	const compactView = Object.assign(document.createElement("div"), {
		className: "reactions-compact-view"
	});

	// Create add reaction button (shown when no reactions exist)
	const addReactionButton = Object.assign(document.createElement("div"), {
		className: "reactions-add-button",
		innerHTML: `<div class="reactions-add-button-icon">😊</div>`,
		title: "Add reaction"
	});
	addReactionButton.setAttribute("role", "button");
	addReactionButton.setAttribute("tabindex", "0");

	// Create compact reactions container (shown when reactions exist)
	const compactReactions = Object.assign(document.createElement("div"), {
		className: "reactions-compact-reactions"
	});

	compactView.appendChild(addReactionButton);
	compactView.appendChild(compactReactions);

	// Create expanded view container (shown on hover)
	const expandedView = Object.assign(document.createElement("div"), {
		className: "reactions-expanded-view"
	});

	const optionsContainer = Object.assign(document.createElement("div"), {
		className: "reactions-reactions-options"
	});

	Object.entries(config.customization.reactionIcons).forEach(
		([reaction, icon]) => {
			const option = document.createElement("div");
			option.className = "reactions-reactions-option";
			option.innerHTML = `<div class="reactions-reactions-option-icon">${icon}</div>
			<div class="reactions-reactions-option-count" data-count="0">0</div>`;
			option.setAttribute("aria-label", reaction);
			option.setAttribute("role", "button");
			option.setAttribute("tabindex", "0");
			optionsContainer.appendChild(option);

			// Also create compact version for when this reaction has count > 0
			const compactOption = document.createElement("div");
			compactOption.className = "reactions-compact-option";
			compactOption.innerHTML = `<div class="reactions-compact-option-icon">${icon}</div>
			<div class="reactions-compact-option-count" data-count="0">0</div>`;
			compactOption.setAttribute("aria-label", reaction);
			compactOption.setAttribute("role", "button");
			compactOption.setAttribute("tabindex", "0");
			compactReactions.appendChild(compactOption);
		}
	);

	expandedView.appendChild(optionsContainer);
	reactions.appendChild(compactView);
	reactions.appendChild(expandedView);

	reactionsContainer.appendChild(reactions);

	return reactions;
}

/**
 * Add reaction event handlers to a post
 */
export function addReactionEventHandlers(
	elements: PostElements,
	pid: string,
	topicId: string,
	api: ReactionsAPI,
	stateManager: StateManager,
	config: ReactionsConfig
): void {
	if (!elements.reactions) return;

	// Get all reaction options from both views
	const expandedOptions = elements.reactions.querySelectorAll(
		".reactions-reactions-option"
	);
	const compactOptions = elements.reactions.querySelectorAll(
		".reactions-compact-option"
	);
	const addButton = elements.reactions.querySelector(".reactions-add-button");

	// Handle clicks on all reaction options (both compact and expanded)
	const allOptions = [
		...Array.from(expandedOptions),
		...Array.from(compactOptions)
	];

	allOptions.forEach((option) => {
		option.addEventListener("click", async (event) => {
			// Prevent event bubbling and multiple triggers
			event.preventDefault();
			event.stopPropagation();

			// Prevent multiple simultaneous requests
			if (stateManager.isReactionLoading(pid)) return;
			stateManager.setReactionLoading(pid, true);

			try {
				const reactionName = option.getAttribute("aria-label")!;
				const isActive = option.classList.contains("reactions-user-choice");
				const currentUserReaction = stateManager.getUserReaction(pid);

				const response = await api.put(
					`/topics/${topicId}/posts/${pid}/reaction`,
					{
						reaction: isActive ? null : reactionName
					}
				);

				if (response.ok) {
					// Update user choice tracking
					const newReaction = isActive ? null : reactionName;
					stateManager.setUserReaction(pid, newReaction);

					// Update UI states for both views
					removeClassFromAll(
						[...Array.from(expandedOptions), ...Array.from(compactOptions)],
						"reactions-user-choice"
					);
					if (!isActive) {
						// Mark as active in both views
						const expandedOption = Array.from(expandedOptions).find(
							(opt) => opt.getAttribute("aria-label") === reactionName
						);
						const compactOption = Array.from(compactOptions).find(
							(opt) => opt.getAttribute("aria-label") === reactionName
						);

						if (expandedOption)
							expandedOption.classList.add("reactions-user-choice");
						if (compactOption)
							compactOption.classList.add("reactions-user-choice");
					}

					// Handle count updates based on the state transition
					if (currentUserReaction && currentUserReaction !== reactionName) {
						// Switching from one reaction to another
						updateReactionCounts(
							expandedOptions,
							compactOptions,
							currentUserReaction,
							-1
						);
						updateReactionCounts(
							expandedOptions,
							compactOptions,
							reactionName,
							1
						);
					} else if (currentUserReaction === reactionName) {
						// Removing current reaction (clicking same reaction again)
						updateReactionCounts(
							expandedOptions,
							compactOptions,
							reactionName,
							-1
						);
					} else if (!currentUserReaction) {
						// Adding new reaction (no previous reaction)
						updateReactionCounts(
							expandedOptions,
							compactOptions,
							reactionName,
							1
						);
					}

					// Update compact view visibility
					if (elements.reactions) {
						updateCompactViewVisibility(elements.reactions);
					}
				}
			} catch (error) {
				console.error("Failed to react:", error);
			} finally {
				stateManager.setReactionLoading(pid, false);
			}
		});
	});

	// Add button now just serves as a visual cue - expansion is handled by CSS hover
}

/**
 * Helper function to update counts in both expanded and compact views
 */
function updateReactionCounts(
	expandedOptions: NodeListOf<Element>,
	compactOptions: NodeListOf<Element>,
	reactionName: string,
	delta: number
): void {
	const updateOption = (option: Element) => {
		const countEl = option.querySelector(
			".reactions-reactions-option-count, .reactions-compact-option-count"
		) as HTMLElement;
		if (countEl) {
			const currentCount = getCurrentCount(countEl);
			const newCount = Math.max(0, currentCount + delta);
			updateCountDisplay(countEl, newCount);
		}
	};

	// Update expanded view
	const expandedOption = Array.from(expandedOptions).find(
		(opt) => opt.getAttribute("aria-label") === reactionName
	);
	if (expandedOption) updateOption(expandedOption);

	// Update compact view
	const compactOption = Array.from(compactOptions).find(
		(opt) => opt.getAttribute("aria-label") === reactionName
	);
	if (compactOption) updateOption(compactOption);
}

/**
 * Update visibility of compact view elements based on reaction counts
 */
function updateCompactViewVisibility(reactionsElement: HTMLElement): void {
	const addButton = reactionsElement.querySelector(
		".reactions-add-button"
	) as HTMLElement;
	const compactReactions = reactionsElement.querySelector(
		".reactions-compact-reactions"
	) as HTMLElement;
	const compactOptions = reactionsElement.querySelectorAll(
		".reactions-compact-option"
	) as NodeListOf<HTMLElement>;

	let hasActiveReactions = false;

	// Show/hide compact options based on count
	compactOptions.forEach((option) => {
		const countEl = option.querySelector(
			".reactions-compact-option-count"
		) as HTMLElement;
		const count = getCurrentCount(countEl);

		if (count > 0) {
			option.classList.add("reactions-active");
			hasActiveReactions = true;
		} else {
			option.classList.remove("reactions-active");
		}
	});

	// Show add button if no reactions, show compact reactions if reactions exist
	if (hasActiveReactions) {
		addButton.classList.add("reactions-hidden");
		compactReactions.classList.add("reactions-has-active");
	} else {
		addButton.classList.remove("reactions-hidden");
		compactReactions.classList.remove("reactions-has-active");
	}
}

/**
 * Process reaction data from server and update UI
 */
export function processReactionData(
	data: ReactionData[],
	postsMap: Map<string, PostElements>,
	currentUser: UserInfo | null,
	stateManager: StateManager
): void {
	// Group reactions by postId and reaction type
	const reactionsByPost = new Map<string, Map<string, number>>();
	const userReactionsByPost = new Map<string, string>();

	data.forEach((reaction) => {
		const postId = reaction.postId.toString();
		const reactionType = reaction.reaction;

		// Initialize post reactions if not exists
		if (!reactionsByPost.has(postId)) {
			reactionsByPost.set(postId, new Map());
		}

		// Count reactions by type
		const postReactions = reactionsByPost.get(postId)!;
		postReactions.set(reactionType, (postReactions.get(reactionType) || 0) + 1);

		// Track current user's reactions
		if (currentUser && reaction.userId === currentUser.userId) {
			userReactionsByPost.set(postId, reactionType);
			// Initialize user choice tracking
			stateManager.setUserReaction(postId, reactionType);
		}
	});

	// Update UI for each post
	postsMap.forEach((elements, pid) => {
		if (!elements.reactions) return;

		const postReactions = reactionsByPost.get(pid) || new Map();
		const userReaction = userReactionsByPost.get(pid);

		// Update expanded view reaction options
		const expandedOptions = elements.reactions.querySelectorAll(
			".reactions-reactions-option"
		);
		// Update compact view reaction options
		const compactOptions = elements.reactions.querySelectorAll(
			".reactions-compact-option"
		);

		expandedOptions.forEach((option) => {
			const reactionName = option.getAttribute("aria-label")!;
			const count = postReactions.get(reactionName) || 0;

			// Update count in expanded view
			const countEl = option.querySelector(
				".reactions-reactions-option-count"
			) as HTMLElement;
			updateCountDisplay(countEl, count);

			// Mark user's choice in expanded view
			toggleClass(
				option as HTMLElement,
				"reactions-user-choice",
				userReaction === reactionName
			);
		});

		compactOptions.forEach((option) => {
			const reactionName = option.getAttribute("aria-label")!;
			const count = postReactions.get(reactionName) || 0;

			// Update count in compact view
			const countEl = option.querySelector(
				".reactions-compact-option-count"
			) as HTMLElement;
			updateCountDisplay(countEl, count);

			// Mark user's choice in compact view
			toggleClass(
				option as HTMLElement,
				"reactions-user-choice",
				userReaction === reactionName
			);
		});

		// Update compact view visibility
		updateCompactViewVisibility(elements.reactions);
	});
}
