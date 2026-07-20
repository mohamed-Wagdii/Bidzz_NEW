import { useEffect } from "react";

const APP_NAME = "BIDZONE";

/**
 * Sets the browser tab title dynamically.
 * Usage:  usePageTitle("Dashboard")  →  "Dashboard | BIDZONE"
 *         usePageTitle()             →  "BIDZONE | Online Auction Platform"
 *
 * @param {string} [pageTitle] - The page-specific title (omit for home/default)
 */
export function usePageTitle(pageTitle) {
  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | ${APP_NAME}`;
    } else {
      document.title = `${APP_NAME} | Online Auction Platform`;
    }

    // Restore default when component unmounts
    return () => {
      document.title = `${APP_NAME} | Online Auction Platform`;
    };
  }, [pageTitle]);
}
