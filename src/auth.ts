import type { UserInfo } from "./types";

/**
 * Get current user information from the logged-in-as link
 */
export function getCurrentUser(): UserInfo | null {
	const loggedInLink = document.getElementById(
		"logged-in-as"
	) as HTMLAnchorElement;

	if (!loggedInLink?.href) {
		return null;
	}

	const url = new URL(loggedInLink.href);
	const userId = url.searchParams.get("showuser");

	return userId ? { userId: parseInt(userId) } : null;
}
