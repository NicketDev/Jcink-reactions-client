import type { PostElements } from "../types";
import {
	updateCountDisplay,
	getCurrentCount,
	toggleClass,
	removeClassFromAll
} from "../ui";

export interface OptimisticUpdate {
	id: string;
	type: "vote" | "reaction";
	postId: string;
	rollback: () => void;
}

/**
 * Manages optimistic updates with rollback capabilities
 */
export class OptimisticUpdateManager {
	private updates = new Map<string, OptimisticUpdate>();

	/**
	 * Apply optimistic vote update
	 */
	applyVoteUpdate(
		elements: PostElements,
		postId: string,
		voteType: "like" | "dislike",
		isRemoving: boolean,
		previousUserVote: "like" | "dislike" | null
	): string {
		const updateId = `vote-${postId}-${Date.now()}`;

		// Store current state for rollback
		const upvoteActive =
			elements.upvote?.classList.contains("reactions-user-choice") || false;
		const downvoteActive =
			elements.downvote?.classList.contains("reactions-user-choice") || false;
		const upvoteCount = elements.upvote
			? getCurrentCount(
					elements.upvote.querySelector(".reactions-votes-count") as HTMLElement
				)
			: 0;
		const downvoteCount = elements.downvote
			? getCurrentCount(
					elements.downvote.querySelector(
						".reactions-votes-count"
					) as HTMLElement
				)
			: 0;

		// Apply optimistic changes
		if (voteType === "like") {
			if (elements.upvote) {
				toggleClass(elements.upvote, "reactions-user-choice", !isRemoving);

				let newUpCount = upvoteCount;
				let newDownCount = downvoteCount;

				if (previousUserVote === "dislike" && !isRemoving) {
					// Switching from dislike to like
					newDownCount = Math.max(0, downvoteCount - 1);
					newUpCount = upvoteCount + 1;
					if (elements.downvote) {
						updateCountDisplay(
							elements.downvote.querySelector(
								".reactions-votes-count"
							) as HTMLElement,
							newDownCount
						);
					}
				} else {
					// Simple toggle
					newUpCount = isRemoving
						? Math.max(0, upvoteCount - 1)
						: upvoteCount + 1;
				}

				updateCountDisplay(
					elements.upvote.querySelector(
						".reactions-votes-count"
					) as HTMLElement,
					newUpCount
				);
			}

			if (elements.downvote) {
				elements.downvote.classList.remove("reactions-user-choice");
			}
		} else {
			if (elements.downvote) {
				toggleClass(elements.downvote, "reactions-user-choice", !isRemoving);

				let newUpCount = upvoteCount;
				let newDownCount = downvoteCount;

				if (previousUserVote === "like" && !isRemoving) {
					// Switching from like to dislike
					newUpCount = Math.max(0, upvoteCount - 1);
					newDownCount = downvoteCount + 1;
					if (elements.upvote) {
						updateCountDisplay(
							elements.upvote.querySelector(
								".reactions-votes-count"
							) as HTMLElement,
							newUpCount
						);
					}
				} else {
					// Simple toggle
					newDownCount = isRemoving
						? Math.max(0, downvoteCount - 1)
						: downvoteCount + 1;
				}

				updateCountDisplay(
					elements.downvote.querySelector(
						".reactions-votes-count"
					) as HTMLElement,
					newDownCount
				);
			}

			if (elements.upvote) {
				elements.upvote.classList.remove("reactions-user-choice");
			}
		}

		// Store rollback function
		const rollback = () => {
			if (elements.upvote) {
				toggleClass(elements.upvote, "reactions-user-choice", upvoteActive);
				updateCountDisplay(
					elements.upvote.querySelector(
						".reactions-votes-count"
					) as HTMLElement,
					upvoteCount
				);
			}
			if (elements.downvote) {
				toggleClass(elements.downvote, "reactions-user-choice", downvoteActive);
				updateCountDisplay(
					elements.downvote.querySelector(
						".reactions-votes-count"
					) as HTMLElement,
					downvoteCount
				);
			}
		};

		this.updates.set(updateId, {
			id: updateId,
			type: "vote",
			postId,
			rollback
		});

		return updateId;
	}

	/**
	 * Apply optimistic reaction update
	 */
	applyReactionUpdate(
		elements: PostElements,
		postId: string,
		reactionName: string,
		isRemoving: boolean,
		previousUserReaction: string | null
	): string {
		const updateId = `reaction-${postId}-${Date.now()}`;

		if (!elements.reactions) return updateId;

		const reactionOptions = elements.reactions.querySelectorAll(
			".reactions-reactions-option"
		);

		// Store current state for rollback
		const currentStates = Array.from(reactionOptions).map((option) => ({
			element: option as HTMLElement,
			active: option.classList.contains("reactions-user-choice"),
			count: getCurrentCount(
				option.querySelector(".reactions-reactions-option-count") as HTMLElement
			)
		}));

		// Apply optimistic changes
		const targetOption = Array.from(reactionOptions).find(
			(opt) => opt.getAttribute("aria-label") === reactionName
		) as HTMLElement;

		if (targetOption) {
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

		// Store rollback function
		const rollback = () => {
			currentStates.forEach(({ element, active, count }) => {
				toggleClass(element, "reactions-user-choice", active);
				updateCountDisplay(
					element.querySelector(
						".reactions-reactions-option-count"
					) as HTMLElement,
					count
				);
			});
		};

		this.updates.set(updateId, {
			id: updateId,
			type: "reaction",
			postId,
			rollback
		});

		return updateId;
	}

	/**
	 * Commit an optimistic update (remove from rollback tracking)
	 */
	commit(updateId: string): void {
		this.updates.delete(updateId);
	}

	/**
	 * Rollback an optimistic update
	 */
	rollback(updateId: string): void {
		const update = this.updates.get(updateId);
		if (update) {
			update.rollback();
			this.updates.delete(updateId);
		}
	}

	/**
	 * Rollback all updates for a specific post
	 */
	rollbackPost(postId: string): void {
		const postUpdates = Array.from(this.updates.values()).filter(
			(update) => update.postId === postId
		);

		postUpdates.forEach((update) => {
			update.rollback();
			this.updates.delete(update.id);
		});
	}

	/**
	 * Clear all pending updates
	 */
	clear(): void {
		this.updates.clear();
	}
}
