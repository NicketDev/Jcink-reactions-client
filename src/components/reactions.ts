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
import { debounce } from "../utils/debounce";
import { ErrorNotifier } from "../utils/errors";

const REACTION_ICONS: ReactionIcons = {
	heart: "❤️",
	laugh: "😂",
	clap: "👏",
	thinking: "🤔",
	sad: "😢",
	angry: "😠",
	confused: "😕",
	thumbsup: "👍",
	thumbsdown: "👎"
};

/**
 * Create reaction UI elements for a post
 */
export function createReactionElements(
	config: ReactionsConfig,
	reactionsContainer: HTMLElement
): HTMLElement | null {
	if (!config.reactions) return null;

	const reactions = Object.assign(document.createElement("div"), {
		className: "reactions-reactions"
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
		}
	);

	reactions.appendChild(optionsContainer);
	reactionsContainer.appendChild(reactions);

	return reactions;
}

/**
 * Update reaction UI manually (when optimistic updates are disabled)
 */
function updateReactionUI(
	elements: PostElements,
	reactionName: string,
	isRemoving: boolean,
	previousUserReaction: string | null
): void {
	if (!elements.reactions) return;

	const reactionOptions = elements.reactions.querySelectorAll(
		".reactions-reactions-option"
	);
	const targetOption = Array.from(reactionOptions).find(
		(opt) => opt.getAttribute("aria-label") === reactionName
	) as HTMLElement;

	if (!targetOption) return;

	// Remove active from all reactions
	removeClassFromAll(reactionOptions, "reactions-user-choice");

	if (!isRemoving) {
		targetOption.classList.add("reactions-user-choice");
	}

	// Update counts
	if (previousUserReaction && previousUserReaction !== reactionName) {
		// Switching reactions
		const oldOption = Array.from(reactionOptions).find(
			(opt) => opt.getAttribute("aria-label") === previousUserReaction
		) as HTMLElement;

		if (oldOption) {
			const oldCountEl = oldOption.querySelector(
				".reactions-reactions-option-count"
			) as HTMLElement;
			const oldCount = getCurrentCount(oldCountEl);
			updateCountDisplay(oldCountEl, Math.max(0, oldCount - 1));
		}

		const newCountEl = targetOption.querySelector(
			".reactions-reactions-option-count"
		) as HTMLElement;
		const newCount = getCurrentCount(newCountEl);
		updateCountDisplay(newCountEl, newCount + 1);
	} else {
		// Simple toggle
		const countEl = targetOption.querySelector(
			".reactions-reactions-option-count"
		) as HTMLElement;
		const currentCount = getCurrentCount(countEl);
		const newCount = isRemoving
			? Math.max(0, currentCount - 1)
			: currentCount + 1;
		updateCountDisplay(countEl, newCount);
	}
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

	const reactionOptions = elements.reactions.querySelectorAll(
		".reactions-reactions-option"
	);

	reactionOptions.forEach((option) => {
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

					// Update UI states
					removeClassFromAll(reactionOptions, "reactions-user-choice");
					if (!isActive) {
						option.classList.add("reactions-user-choice");
					}

					// Handle count updates based on the state transition
					if (currentUserReaction && currentUserReaction !== reactionName) {
						// Switching from one reaction to another
						// Decrease old reaction count, increase new reaction count
						const oldOption = Array.from(reactionOptions).find(
							(opt) => opt.getAttribute("aria-label") === currentUserReaction
						);
						if (oldOption) {
							const oldCountEl = oldOption.querySelector(
								".reactions-reactions-option-count"
							) as HTMLElement;
							const currentOldCount = getCurrentCount(oldCountEl);
							updateCountDisplay(oldCountEl, Math.max(0, currentOldCount - 1));
						}
						// Increment the new reaction
						const newCountEl = option.querySelector(
							".reactions-reactions-option-count"
						) as HTMLElement;
						const currentNewCount = getCurrentCount(newCountEl);
						updateCountDisplay(newCountEl, currentNewCount + 1);
					} else if (currentUserReaction === reactionName) {
						// Removing current reaction (clicking same reaction again)
						const countEl = option.querySelector(
							".reactions-reactions-option-count"
						) as HTMLElement;
						const currentCount = getCurrentCount(countEl);
						updateCountDisplay(countEl, Math.max(0, currentCount - 1));
					} else if (!currentUserReaction) {
						// Adding new reaction (no previous reaction)
						const countEl = option.querySelector(
							".reactions-reactions-option-count"
						) as HTMLElement;
						const currentCount = getCurrentCount(countEl);
						updateCountDisplay(countEl, currentCount + 1);
					}
				}
			} catch (error) {
				console.error("Failed to react:", error);
			} finally {
				stateManager.setReactionLoading(pid, false);
			}
		});
	});
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

		// Update reaction options
		const reactionOptions = elements.reactions.querySelectorAll(
			".reactions-reactions-option"
		);
		reactionOptions.forEach((option) => {
			const reactionName = option.getAttribute("aria-label")!;
			const count = postReactions.get(reactionName) || 0;

			// Update count
			const countEl = option.querySelector(
				".reactions-reactions-option-count"
			) as HTMLElement;
			updateCountDisplay(countEl, count);

			// Mark user's choice
			toggleClass(
				option as HTMLElement,
				"reactions-user-choice",
				userReaction === reactionName
			);
		});
	});
}
