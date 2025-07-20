import type { PostElements, VoteData, UserInfo } from "../types";
import type { ReactionsConfig } from "../config";
import type { ReactionsAPI } from "../api";
import type { StateManager } from "../state";
import { updateCountDisplay, getCurrentCount, toggleClass } from "../ui";
import { debounce } from "../utils/debounce";
import { ErrorNotifier } from "../utils/errors";

/**
 * Create vote UI elements for a post
 */
export function createVoteElements(
	config: ReactionsConfig,
	reactionsContainer: HTMLElement
): {
	votes: HTMLElement;
	upvote: HTMLElement | null;
	downvote: HTMLElement | null;
} {
	const votes = Object.assign(document.createElement("div"), {
		className: "reactions-votes"
	});

	let upvote: HTMLElement | null = null;
	let downvote: HTMLElement | null = null;

	if (config.votes) {
		upvote = Object.assign(document.createElement("div"), {
			className: "reactions-votes-button reactions-votes-button-upvote",
			innerHTML: `
				<div class="reactions-votes-icon">👍</div>
				<div class="reactions-votes-count" data-count="0">0</div>
			`
		});
		votes.appendChild(upvote);

		if (config.votes === true) {
			downvote = Object.assign(document.createElement("div"), {
				className: "reactions-votes-button reactions-votes-button-downvote",
				innerHTML: `
					<div class="reactions-votes-icon">👎</div>
					<div class="reactions-votes-count" data-count="0">0</div>
				`
			});
			votes.appendChild(downvote);
		}

		reactionsContainer.appendChild(votes);
	}

	return { votes, upvote, downvote };
}

/**
 * Update vote UI manually (when optimistic updates are disabled)
 */
function updateVoteUI(
	elements: PostElements,
	voteType: "like" | "dislike",
	isRemoving: boolean,
	previousUserVote: "like" | "dislike" | null
): void {
	if (voteType === "like") {
		toggleClass(elements.upvote!, "reactions-user-choice", !isRemoving);
		if (elements.downvote) {
			elements.downvote.classList.remove("reactions-user-choice");
		}

		if (previousUserVote === "dislike" && !isRemoving) {
			// Switching from dislike to like
			if (elements.downvote) {
				const downCountEl = elements.downvote.querySelector(
					".reactions-votes-count"
				) as HTMLElement;
				const currentDownCount = getCurrentCount(downCountEl);
				updateCountDisplay(downCountEl, Math.max(0, currentDownCount - 1));
			}
			const upCountEl = elements.upvote!.querySelector(
				".reactions-votes-count"
			) as HTMLElement;
			const currentUpCount = getCurrentCount(upCountEl);
			updateCountDisplay(upCountEl, currentUpCount + 1);
		} else {
			// Simple toggle
			const countEl = elements.upvote!.querySelector(
				".reactions-votes-count"
			) as HTMLElement;
			const currentCount = getCurrentCount(countEl);
			const newCount = isRemoving
				? Math.max(0, currentCount - 1)
				: currentCount + 1;
			updateCountDisplay(countEl, newCount);
		}
	} else {
		toggleClass(elements.downvote!, "reactions-user-choice", !isRemoving);
		if (elements.upvote) {
			elements.upvote.classList.remove("reactions-user-choice");
		}

		if (previousUserVote === "like" && !isRemoving) {
			// Switching from like to dislike
			if (elements.upvote) {
				const upCountEl = elements.upvote.querySelector(
					".reactions-votes-count"
				) as HTMLElement;
				const currentUpCount = getCurrentCount(upCountEl);
				updateCountDisplay(upCountEl, Math.max(0, currentUpCount - 1));
			}
			const downCountEl = elements.downvote!.querySelector(
				".reactions-votes-count"
			) as HTMLElement;
			const currentDownCount = getCurrentCount(downCountEl);
			updateCountDisplay(downCountEl, currentDownCount + 1);
		} else {
			// Simple toggle
			const countEl = elements.downvote!.querySelector(
				".reactions-votes-count"
			) as HTMLElement;
			const currentCount = getCurrentCount(countEl);
			const newCount = isRemoving
				? Math.max(0, currentCount - 1)
				: currentCount + 1;
			updateCountDisplay(countEl, newCount);
		}
	}
}

/**
 * Add vote event handlers to a post
 */
export function addVoteEventHandlers(
	elements: PostElements,
	pid: string,
	topicId: string,
	api: ReactionsAPI,
	stateManager: StateManager,
	config: ReactionsConfig
): void {
	const errorNotifier = ErrorNotifier.getInstance();

	// Create debounced vote handler
	const handleVote = debounce(async (voteType: "like" | "dislike") => {
		// Prevent multiple simultaneous requests
		if (stateManager.isVoteLoading(pid)) return;
		stateManager.setVoteLoading(pid, true);

		const isActive =
			voteType === "like"
				? elements.upvote!.classList.contains("reactions-user-choice")
				: elements.downvote!.classList.contains("reactions-user-choice");
		const currentUserVote = stateManager.getUserVote(pid);

		// Apply optimistic update if enabled
		let optimisticUpdate = null;
		if (config.ui.optimisticUpdates) {
			optimisticUpdate = stateManager.applyOptimisticVote(
				elements,
				pid,
				voteType,
				isActive
			);
		}

		try {
			const response = await api.put(`/topics/${topicId}/posts/${pid}/vote`, {
				type: isActive ? null : voteType
			});

			if (response.ok) {
				// Update user choice tracking
				const newVote = isActive ? null : voteType;
				stateManager.setUserVote(pid, newVote);

				// Commit optimistic update
				if (optimisticUpdate) {
					optimisticUpdate.commit();
				} else {
					// Manual UI update if optimistic updates are disabled
					updateVoteUI(elements, voteType, isActive, currentUserVote);
				}
			} else {
				throw new Error(`Vote request failed with status ${response.status}`);
			}
		} catch (error) {
			// Rollback optimistic update on error
			if (optimisticUpdate) {
				optimisticUpdate.rollback();
			}

			if (config.ui.showErrorNotifications) {
				errorNotifier.showError(error as Error);
			}
			console.error("Failed to vote:", error);
		} finally {
			stateManager.setVoteLoading(pid, false);
		}
	}, config.performance.debounceMs);

	// Handle upvote clicks
	if (elements.upvote) {
		elements.upvote.addEventListener("click", (event) => {
			event.preventDefault();
			event.stopPropagation();
			handleVote("like");
		});
	}

	// Handle downvote clicks
	if (elements.downvote) {
		elements.downvote.addEventListener("click", (event) => {
			event.preventDefault();
			event.stopPropagation();
			handleVote("dislike");
		});
	}
}

/**
 * Process vote data from server and update UI
 */
export function processVoteData(
	data: VoteData[],
	postsMap: Map<string, PostElements>,
	currentUser: UserInfo | null,
	stateManager: StateManager
): void {
	// Group votes by postId and vote type
	const votesByPost = new Map<string, { like: number; dislike: number }>();
	const userVotesByPost = new Map<string, string>();

	data.forEach((vote) => {
		const postId = vote.postId.toString();
		const voteType = vote.voteType; // "like" or "dislike"

		// Initialize post votes if not exists
		if (!votesByPost.has(postId)) {
			votesByPost.set(postId, { like: 0, dislike: 0 });
		}

		// Count votes by type
		const postVotes = votesByPost.get(postId)!;
		postVotes[voteType] = (postVotes[voteType] || 0) + 1;

		// Track current user's votes
		if (currentUser && vote.userId === currentUser.userId) {
			userVotesByPost.set(postId, voteType);
			// Initialize user choice tracking
			stateManager.setUserVote(postId, voteType);
		}
	});

	// Update UI for each post
	postsMap.forEach((elements, pid) => {
		const postVotes = votesByPost.get(pid) || { like: 0, dislike: 0 };
		const userVote = userVotesByPost.get(pid);

		// Update upvote
		if (elements.upvote) {
			const countEl = elements.upvote.querySelector(
				".reactions-votes-count"
			) as HTMLElement;
			updateCountDisplay(countEl, postVotes.like);

			// Mark user's choice
			toggleClass(
				elements.upvote,
				"reactions-user-choice",
				userVote === "like"
			);
		}

		// Update downvote
		if (elements.downvote) {
			const countEl = elements.downvote.querySelector(
				".reactions-votes-count"
			) as HTMLElement;
			updateCountDisplay(countEl, postVotes.dislike);

			// Mark user's choice
			toggleClass(
				elements.downvote,
				"reactions-user-choice",
				userVote === "dislike"
			);
		}
	});
}
