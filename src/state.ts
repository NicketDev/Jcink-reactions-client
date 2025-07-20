import type {
	UserChoices,
	LoadingStates,
	PostElements,
	OptimisticUpdateResult
} from "./types";
import { OptimisticUpdateManager } from "./utils/optimistic";

/**
 * State manager for tracking user choices and loading states
 */
export class StateManager {
	private userChoices: UserChoices;
	private loadingStates: LoadingStates;
	private optimisticManager: OptimisticUpdateManager;

	constructor() {
		this.userChoices = {
			votes: new Map(),
			reactions: new Map()
		};
		this.loadingStates = {
			votes: new Set(),
			reactions: new Set()
		};
		this.optimisticManager = new OptimisticUpdateManager();
	}

	// User Choices Management
	setUserVote(pid: string, vote: "like" | "dislike" | null): void {
		this.userChoices.votes.set(pid, vote);
	}

	getUserVote(pid: string): "like" | "dislike" | null {
		return this.userChoices.votes.get(pid) || null;
	}

	setUserReaction(pid: string, reaction: string | null): void {
		this.userChoices.reactions.set(pid, reaction);
	}

	getUserReaction(pid: string): string | null {
		return this.userChoices.reactions.get(pid) || null;
	}

	// Loading States Management
	isVoteLoading(pid: string): boolean {
		return this.loadingStates.votes.has(pid);
	}

	setVoteLoading(pid: string, loading: boolean): void {
		if (loading) {
			this.loadingStates.votes.add(pid);
		} else {
			this.loadingStates.votes.delete(pid);
		}
	}

	isReactionLoading(pid: string): boolean {
		return this.loadingStates.reactions.has(pid);
	}

	setReactionLoading(pid: string, loading: boolean): void {
		if (loading) {
			this.loadingStates.reactions.add(pid);
		} else {
			this.loadingStates.reactions.delete(pid);
		}
	}

	// Optimistic Updates Management
	applyOptimisticVote(
		elements: PostElements,
		postId: string,
		voteType: "like" | "dislike",
		isRemoving: boolean
	): OptimisticUpdateResult {
		const previousUserVote = this.getUserVote(postId);
		const updateId = this.optimisticManager.applyVoteUpdate(
			elements,
			postId,
			voteType,
			isRemoving,
			previousUserVote
		);

		return {
			updateId,
			commit: () => this.optimisticManager.commit(updateId),
			rollback: () => this.optimisticManager.rollback(updateId)
		};
	}

	applyOptimisticReaction(
		elements: PostElements,
		postId: string,
		reactionName: string,
		isRemoving: boolean
	): OptimisticUpdateResult {
		const previousUserReaction = this.getUserReaction(postId);
		const updateId = this.optimisticManager.applyReactionUpdate(
			elements,
			postId,
			reactionName,
			isRemoving,
			previousUserReaction
		);

		return {
			updateId,
			commit: () => this.optimisticManager.commit(updateId),
			rollback: () => this.optimisticManager.rollback(updateId)
		};
	}

	rollbackPost(postId: string): void {
		this.optimisticManager.rollbackPost(postId);
	}
}
