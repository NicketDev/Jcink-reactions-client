// @ts-nocheck
import cssStyles from "./style.css" with { type: "text" };

import type { PostElements, UserInfo } from "./types";
import { createConfig, type ReactionsConfig } from "./config";
import { ReactionsAPI } from "./api";
import { getCurrentUser } from "./auth";
import { StateManager } from "./state";
import { initializeStyles } from "./ui";
import {
	createVoteElements,
	addVoteEventHandlers,
	processVoteData
} from "./components/votes";
import {
	createReactionElements,
	addReactionEventHandlers,
	processReactionData
} from "./components/reactions";
import { ErrorNotifier } from "./utils/errors";

/**
 * Extract topic ID from the current URL
 * @returns The topic ID if found, null otherwise
 */
function extractTopicId(): string | null {
	const currentUrl = new URL(location.href);
	return (
		currentUrl.searchParams.get("showtopic") ||
		(currentUrl.searchParams.get("act") === "ST"
			? currentUrl.searchParams.get("t")
			: null)
	);
}

/**
 * Initialize and configure a post's reaction elements
 * @param postElement - The DOM element representing the post
 * @param config - The reactions configuration
 * @param postsMap - Map to store post elements by ID
 * @param topicId - The current topic ID
 * @param api - The reactions API instance
 * @param stateManager - The state manager instance
 * @returns The post ID if successfully processed, null otherwise
 */
function initializePostElements(
	postElement: HTMLElement,
	config: ReactionsConfig,
	postsMap: Map<string, PostElements>,
	topicId: string,
	api: ReactionsAPI,
	stateManager: StateManager
): string | null {
	const reactionsContainer = postElement.querySelector(
		config.selectors.reactionsContainer
	) as HTMLElement;

	if (!reactionsContainer) {
		return null;
	}

	// Ensure container is properly positioned for reactions UI
	reactionsContainer.style.position = "relative";

	// Create UI elements
	const { votes, upvote, downvote } = createVoteElements(
		config,
		reactionsContainer
	);
	const reactions = createReactionElements(config, reactionsContainer);

	// Assemble post elements
	const elements: PostElements = {
		post: postElement,
		reactionsContainer,
		votes,
		upvote,
		downvote,
		reactions: reactions || undefined
	};

	const postId = config.pidFn(elements);
	postsMap.set(postId, elements);

	// Attach event handlers
	addVoteEventHandlers(elements, postId, topicId, api, stateManager, config);
	addReactionEventHandlers(
		elements,
		postId,
		topicId,
		api,
		stateManager,
		config
	);

	return postId;
}

/**
 * Load and process reactions data from the server
 * @param api - The reactions API instance
 * @param postIds - Array of post IDs to load data for
 * @param postsMap - Map of post elements by ID
 * @param currentUser - Current user information
 * @param stateManager - The state manager instance
 */
async function loadReactionsData(
	api: ReactionsAPI,
	postIds: string[],
	postsMap: Map<string, PostElements>,
	currentUser: UserInfo | null,
	stateManager: StateManager
): Promise<void> {
	try {
		const response = await api.get("/reactions", {
			query: { postIds: postIds.join(",") }
		});
		const data = await response.json();
		processReactionData(data, postsMap, currentUser, stateManager);
	} catch (error) {
		console.error("Failed to load reactions:", error);
		ErrorNotifier.getInstance().showError(error as Error);
	}
}

/**
 * Load and process votes data from the server
 * @param api - The reactions API instance
 * @param postIds - Array of post IDs to load data for
 * @param postsMap - Map of post elements by ID
 * @param currentUser - Current user information
 * @param stateManager - The state manager instance
 */
async function loadVotesData(
	api: ReactionsAPI,
	postIds: string[],
	postsMap: Map<string, PostElements>,
	currentUser: UserInfo | null,
	stateManager: StateManager
): Promise<void> {
	try {
		const response = await api.get("/votes", {
			query: { postIds: postIds.join(",") }
		});
		const data = await response.json();
		processVoteData(data, postsMap, currentUser, stateManager);
	} catch (error) {
		console.error("Failed to load votes:", error);
		ErrorNotifier.getInstance().showError(error as Error);
	}
}

/**
 * Initialize the JCink Reactions system
 *
 * This is the main entry point that:
 * - Validates the current page context
 * - Sets up the configuration and dependencies
 * - Processes all posts on the page
 * - Loads existing data from the server
 *
 * @param userConfig - Optional configuration overrides
 * @returns Promise that resolves when initialization is complete
 */
export default async function Reactions(
	userConfig?: Partial<ReactionsConfig>
): Promise<void> {
	// Validate environment and extract topic ID
	const topicId = extractTopicId();
	if (!topicId) {
		return;
	}

	// Initialize configuration and dependencies
	const config = createConfig(userConfig);
	const currentUser = getCurrentUser();

	initializeStyles(cssStyles);

	const api = new ReactionsAPI(config, topicId);
	const stateManager = new StateManager();
	const postsMap = new Map<string, PostElements>();

	// Process all posts on the current page
	const allPostElements = document.querySelectorAll(
		config.selectors.post
	) as NodeListOf<HTMLElement>;

	const processedPostIds: string[] = [];

	allPostElements.forEach((postElement) => {
		const postId = initializePostElements(
			postElement,
			config,
			postsMap,
			topicId,
			api,
			stateManager
		);

		if (postId) {
			processedPostIds.push(postId);
		}
	});

	// Early return if no posts were successfully processed
	if (processedPostIds.length === 0) {
		return;
	}

	// Load existing data from server in parallel
	const dataLoadPromises: Promise<void>[] = [];

	if (config.reactions) {
		dataLoadPromises.push(
			loadReactionsData(
				api,
				processedPostIds,
				postsMap,
				currentUser,
				stateManager
			)
		);
	}

	if (config.votes) {
		dataLoadPromises.push(
			loadVotesData(api, processedPostIds, postsMap, currentUser, stateManager)
		);
	}

	// Wait for all data to load
	await Promise.allSettled(dataLoadPromises);
}

// Make the function globally available for integration
declare global {
	interface Window {
		Reactions: typeof Reactions;
	}
}

window.Reactions = Reactions;
