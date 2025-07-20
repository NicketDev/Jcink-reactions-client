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

export default async function Reactions(userConfig?: Partial<ReactionsConfig>) {
	// Create validated configuration with user overrides
	const config = createConfig(userConfig);

	// Extract topic ID from URL
	const currentUrl = new URL(location.href);
	const topicId =
		currentUrl.searchParams.get("showtopic") ||
		(currentUrl.searchParams.get("act") === "ST"
			? currentUrl.searchParams.get("t")
			: null);
	if (!topicId) return;

	// Get current user information
	const currentUser = getCurrentUser();

	// Initialize styles
	initializeStyles(cssStyles);

	// Initialize API and state manager
	const api = new ReactionsAPI(config, topicId);
	const stateManager = new StateManager();

	// Create post elements map
	const postsMap = new Map<string, PostElements>();

	// Process all posts on the page
	const posts = document.querySelectorAll(
		config.selectors.post
	) as NodeListOf<HTMLElement>;
	posts.forEach((post) => {
		const reactionsContainer = post.querySelector(
			config.selectors.reactionsContainer
		) as HTMLElement;
		if (!reactionsContainer) return;

		reactionsContainer.style.position = "relative";

		// Create vote elements
		const { votes, upvote, downvote } = createVoteElements(
			config,
			reactionsContainer
		);

		// Create reaction elements
		const reactions = createReactionElements(config, reactionsContainer);

		// Store elements
		const elements: PostElements = {
			post,
			reactionsContainer,
			votes,
			upvote,
			downvote,
			reactions: reactions || undefined
		};

		const pid = config.pidFn(elements);
		postsMap.set(pid, elements);

		// Add event handlers
		addVoteEventHandlers(elements, pid, topicId, api, stateManager, config);
		addReactionEventHandlers(elements, pid, topicId, api, stateManager, config);
	});

	// Load existing data from server
	const allPids = Array.from(postsMap.keys());

	// Load reactions data
	if (config.reactions) {
		try {
			const response = await api.get("/reactions", {
				query: { postIds: allPids.join(",") }
			});
			const data = await response.json();
			processReactionData(data, postsMap, currentUser, stateManager);
		} catch (error) {
			console.error("Failed to load reactions:", error);
		}
	}

	// Load votes data
	if (config.votes) {
		try {
			const response = await api.get("/votes", {
				query: { postIds: allPids.join(",") }
			});
			const data = await response.json();
			processVoteData(data, postsMap, currentUser, stateManager);
		} catch (error) {
			console.error("Failed to load votes:", error);
		}
	}
}

// @ts-ignore
window.Reactions = Reactions;
