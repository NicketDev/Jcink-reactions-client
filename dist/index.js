(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __moduleCache = /* @__PURE__ */ new WeakMap;
  var __toCommonJS = (from) => {
    var entry = __moduleCache.get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function")
      __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      }));
    __moduleCache.set(from, entry);
    return entry;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: (newValue) => all[name] = () => newValue
      });
  };

  // src/index.ts
  var exports_src = {};
  __export(exports_src, {
    default: () => Reactions
  });

  // src/style.css
  var style_default = `.reactions-votes {\r
	position: absolute;\r
	top: 0;\r
	right: 0;\r
	display: flex;\r
	flex-direction: column;\r
	align-items: center;\r
	justify-content: center;\r
	gap: 4px;\r
	font-size: 20px;\r
}\r
.reactions-votes-button {\r
	display: flex;\r
	align-items: center;\r
	justify-content: center;\r
	gap: 4px;\r
	padding: 4px;\r
	border-radius: 4px;\r
	cursor: pointer;\r
	user-select: none;\r
	transition:\r
		background-color 0.3s,\r
		color 0.3s;\r
	background-color: transparent;\r
	color: #000;\r
}\r
.reactions-votes-button-upvote:hover {\r
	background-color: rgba(34, 197, 94, 0.1);\r
}\r
.reactions-votes-button-downvote:hover {\r
	background-color: rgba(239, 68, 68, 0.1);\r
}\r
.reactions-votes-button-downvote.reactions-user-choice {\r
	background-color: rgba(239, 68, 68, 0.15);\r
}\r
.reactions-votes-button-upvote.reactions-user-choice {\r
	background-color: rgba(34, 197, 94, 0.15);\r
}\r
\r
.reactions-reactions {\r
	position: absolute;\r
	bottom: 0;\r
	right: 0;\r
	font-size: 16px;\r
}\r
\r
/* Compact view styles */\r
.reactions-compact-view {\r
	display: flex;\r
	align-items: center;\r
	gap: 4px;\r
	margin: 4px;\r
	opacity: 1;\r
	transition: opacity 0.2s ease;\r
}\r
\r
.reactions-add-button {\r
	display: flex;\r
	align-items: center;\r
	justify-content: center;\r
	padding: 4px 8px;\r
	border-radius: 12px;\r
	cursor: pointer;\r
	user-select: none;\r
	transition: background-color 0.2s ease;\r
	background-color: rgba(0, 0, 0, 0.05);\r
	font-size: 18px;\r
}\r
\r
.reactions-add-button:hover {\r
	background-color: rgba(0, 0, 0, 0.1);\r
}\r
\r
.reactions-add-button.reactions-hidden {\r
	display: none;\r
}\r
\r
.reactions-compact-reactions {\r
	display: none;\r
	gap: 2px;\r
}\r
\r
.reactions-compact-reactions.reactions-has-active {\r
	display: flex;\r
}\r
\r
.reactions-compact-option {\r
	display: none;\r
	align-items: center;\r
	justify-content: center;\r
	gap: 2px;\r
	padding: 2px 6px;\r
	border-radius: 10px;\r
	cursor: pointer;\r
	user-select: none;\r
	transition: background-color 0.2s ease;\r
	background-color: rgba(0, 0, 0, 0.05);\r
	font-size: 14px;\r
}\r
\r
.reactions-compact-option.reactions-active {\r
	display: flex;\r
}\r
\r
.reactions-compact-option:hover {\r
	background-color: rgba(34, 197, 94, 0.1);\r
}\r
\r
.reactions-compact-option.reactions-user-choice {\r
	background-color: rgba(34, 197, 94, 0.2);\r
}\r
\r
.reactions-compact-option-count {\r
	font-size: 12px;\r
	font-weight: 500;\r
}\r
\r
/* Expanded view styles */\r
.reactions-expanded-view {\r
	position: absolute;\r
	bottom: 4px;\r
	right: 4px;\r
	background: white;\r
	border: 1px solid #e5e5e5;\r
	border-radius: 8px;\r
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\r
	z-index: 1000;\r
	opacity: 0;\r
	transform: translateY(8px) scale(0.95);\r
	pointer-events: none;\r
	transition:\r
		opacity 0.2s ease,\r
		transform 0.2s ease;\r
}\r
\r
/* Transitions on post hover with slight delay to prevent flickering */\r
.post-normal:hover .reactions-expanded-view {\r
	opacity: 1;\r
	transform: translateY(0) scale(1);\r
	pointer-events: auto;\r
	transition-delay: 0.1s;\r
}\r
\r
.post-normal:hover .reactions-compact-view {\r
	opacity: 0;\r
	transition-delay: 0.05s;\r
}\r
\r
.reactions-reactions-options {\r
	display: flex;\r
	padding: 4px;\r
	gap: 2px;\r
}\r
.reactions-reactions-option {\r
	display: flex;\r
	align-items: center;\r
	justify-content: center;\r
	gap: 4px;\r
	padding: 6px 8px;\r
	border-radius: 6px;\r
	cursor: pointer;\r
	user-select: none;\r
	transition:\r
		background-color 0.3s,\r
		color 0.3s;\r
}\r
\r
.reactions-reactions-option:hover {\r
	background-color: rgba(34, 197, 94, 0.1);\r
}\r
.reactions-reactions-option.reactions-user-choice {\r
	background-color: rgba(34, 197, 94, 0.35);\r
}\r
.reactions-reactions-option-count[data-count="0"] {\r
	display: none;\r
}\r
`;

  // src/config.ts
  var DEFAULT_CONFIG = {
    votes: true,
    reactions: true,
    selectors: {
      post: ".post-normal",
      reactionsContainer: "td:has(>.postcolor)"
    },
    pidFn: ({ reactionsContainer }) => `${reactionsContainer.id}`.split("_")[1] || "",
    server: "https://jcink-reactions.nicket.dev",
    performance: {
      debounceMs: 300,
      cacheEnabled: true,
      cacheTTL: 5 * 60 * 1000,
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
        laugh: "\uD83D\uDE02",
        clap: "\uD83D\uDC4F",
        thinking: "\uD83E\uDD14",
        sad: "\uD83D\uDE22",
        angry: "\uD83D\uDE20",
        confused: "\uD83D\uDE15",
        thumbsup: "\uD83D\uDC4D",
        thumbsdown: "\uD83D\uDC4E"
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
  function createConfig(userConfig = {}) {
    const config = mergeDeep(DEFAULT_CONFIG, userConfig);
    validateConfig(config);
    return config;
  }
  function mergeDeep(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        result[key] = mergeDeep(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  function validateConfig(config) {
    if (!config.server || typeof config.server !== "string") {
      throw new Error("Server URL is required and must be a string");
    }
    try {
      new URL(config.server);
    } catch {
      throw new Error("Server URL must be a valid URL");
    }
    if (!config.selectors.post || !config.selectors.reactionsContainer) {
      throw new Error("Post and reactions container selectors are required");
    }
    if (config.performance.debounceMs < 0) {
      throw new Error("Debounce delay must be non-negative");
    }
    if (config.performance.maxRetries < 1) {
      throw new Error("Max retries must be at least 1");
    }
    if (config.performance.retryDelay < 0) {
      throw new Error("Retry delay must be non-negative");
    }
    if (config.ui.animationDuration < 0) {
      throw new Error("Animation duration must be non-negative");
    }
    if (config.ui.notificationDuration < 0) {
      throw new Error("Notification duration must be non-negative");
    }
    if (config.reactions && Object.keys(config.customization.reactionIcons).length === 0) {
      throw new Error("At least one reaction icon must be defined when reactions are enabled");
    }
  }

  // src/utils/errors.ts
  class NetworkError extends Error {
    status;
    isRetryable;
    constructor(message, status, isRetryable = true) {
      super(message);
      this.status = status;
      this.isRetryable = isRetryable;
      this.name = "NetworkError";
    }
  }

  class AuthenticationError extends Error {
    constructor(message = "Authentication required") {
      super(message);
      this.name = "AuthenticationError";
    }
  }
  async function withRetry(fn, options) {
    let lastError;
    for (let attempt = 1;attempt <= options.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (error instanceof AuthenticationError) {
          throw error;
        }
        if (error instanceof NetworkError && !error.isRetryable) {
          throw error;
        }
        if (attempt === options.maxAttempts) {
          throw lastError;
        }
        let delay = options.delay;
        if (options.backoff === "exponential") {
          delay = options.delay * Math.pow(2, attempt - 1);
        } else if (options.backoff === "linear") {
          delay = options.delay * attempt;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

  class ErrorNotifier {
    static instance;
    container = null;
    static getInstance() {
      if (!ErrorNotifier.instance) {
        ErrorNotifier.instance = new ErrorNotifier;
      }
      return ErrorNotifier.instance;
    }
    createContainer() {
      if (this.container)
        return this.container;
      this.container = document.createElement("div");
      this.container.id = "reactions-error-container";
      this.container.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			z-index: 10000;
			max-width: 400px;
		`;
      document.body.appendChild(this.container);
      return this.container;
    }
    show(message, type = "error", duration = 5000) {
      const container = this.createContainer();
      const notification = document.createElement("div");
      notification.style.cssText = `
			background: ${type === "error" ? "#f56565" : type === "warning" ? "#ed8936" : "#4299e1"};
			color: white;
			padding: 12px 16px;
			margin-bottom: 8px;
			border-radius: 4px;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
			opacity: 0;
			transform: translateX(100%);
			transition: all 0.3s ease;
		`;
      notification.textContent = message;
      container.appendChild(notification);
      requestAnimationFrame(() => {
        notification.style.opacity = "1";
        notification.style.transform = "translateX(0)";
      });
      setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, duration);
    }
    showError(error) {
      let message = "An unexpected error occurred";
      if (error instanceof AuthenticationError) {
        message = "Please log in to vote or react to posts";
      } else if (error instanceof NetworkError) {
        message = error.status === 429 ? "Too many requests. Please wait a moment." : "Network error. Please check your connection.";
      }
      this.show(message, "error");
    }
  }

  // src/api.ts
  class ReactionsAPI {
    config;
    topicId;
    errorNotifier = ErrorNotifier.getInstance();
    constructor(config, topicId) {
      this.config = config;
      this.topicId = topicId;
    }
    async get(path, getOptions) {
      const sp = new URLSearchParams(getOptions?.query);
      sp.set("forumUrl", location.origin);
      sp.set("topicId", this.topicId);
      return withRetry(async () => {
        const response = await fetch(`${this.config.server}${path}?${sp}`, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new NetworkError(`GET ${path} failed`, response.status, response.status >= 500 || response.status === 429);
        }
        return response;
      }, {
        maxAttempts: this.config.performance.maxRetries,
        delay: this.config.performance.retryDelay,
        backoff: this.config.performance.retryBackoff
      });
    }
    async put(path, body) {
      return withRetry(async () => {
        try {
          const jwt = await authcinkPromise.then((authcink) => authcink.authenticate());
          const response = await fetch(`${this.config.server}${path}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(body)
          });
          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              throw new AuthenticationError;
            }
            throw new NetworkError(`PUT ${path} failed`, response.status, response.status >= 500 || response.status === 429);
          }
          return response;
        } catch (error) {
          if (error instanceof NetworkError || error instanceof AuthenticationError) {
            throw error;
          }
          throw new AuthenticationError("Authentication failed");
        }
      }, {
        maxAttempts: this.config.performance.maxRetries,
        delay: this.config.performance.retryDelay,
        backoff: this.config.performance.retryBackoff
      });
    }
  }

  // src/auth.ts
  function getCurrentUser() {
    const loggedInLink = document.getElementById("logged-in-as");
    if (!loggedInLink?.href) {
      return null;
    }
    const url = new URL(loggedInLink.href);
    const userId = url.searchParams.get("showuser");
    return userId ? { userId: parseInt(userId) } : null;
  }

  // src/ui.ts
  function initializeStyles(cssStyles) {
    const style = document.createElement("style");
    style.textContent = cssStyles;
    document.head.appendChild(style);
  }
  function updateCountDisplay(element, count) {
    if (!element)
      return;
    element.textContent = count.toString();
    element.setAttribute("data-count", count.toString());
  }
  function getCurrentCount(element) {
    if (!element)
      return 0;
    return parseInt(element.getAttribute("data-count") || "0");
  }
  function toggleClass(element, className, condition) {
    if (condition) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
  function removeClassFromAll(elements, className) {
    elements.forEach((element) => element.classList.remove(className));
  }

  // src/utils/optimistic.ts
  class OptimisticUpdateManager {
    updates = new Map;
    applyVoteUpdate(elements, postId, voteType, isRemoving, previousUserVote) {
      const updateId = `vote-${postId}-${Date.now()}`;
      const upvoteActive = elements.upvote?.classList.contains("reactions-user-choice") || false;
      const downvoteActive = elements.downvote?.classList.contains("reactions-user-choice") || false;
      const upvoteCount = elements.upvote ? getCurrentCount(elements.upvote.querySelector(".reactions-votes-count")) : 0;
      const downvoteCount = elements.downvote ? getCurrentCount(elements.downvote.querySelector(".reactions-votes-count")) : 0;
      if (voteType === "like") {
        if (elements.upvote) {
          toggleClass(elements.upvote, "reactions-user-choice", !isRemoving);
          let newUpCount = upvoteCount;
          let newDownCount = downvoteCount;
          if (previousUserVote === "dislike" && !isRemoving) {
            newDownCount = Math.max(0, downvoteCount - 1);
            newUpCount = upvoteCount + 1;
            if (elements.downvote) {
              updateCountDisplay(elements.downvote.querySelector(".reactions-votes-count"), newDownCount);
            }
          } else {
            newUpCount = isRemoving ? Math.max(0, upvoteCount - 1) : upvoteCount + 1;
          }
          updateCountDisplay(elements.upvote.querySelector(".reactions-votes-count"), newUpCount);
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
            newUpCount = Math.max(0, upvoteCount - 1);
            newDownCount = downvoteCount + 1;
            if (elements.upvote) {
              updateCountDisplay(elements.upvote.querySelector(".reactions-votes-count"), newUpCount);
            }
          } else {
            newDownCount = isRemoving ? Math.max(0, downvoteCount - 1) : downvoteCount + 1;
          }
          updateCountDisplay(elements.downvote.querySelector(".reactions-votes-count"), newDownCount);
        }
        if (elements.upvote) {
          elements.upvote.classList.remove("reactions-user-choice");
        }
      }
      const rollback = () => {
        if (elements.upvote) {
          toggleClass(elements.upvote, "reactions-user-choice", upvoteActive);
          updateCountDisplay(elements.upvote.querySelector(".reactions-votes-count"), upvoteCount);
        }
        if (elements.downvote) {
          toggleClass(elements.downvote, "reactions-user-choice", downvoteActive);
          updateCountDisplay(elements.downvote.querySelector(".reactions-votes-count"), downvoteCount);
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
    applyReactionUpdate(elements, postId, reactionName, isRemoving, previousUserReaction) {
      const updateId = `reaction-${postId}-${Date.now()}`;
      if (!elements.reactions)
        return updateId;
      const reactionOptions = elements.reactions.querySelectorAll(".reactions-reactions-option");
      const currentStates = Array.from(reactionOptions).map((option) => ({
        element: option,
        active: option.classList.contains("reactions-user-choice"),
        count: getCurrentCount(option.querySelector(".reactions-reactions-option-count"))
      }));
      const targetOption = Array.from(reactionOptions).find((opt) => opt.getAttribute("aria-label") === reactionName);
      if (targetOption) {
        removeClassFromAll(reactionOptions, "reactions-user-choice");
        if (!isRemoving) {
          targetOption.classList.add("reactions-user-choice");
        }
        if (previousUserReaction && previousUserReaction !== reactionName) {
          const oldOption = Array.from(reactionOptions).find((opt) => opt.getAttribute("aria-label") === previousUserReaction);
          if (oldOption) {
            const oldCountEl = oldOption.querySelector(".reactions-reactions-option-count");
            const oldCount = getCurrentCount(oldCountEl);
            updateCountDisplay(oldCountEl, Math.max(0, oldCount - 1));
          }
          const newCountEl = targetOption.querySelector(".reactions-reactions-option-count");
          const newCount = getCurrentCount(newCountEl);
          updateCountDisplay(newCountEl, newCount + 1);
        } else {
          const countEl = targetOption.querySelector(".reactions-reactions-option-count");
          const currentCount = getCurrentCount(countEl);
          const newCount = isRemoving ? Math.max(0, currentCount - 1) : currentCount + 1;
          updateCountDisplay(countEl, newCount);
        }
      }
      const rollback = () => {
        currentStates.forEach(({ element, active, count }) => {
          toggleClass(element, "reactions-user-choice", active);
          updateCountDisplay(element.querySelector(".reactions-reactions-option-count"), count);
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
    commit(updateId) {
      this.updates.delete(updateId);
    }
    rollback(updateId) {
      const update = this.updates.get(updateId);
      if (update) {
        update.rollback();
        this.updates.delete(updateId);
      }
    }
    rollbackPost(postId) {
      const postUpdates = Array.from(this.updates.values()).filter((update) => update.postId === postId);
      postUpdates.forEach((update) => {
        update.rollback();
        this.updates.delete(update.id);
      });
    }
    clear() {
      this.updates.clear();
    }
  }

  // src/state.ts
  class StateManager {
    userChoices;
    loadingStates;
    optimisticManager;
    constructor() {
      this.userChoices = {
        votes: new Map,
        reactions: new Map
      };
      this.loadingStates = {
        votes: new Set,
        reactions: new Set
      };
      this.optimisticManager = new OptimisticUpdateManager;
    }
    setUserVote(pid, vote) {
      this.userChoices.votes.set(pid, vote);
    }
    getUserVote(pid) {
      return this.userChoices.votes.get(pid) || null;
    }
    setUserReaction(pid, reaction) {
      this.userChoices.reactions.set(pid, reaction);
    }
    getUserReaction(pid) {
      return this.userChoices.reactions.get(pid) || null;
    }
    isVoteLoading(pid) {
      return this.loadingStates.votes.has(pid);
    }
    setVoteLoading(pid, loading) {
      if (loading) {
        this.loadingStates.votes.add(pid);
      } else {
        this.loadingStates.votes.delete(pid);
      }
    }
    isReactionLoading(pid) {
      return this.loadingStates.reactions.has(pid);
    }
    setReactionLoading(pid, loading) {
      if (loading) {
        this.loadingStates.reactions.add(pid);
      } else {
        this.loadingStates.reactions.delete(pid);
      }
    }
    applyOptimisticVote(elements, postId, voteType, isRemoving) {
      const previousUserVote = this.getUserVote(postId);
      const updateId = this.optimisticManager.applyVoteUpdate(elements, postId, voteType, isRemoving, previousUserVote);
      return {
        updateId,
        commit: () => this.optimisticManager.commit(updateId),
        rollback: () => this.optimisticManager.rollback(updateId)
      };
    }
    applyOptimisticReaction(elements, postId, reactionName, isRemoving) {
      const previousUserReaction = this.getUserReaction(postId);
      const updateId = this.optimisticManager.applyReactionUpdate(elements, postId, reactionName, isRemoving, previousUserReaction);
      return {
        updateId,
        commit: () => this.optimisticManager.commit(updateId),
        rollback: () => this.optimisticManager.rollback(updateId)
      };
    }
    rollbackPost(postId) {
      this.optimisticManager.rollbackPost(postId);
    }
  }

  // src/utils/debounce.ts
  function debounce(func, wait) {
    let timeout = null;
    return (...args) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func(...args);
        timeout = null;
      }, wait);
    };
  }

  // src/components/votes.ts
  function createVoteElements(config, reactionsContainer) {
    const votes = Object.assign(document.createElement("div"), {
      className: "reactions-votes"
    });
    let upvote = null;
    let downvote = null;
    if (config.votes) {
      upvote = Object.assign(document.createElement("div"), {
        className: "reactions-votes-button reactions-votes-button-upvote",
        innerHTML: `
				<div class="reactions-votes-icon">\uD83D\uDC4D</div>
				<div class="reactions-votes-count" data-count="0">0</div>
			`
      });
      votes.appendChild(upvote);
      if (config.votes === true) {
        downvote = Object.assign(document.createElement("div"), {
          className: "reactions-votes-button reactions-votes-button-downvote",
          innerHTML: `
					<div class="reactions-votes-icon">\uD83D\uDC4E</div>
					<div class="reactions-votes-count" data-count="0">0</div>
				`
        });
        votes.appendChild(downvote);
      }
      reactionsContainer.appendChild(votes);
    }
    return { votes, upvote, downvote };
  }
  function updateVoteUI(elements, voteType, isRemoving, previousUserVote) {
    if (voteType === "like") {
      toggleClass(elements.upvote, "reactions-user-choice", !isRemoving);
      if (elements.downvote) {
        elements.downvote.classList.remove("reactions-user-choice");
      }
      if (previousUserVote === "dislike" && !isRemoving) {
        if (elements.downvote) {
          const downCountEl = elements.downvote.querySelector(".reactions-votes-count");
          const currentDownCount = getCurrentCount(downCountEl);
          updateCountDisplay(downCountEl, Math.max(0, currentDownCount - 1));
        }
        const upCountEl = elements.upvote.querySelector(".reactions-votes-count");
        const currentUpCount = getCurrentCount(upCountEl);
        updateCountDisplay(upCountEl, currentUpCount + 1);
      } else {
        const countEl = elements.upvote.querySelector(".reactions-votes-count");
        const currentCount = getCurrentCount(countEl);
        const newCount = isRemoving ? Math.max(0, currentCount - 1) : currentCount + 1;
        updateCountDisplay(countEl, newCount);
      }
    } else {
      toggleClass(elements.downvote, "reactions-user-choice", !isRemoving);
      if (elements.upvote) {
        elements.upvote.classList.remove("reactions-user-choice");
      }
      if (previousUserVote === "like" && !isRemoving) {
        if (elements.upvote) {
          const upCountEl = elements.upvote.querySelector(".reactions-votes-count");
          const currentUpCount = getCurrentCount(upCountEl);
          updateCountDisplay(upCountEl, Math.max(0, currentUpCount - 1));
        }
        const downCountEl = elements.downvote.querySelector(".reactions-votes-count");
        const currentDownCount = getCurrentCount(downCountEl);
        updateCountDisplay(downCountEl, currentDownCount + 1);
      } else {
        const countEl = elements.downvote.querySelector(".reactions-votes-count");
        const currentCount = getCurrentCount(countEl);
        const newCount = isRemoving ? Math.max(0, currentCount - 1) : currentCount + 1;
        updateCountDisplay(countEl, newCount);
      }
    }
  }
  function addVoteEventHandlers(elements, pid, topicId, api, stateManager, config) {
    const errorNotifier = ErrorNotifier.getInstance();
    const handleVote = debounce(async (voteType) => {
      if (stateManager.isVoteLoading(pid))
        return;
      stateManager.setVoteLoading(pid, true);
      const isActive = voteType === "like" ? elements.upvote.classList.contains("reactions-user-choice") : elements.downvote.classList.contains("reactions-user-choice");
      const currentUserVote = stateManager.getUserVote(pid);
      let optimisticUpdate = null;
      if (config.ui.optimisticUpdates) {
        optimisticUpdate = stateManager.applyOptimisticVote(elements, pid, voteType, isActive);
      }
      try {
        const response = await api.put(`/topics/${topicId}/posts/${pid}/vote`, {
          type: isActive ? null : voteType
        });
        if (response.ok) {
          const newVote = isActive ? null : voteType;
          stateManager.setUserVote(pid, newVote);
          if (optimisticUpdate) {
            optimisticUpdate.commit();
          } else {
            updateVoteUI(elements, voteType, isActive, currentUserVote);
          }
        } else {
          throw new Error(`Vote request failed with status ${response.status}`);
        }
      } catch (error) {
        if (optimisticUpdate) {
          optimisticUpdate.rollback();
        }
        if (config.ui.showErrorNotifications) {
          errorNotifier.showError(error);
        }
        console.error("Failed to vote:", error);
      } finally {
        stateManager.setVoteLoading(pid, false);
      }
    }, config.performance.debounceMs);
    if (elements.upvote) {
      elements.upvote.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleVote("like");
      });
    }
    if (elements.downvote) {
      elements.downvote.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleVote("dislike");
      });
    }
  }
  function processVoteData(data, postsMap, currentUser, stateManager) {
    const votesByPost = new Map;
    const userVotesByPost = new Map;
    data.forEach((vote) => {
      const postId = vote.postId.toString();
      const voteType = vote.voteType;
      if (!votesByPost.has(postId)) {
        votesByPost.set(postId, { like: 0, dislike: 0 });
      }
      const postVotes = votesByPost.get(postId);
      postVotes[voteType] = (postVotes[voteType] || 0) + 1;
      if (currentUser && vote.userId === currentUser.userId) {
        userVotesByPost.set(postId, voteType);
        stateManager.setUserVote(postId, voteType);
      }
    });
    postsMap.forEach((elements, pid) => {
      const postVotes = votesByPost.get(pid) || { like: 0, dislike: 0 };
      const userVote = userVotesByPost.get(pid);
      if (elements.upvote) {
        const countEl = elements.upvote.querySelector(".reactions-votes-count");
        updateCountDisplay(countEl, postVotes.like);
        toggleClass(elements.upvote, "reactions-user-choice", userVote === "like");
      }
      if (elements.downvote) {
        const countEl = elements.downvote.querySelector(".reactions-votes-count");
        updateCountDisplay(countEl, postVotes.dislike);
        toggleClass(elements.downvote, "reactions-user-choice", userVote === "dislike");
      }
    });
  }

  // src/components/reactions.ts
  function createReactionElements(config, reactionsContainer) {
    if (!config.reactions)
      return null;
    const reactions = Object.assign(document.createElement("div"), {
      className: "reactions-reactions"
    });
    const compactView = Object.assign(document.createElement("div"), {
      className: "reactions-compact-view"
    });
    const addReactionButton = Object.assign(document.createElement("div"), {
      className: "reactions-add-button",
      innerHTML: `<div class="reactions-add-button-icon">\uD83D\uDE0A</div>`,
      title: "Add reaction"
    });
    addReactionButton.setAttribute("role", "button");
    addReactionButton.setAttribute("tabindex", "0");
    const compactReactions = Object.assign(document.createElement("div"), {
      className: "reactions-compact-reactions"
    });
    compactView.appendChild(addReactionButton);
    compactView.appendChild(compactReactions);
    const expandedView = Object.assign(document.createElement("div"), {
      className: "reactions-expanded-view"
    });
    const optionsContainer = Object.assign(document.createElement("div"), {
      className: "reactions-reactions-options"
    });
    Object.entries(config.customization.reactionIcons).forEach(([reaction, icon]) => {
      const option = document.createElement("div");
      option.className = "reactions-reactions-option";
      option.innerHTML = `<div class="reactions-reactions-option-icon">${icon}</div>
			<div class="reactions-reactions-option-count" data-count="0">0</div>`;
      option.setAttribute("aria-label", reaction);
      option.setAttribute("role", "button");
      option.setAttribute("tabindex", "0");
      optionsContainer.appendChild(option);
      const compactOption = document.createElement("div");
      compactOption.className = "reactions-compact-option";
      compactOption.innerHTML = `<div class="reactions-compact-option-icon">${icon}</div>
			<div class="reactions-compact-option-count" data-count="0">0</div>`;
      compactOption.setAttribute("aria-label", reaction);
      compactOption.setAttribute("role", "button");
      compactOption.setAttribute("tabindex", "0");
      compactReactions.appendChild(compactOption);
    });
    expandedView.appendChild(optionsContainer);
    reactions.appendChild(compactView);
    reactions.appendChild(expandedView);
    reactionsContainer.appendChild(reactions);
    return reactions;
  }
  function addReactionEventHandlers(elements, pid, topicId, api, stateManager, config) {
    if (!elements.reactions)
      return;
    const expandedOptions = elements.reactions.querySelectorAll(".reactions-reactions-option");
    const compactOptions = elements.reactions.querySelectorAll(".reactions-compact-option");
    const addButton = elements.reactions.querySelector(".reactions-add-button");
    const allOptions = [
      ...Array.from(expandedOptions),
      ...Array.from(compactOptions)
    ];
    allOptions.forEach((option) => {
      option.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (stateManager.isReactionLoading(pid))
          return;
        stateManager.setReactionLoading(pid, true);
        try {
          const reactionName = option.getAttribute("aria-label");
          const isActive = option.classList.contains("reactions-user-choice");
          const currentUserReaction = stateManager.getUserReaction(pid);
          const response = await api.put(`/topics/${topicId}/posts/${pid}/reaction`, {
            reaction: isActive ? null : reactionName
          });
          if (response.ok) {
            const newReaction = isActive ? null : reactionName;
            stateManager.setUserReaction(pid, newReaction);
            removeClassFromAll([...Array.from(expandedOptions), ...Array.from(compactOptions)], "reactions-user-choice");
            if (!isActive) {
              const expandedOption = Array.from(expandedOptions).find((opt) => opt.getAttribute("aria-label") === reactionName);
              const compactOption = Array.from(compactOptions).find((opt) => opt.getAttribute("aria-label") === reactionName);
              if (expandedOption)
                expandedOption.classList.add("reactions-user-choice");
              if (compactOption)
                compactOption.classList.add("reactions-user-choice");
            }
            if (currentUserReaction && currentUserReaction !== reactionName) {
              updateReactionCounts(expandedOptions, compactOptions, currentUserReaction, -1);
              updateReactionCounts(expandedOptions, compactOptions, reactionName, 1);
            } else if (currentUserReaction === reactionName) {
              updateReactionCounts(expandedOptions, compactOptions, reactionName, -1);
            } else if (!currentUserReaction) {
              updateReactionCounts(expandedOptions, compactOptions, reactionName, 1);
            }
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
  }
  function updateReactionCounts(expandedOptions, compactOptions, reactionName, delta) {
    const updateOption = (option) => {
      const countEl = option.querySelector(".reactions-reactions-option-count, .reactions-compact-option-count");
      if (countEl) {
        const currentCount = getCurrentCount(countEl);
        const newCount = Math.max(0, currentCount + delta);
        updateCountDisplay(countEl, newCount);
      }
    };
    const expandedOption = Array.from(expandedOptions).find((opt) => opt.getAttribute("aria-label") === reactionName);
    if (expandedOption)
      updateOption(expandedOption);
    const compactOption = Array.from(compactOptions).find((opt) => opt.getAttribute("aria-label") === reactionName);
    if (compactOption)
      updateOption(compactOption);
  }
  function updateCompactViewVisibility(reactionsElement) {
    const addButton = reactionsElement.querySelector(".reactions-add-button");
    const compactReactions = reactionsElement.querySelector(".reactions-compact-reactions");
    const compactOptions = reactionsElement.querySelectorAll(".reactions-compact-option");
    let hasActiveReactions = false;
    compactOptions.forEach((option) => {
      const countEl = option.querySelector(".reactions-compact-option-count");
      const count = getCurrentCount(countEl);
      if (count > 0) {
        option.classList.add("reactions-active");
        hasActiveReactions = true;
      } else {
        option.classList.remove("reactions-active");
      }
    });
    if (hasActiveReactions) {
      addButton.classList.add("reactions-hidden");
      compactReactions.classList.add("reactions-has-active");
    } else {
      addButton.classList.remove("reactions-hidden");
      compactReactions.classList.remove("reactions-has-active");
    }
  }
  function processReactionData(data, postsMap, currentUser, stateManager) {
    const reactionsByPost = new Map;
    const userReactionsByPost = new Map;
    data.forEach((reaction) => {
      const postId = reaction.postId.toString();
      const reactionType = reaction.reaction;
      if (!reactionsByPost.has(postId)) {
        reactionsByPost.set(postId, new Map);
      }
      const postReactions = reactionsByPost.get(postId);
      postReactions.set(reactionType, (postReactions.get(reactionType) || 0) + 1);
      if (currentUser && reaction.userId === currentUser.userId) {
        userReactionsByPost.set(postId, reactionType);
        stateManager.setUserReaction(postId, reactionType);
      }
    });
    postsMap.forEach((elements, pid) => {
      if (!elements.reactions)
        return;
      const postReactions = reactionsByPost.get(pid) || new Map;
      const userReaction = userReactionsByPost.get(pid);
      const expandedOptions = elements.reactions.querySelectorAll(".reactions-reactions-option");
      const compactOptions = elements.reactions.querySelectorAll(".reactions-compact-option");
      expandedOptions.forEach((option) => {
        const reactionName = option.getAttribute("aria-label");
        const count = postReactions.get(reactionName) || 0;
        const countEl = option.querySelector(".reactions-reactions-option-count");
        updateCountDisplay(countEl, count);
        toggleClass(option, "reactions-user-choice", userReaction === reactionName);
      });
      compactOptions.forEach((option) => {
        const reactionName = option.getAttribute("aria-label");
        const count = postReactions.get(reactionName) || 0;
        const countEl = option.querySelector(".reactions-compact-option-count");
        updateCountDisplay(countEl, count);
        toggleClass(option, "reactions-user-choice", userReaction === reactionName);
      });
      updateCompactViewVisibility(elements.reactions);
    });
  }

  // src/index.ts
  function extractTopicId() {
    const currentUrl = new URL(location.href);
    return currentUrl.searchParams.get("showtopic") || (currentUrl.searchParams.get("act") === "ST" ? currentUrl.searchParams.get("t") : null);
  }
  function initializePostElements(postElement, config, postsMap, topicId, api, stateManager) {
    const reactionsContainer = postElement.querySelector(config.selectors.reactionsContainer);
    if (!reactionsContainer) {
      return null;
    }
    reactionsContainer.style.position = "relative";
    const { votes, upvote, downvote } = createVoteElements(config, reactionsContainer);
    const reactions = createReactionElements(config, reactionsContainer);
    const elements = {
      post: postElement,
      reactionsContainer,
      votes,
      upvote,
      downvote,
      reactions: reactions || undefined
    };
    const postId = config.pidFn(elements);
    postsMap.set(postId, elements);
    addVoteEventHandlers(elements, postId, topicId, api, stateManager, config);
    addReactionEventHandlers(elements, postId, topicId, api, stateManager, config);
    return postId;
  }
  async function loadReactionsData(api, postIds, postsMap, currentUser, stateManager) {
    try {
      const response = await api.get("/reactions", {
        query: { postIds: postIds.join(",") }
      });
      const data = await response.json();
      processReactionData(data, postsMap, currentUser, stateManager);
    } catch (error) {
      console.error("Failed to load reactions:", error);
      ErrorNotifier.getInstance().showError(error);
    }
  }
  async function loadVotesData(api, postIds, postsMap, currentUser, stateManager) {
    try {
      const response = await api.get("/votes", {
        query: { postIds: postIds.join(",") }
      });
      const data = await response.json();
      processVoteData(data, postsMap, currentUser, stateManager);
    } catch (error) {
      console.error("Failed to load votes:", error);
      ErrorNotifier.getInstance().showError(error);
    }
  }
  async function Reactions(userConfig) {
    const topicId = extractTopicId();
    if (!topicId) {
      return;
    }
    const config = createConfig(userConfig);
    const currentUser = getCurrentUser();
    initializeStyles(style_default);
    const api = new ReactionsAPI(config, topicId);
    const stateManager = new StateManager;
    const postsMap = new Map;
    const allPostElements = document.querySelectorAll(config.selectors.post);
    const processedPostIds = [];
    allPostElements.forEach((postElement) => {
      const postId = initializePostElements(postElement, config, postsMap, topicId, api, stateManager);
      if (postId) {
        processedPostIds.push(postId);
      }
    });
    if (processedPostIds.length === 0) {
      return;
    }
    const dataLoadPromises = [];
    if (config.reactions) {
      dataLoadPromises.push(loadReactionsData(api, processedPostIds, postsMap, currentUser, stateManager));
    }
    if (config.votes) {
      dataLoadPromises.push(loadVotesData(api, processedPostIds, postsMap, currentUser, stateManager));
    }
    await Promise.allSettled(dataLoadPromises);
  }
  window.Reactions = Reactions;
})();
