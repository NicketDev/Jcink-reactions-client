import type { ReactionsConfig } from "./config";
import {
	NetworkError,
	AuthenticationError,
	withRetry,
	ErrorNotifier
} from "./utils/errors";

export class ReactionsAPI {
	private config: ReactionsConfig;
	private topicId: string;
	private errorNotifier = ErrorNotifier.getInstance();

	constructor(config: ReactionsConfig, topicId: string) {
		this.config = config;
		this.topicId = topicId;
	}

	/**
	 * Make a GET request to the reactions server
	 */
	async get(
		path: string,
		getOptions?: { query?: Record<string, string> }
	): Promise<Response> {
		const sp = new URLSearchParams(getOptions?.query);
		sp.set("forumUrl", location.origin);
		sp.set("topicId", this.topicId);

		return withRetry(
			async () => {
				const response = await fetch(`${this.config.server}${path}?${sp}`, {
					headers: {
						"Content-Type": "application/json"
					}
				});

				if (!response.ok) {
					throw new NetworkError(
						`GET ${path} failed`,
						response.status,
						response.status >= 500 || response.status === 429
					);
				}

				return response;
			},
			{
				maxAttempts: this.config.performance.maxRetries,
				delay: this.config.performance.retryDelay,
				backoff: this.config.performance.retryBackoff
			}
		);
	}

	/**
	 * Make a PUT request to the reactions server with JWT authentication
	 */
	async put(path: string, body: any): Promise<Response> {
		return withRetry(
			async () => {
				try {
					// @ts-ignore
					const jwt = await authcinkPromise.then((authcink) =>
						authcink.authenticate()
					);

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
							throw new AuthenticationError();
						}
						throw new NetworkError(
							`PUT ${path} failed`,
							response.status,
							response.status >= 500 || response.status === 429
						);
					}

					return response;
				} catch (error) {
					if (
						error instanceof NetworkError ||
						error instanceof AuthenticationError
					) {
						throw error;
					}
					// Authentication failed
					throw new AuthenticationError("Authentication failed");
				}
			},
			{
				maxAttempts: this.config.performance.maxRetries,
				delay: this.config.performance.retryDelay,
				backoff: this.config.performance.retryBackoff
			}
		);
	}
}
