/**
 * useApi.ts — SWR-based caching hooks for all backend API calls.
 *
 * Why SWR?
 *   - Stale-while-revalidate: shows cached data instantly while fetching fresh data
 *     in the background, giving users a responsive experience without stale content.
 *   - Automatic deduplication: multiple components requesting the same data within
 *     the same render cycle share a single network request.
 *   - Built-in cache invalidation via `mutate()`.
 *
 * How to adjust cache durations:
 *   - `revalidateOnFocus`: set to false for truly static data (e.g. subscription plans).
 *   - `dedupingInterval`: the window (ms) in which duplicate fetches are collapsed.
 *   - `refreshInterval`: set > 0 to poll automatically (e.g. for subscription status).
 *
 * How to invalidate a cache entry after a mutation:
 *   import { mutate } from "swr";
 *   await mutate(CACHE_KEYS.user);  // clears & re-fetches user data
 */

import useSWR, { mutate } from "swr";
import {
  getUser,
  getChatSessions,
  getChatMessages,
  getSubscriptionPlans,
  getSubscriptionStatus,
} from "@/services/api";
import { User } from "@/types/user";
import { ChatSession, ChatMessage } from "@/types/chat";
import { SubscriptionPlan, Subscription } from "@/types/subscription";

// ── Cache keys ────────────────────────────────────────────────────────────────
// Centralised so that callers can use the same key for `mutate()` calls.
export const CACHE_KEYS = {
  user: "/api/users/me",
  chatSessions: "/api/chat/sessions",
  chatMessages: (sessionId: number) =>
    `/api/chat/sessions/${sessionId}/messages`,
  subscriptionPlans: "/api/subscriptions/plans",
  subscriptionStatus: "/api/subscriptions/status",
} as const;

// ── useUser ───────────────────────────────────────────────────────────────────
// Cache strategy: 5 min dedup window, revalidate on window focus.
// User profile changes infrequently; showing slightly stale data for up to
// 5 minutes is acceptable. Revalidation on focus keeps it fresh after tabs switch.
//
// TODO: increase dedupingInterval if profile calls are still too frequent under load.
export function useUser() {
  return useSWR<User>(CACHE_KEYS.user, getUser, {
    dedupingInterval: 5 * 60 * 1000, // 5 minutes
    revalidateOnFocus: true,
    onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
      // Do not retry on 401 — session has expired, let the error propagate.
      if (error?.message?.includes("401") || error?.message?.includes("Sesi")) return;
      if (retryCount >= 2) return;
      setTimeout(() => revalidate({ retryCount }), 3000);
    },
  });
}

// ── useChatSessions ───────────────────────────────────────────────────────────
// Cache strategy: 30 sec dedup window, no focus revalidation.
// Session list can be slightly stale; new sessions created via createChatSession()
// should call `mutate(CACHE_KEYS.chatSessions)` to invalidate immediately.
//
// TODO: lower dedupingInterval (e.g. 10 000) if users expect live updates.
export function useChatSessions() {
  return useSWR<ChatSession[]>(CACHE_KEYS.chatSessions, getChatSessions, {
    dedupingInterval: 30 * 1000, // 30 seconds
    revalidateOnFocus: false,
  });
}

// ── useChatMessages ───────────────────────────────────────────────────────────
// Cache strategy: 15 sec dedup window. Messages arrive via WebSocket so the
// HTTP endpoint is only polled on mount. After receiving a WS message, call
// `mutate(CACHE_KEYS.chatMessages(id))` to keep the SWR cache in sync.
//
// TODO: if WebSocket is reliable enough, set refreshInterval: 0 and rely solely on WS.
export function useChatMessages(sessionId: number | null) {
  return useSWR<ChatMessage[]>(
    sessionId !== null ? CACHE_KEYS.chatMessages(sessionId) : null,
    () => getChatMessages(sessionId!),
    {
      dedupingInterval: 15 * 1000, // 15 seconds
      revalidateOnFocus: false,
    }
  );
}

// ── useSubscriptionPlans ──────────────────────────────────────────────────────
// Cache strategy: 10 min dedup, no focus revalidation.
// Plans are static content managed by admins and change extremely rarely.
// Long cache avoids hammering the backend on every page visit to the billing page.
//
// TODO: increase to 30 min or add Next.js fetch cache on the server side once
//       SSR is introduced to the billing page.
export function useSubscriptionPlans() {
  return useSWR<SubscriptionPlan[]>(
    CACHE_KEYS.subscriptionPlans,
    getSubscriptionPlans,
    {
      dedupingInterval: 10 * 60 * 1000, // 10 minutes
      revalidateOnFocus: false,
    }
  );
}

// ── useSubscriptionStatus ─────────────────────────────────────────────────────
// Cache strategy: 2 min dedup, revalidate on focus.
// Subscription status changes after payment events (handled by Stripe webhook).
// 2 min is short enough that users returning from Stripe checkout get fresh data.
//
// TODO: after a successful checkout redirect, call mutate(CACHE_KEYS.subscriptionStatus)
//       so users see the updated plan immediately without waiting for the 2 min window.
export function useSubscriptionStatus() {
  return useSWR<Subscription | null>(
    CACHE_KEYS.subscriptionStatus,
    getSubscriptionStatus,
    {
      dedupingInterval: 2 * 60 * 1000, // 2 minutes
      revalidateOnFocus: true,
    }
  );
}

// ── Manual invalidation helpers ───────────────────────────────────────────────
// Call these after mutations to keep the cache in sync without a full page reload.

/** Invalidate the user profile cache (e.g. after updating profile). */
export const invalidateUser = () => mutate(CACHE_KEYS.user);

/** Invalidate the chat sessions list (e.g. after creating a new session). */
export const invalidateChatSessions = () => mutate(CACHE_KEYS.chatSessions);

/** Invalidate messages for a specific session (e.g. after receiving a WS message). */
export const invalidateChatMessages = (sessionId: number) =>
  mutate(CACHE_KEYS.chatMessages(sessionId));

/** Invalidate subscription status (e.g. after returning from Stripe checkout). */
export const invalidateSubscriptionStatus = () =>
  mutate(CACHE_KEYS.subscriptionStatus);
