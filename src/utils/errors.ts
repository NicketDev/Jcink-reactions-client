export interface RetryOptions {
	maxAttempts: number;
	delay: number;
	backoff?: "linear" | "exponential";
}

export class NetworkError extends Error {
	constructor(
		message: string,
		public status?: number,
		public isRetryable: boolean = true
	) {
		super(message);
		this.name = "NetworkError";
	}
}

export class AuthenticationError extends Error {
	constructor(message: string = "Authentication required") {
		super(message);
		this.name = "AuthenticationError";
	}
}

/**
 * Retry function with configurable backoff
 */
export async function withRetry<T>(
	fn: () => Promise<T>,
	options: RetryOptions
): Promise<T> {
	let lastError: Error;

	for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error as Error;

			// Don't retry on authentication errors
			if (error instanceof AuthenticationError) {
				throw error;
			}

			// Don't retry on non-retryable network errors
			if (error instanceof NetworkError && !error.isRetryable) {
				throw error;
			}

			// Last attempt failed
			if (attempt === options.maxAttempts) {
				throw lastError;
			}

			// Calculate delay
			let delay = options.delay;
			if (options.backoff === "exponential") {
				delay = options.delay * Math.pow(2, attempt - 1);
			} else if (options.backoff === "linear") {
				delay = options.delay * attempt;
			}

			// Wait before retry
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw lastError!;
}

/**
 * Show user-friendly error notifications
 */
export class ErrorNotifier {
	private static instance: ErrorNotifier;
	private container: HTMLElement | null = null;

	static getInstance(): ErrorNotifier {
		if (!ErrorNotifier.instance) {
			ErrorNotifier.instance = new ErrorNotifier();
		}
		return ErrorNotifier.instance;
	}

	private createContainer(): HTMLElement {
		if (this.container) return this.container;

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

	show(
		message: string,
		type: "error" | "warning" | "info" = "error",
		duration = 5000
	): void {
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

		// Animate in
		requestAnimationFrame(() => {
			notification.style.opacity = "1";
			notification.style.transform = "translateX(0)";
		});

		// Auto remove
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

	showError(error: Error): void {
		let message = "An unexpected error occurred";

		if (error instanceof AuthenticationError) {
			message = "Please log in to vote or react to posts";
		} else if (error instanceof NetworkError) {
			message =
				error.status === 429
					? "Too many requests. Please wait a moment."
					: "Network error. Please check your connection.";
		}

		this.show(message, "error");
	}
}
