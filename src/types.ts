export interface ReactionsOptions {
	votes: boolean | "up-only";
	reactions: boolean;
	selectors: {
		post: string;
		reactionsContainer: string;
	};
	pidFn: ({
		post,
		reactionsContainer
	}: {
		post: HTMLElement;
		reactionsContainer: HTMLElement;
	}) => string;
	server: string;
}

export interface OptimisticUpdateResult {
	updateId: string;
	commit: () => void;
	rollback: () => void;
}

export interface PostElements {
	post: HTMLElement;
	reactionsContainer: HTMLElement;
	votes: HTMLElement;
	upvote: HTMLElement | null;
	downvote: HTMLElement | null;
	reactions?: HTMLElement;
}

export interface UserInfo {
	userId: number;
}

export interface UserChoices {
	votes: Map<string, "like" | "dislike" | null>;
	reactions: Map<string, string | null>;
}

export interface LoadingStates {
	votes: Set<string>;
	reactions: Set<string>;
}

export interface ReactionData {
	id: number;
	userId: number;
	forumUrl: string;
	topicId: number;
	postId: number;
	reaction: string;
	userName: string;
	createdAt: string;
	updatedAt: string;
}

export interface VoteData {
	id: number;
	userId: number;
	forumUrl: string;
	topicId: number;
	postId: number;
	voteType: "like" | "dislike";
	userName: string;
	createdAt: string;
	updatedAt: string;
}

export interface ReactionIcons {
	[key: string]: string;
}
