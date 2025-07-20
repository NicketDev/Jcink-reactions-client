import type { ReactionsOptions, ReactionIcons } from "./types";

export interface ReactionsConfig extends ReactionsOptions {
	// Performance settings
	performance: {
		debounceMs: number;
		cacheEnabled: boolean;
		cacheTTL: number;
		maxRetries: number;
		retryDelay: number;
		retryBackoff: "linear" | "exponential";
	};

	// UI/UX settings
	ui: {
		optimisticUpdates: boolean;
		showLoadingStates: boolean;
		animationDuration: number;
		showErrorNotifications: boolean;
		notificationDuration: number;
		accessibility: {
			announceChanges: boolean;
			keyboardNavigation: boolean;
		};
	};

	// Customization
	customization: {
		reactionIcons: ReactionIcons;
		cssClasses: {
			userChoice: string;
			loading: string;
			disabled: string;
		};
		labels: {
			vote: {
				like: string;
				dislike: string;
			};
			reactions: Record<string, string>;
		};
	};

	// Hooks for extensibility
	hooks: {
		beforeVote?: (
			postId: string,
			voteType: "like" | "dislike" | null
		) => Promise<boolean> | boolean;
		afterVote?: (
			postId: string,
			voteType: "like" | "dislike" | null,
			success: boolean
		) => void;
		beforeReaction?: (
			postId: string,
			reaction: string | null
		) => Promise<boolean> | boolean;
		afterReaction?: (
			postId: string,
			reaction: string | null,
			success: boolean
		) => void;
		onError?: (
			error: Error,
			context: { type: "vote" | "reaction"; postId: string }
		) => void;
	};
}

export const DEFAULT_CONFIG: ReactionsConfig = {
	votes: true,
	reactions: true,
	selectors: {
		post: ".post-normal",
		reactionsContainer: "td:has(>.postcolor)"
	},
	pidFn: ({ reactionsContainer }) =>
		`${reactionsContainer.id}`.split("_")[1] || "",
	server: "https://jcink-reactions.nicket.dev",

	performance: {
		debounceMs: 300,
		cacheEnabled: true,
		cacheTTL: 5 * 60 * 1000, // 5 minutes
		maxRetries: 3,
		retryDelay: 1000,
		retryBackoff: "exponential"
	},

	ui: {
		optimisticUpdates: true,
		showLoadingStates: true,
		animationDuration: 200,
		showErrorNotifications: true,
		notificationDuration: 5000,
		accessibility: {
			announceChanges: true,
			keyboardNavigation: true
		}
	},

	customization: {
		reactionIcons: {
			heart: "❤️",
			laugh: "😂",
			clap: "👏",
			thinking: "🤔",
			sad: "😢",
			angry: "😠",
			confused: "😕",
			thumbsup: "👍",
			thumbsdown: "👎"
		},
		cssClasses: {
			userChoice: "reactions-user-choice",
			loading: "reactions-loading",
			disabled: "reactions-disabled"
		},
		labels: {
			vote: {
				like: "Like this post",
				dislike: "Dislike this post"
			},
			reactions: {
				heart: "Love",
				laugh: "Funny",
				clap: "Applause",
				thinking: "Thoughtful",
				sad: "Sad",
				angry: "Angry",
				confused: "Confused",
				thumbsup: "Thumbs up",
				thumbsdown: "Thumbs down"
			}
		}
	},

	hooks: {}
};

/**
 * Validate and merge user configuration with defaults
 */
export function createConfig(
	userConfig: Partial<ReactionsConfig> = {}
): ReactionsConfig {
	const config = mergeDeep(DEFAULT_CONFIG, userConfig) as ReactionsConfig;

	// Validate configuration
	validateConfig(config);

	return config;
}

/**
 * Deep merge objects
 */
function mergeDeep(target: any, source: any): any {
	const result = { ...target };

	for (const key in source) {
		if (
			source[key] &&
			typeof source[key] === "object" &&
			!Array.isArray(source[key])
		) {
			result[key] = mergeDeep(target[key] || {}, source[key]);
		} else {
			result[key] = source[key];
		}
	}

	return result;
}

/**
 * Validate configuration values
 */
function validateConfig(config: ReactionsConfig): void {
	// Validate server URL
	if (!config.server || typeof config.server !== "string") {
		throw new Error("Server URL is required and must be a string");
	}

	try {
		new URL(config.server);
	} catch {
		throw new Error("Server URL must be a valid URL");
	}

	// Validate selectors
	if (!config.selectors.post || !config.selectors.reactionsContainer) {
		throw new Error("Post and reactions container selectors are required");
	}

	// Validate performance settings
	if (config.performance.debounceMs < 0) {
		throw new Error("Debounce delay must be non-negative");
	}

	if (config.performance.maxRetries < 1) {
		throw new Error("Max retries must be at least 1");
	}

	if (config.performance.retryDelay < 0) {
		throw new Error("Retry delay must be non-negative");
	}

	// Validate UI settings
	if (config.ui.animationDuration < 0) {
		throw new Error("Animation duration must be non-negative");
	}

	if (config.ui.notificationDuration < 0) {
		throw new Error("Notification duration must be non-negative");
	}

	// Validate reaction icons
	if (
		config.reactions &&
		Object.keys(config.customization.reactionIcons).length === 0
	) {
		throw new Error(
			"At least one reaction icon must be defined when reactions are enabled"
		);
	}
}

/**
 * Type guard to check if hooks are defined
 */
export function hasHook<K extends keyof ReactionsConfig["hooks"]>(
	config: ReactionsConfig,
	hookName: K
): config is ReactionsConfig & {
	hooks: Required<Pick<ReactionsConfig["hooks"], K>>;
} {
	return typeof config.hooks[hookName] === "function";
}
