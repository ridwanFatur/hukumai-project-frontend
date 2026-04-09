import { User } from "@/types/user";
import { ChatSession, ChatMessage } from "@/types/chat";
import { SubscriptionPlan, Subscription } from "@/types/subscription";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SESSION_TOKEN_KEY = "hukumai_session_token";

export function getWebSocketURL(): string {
  const base = API_URL.replace(/^http/, "ws");
  const token = getSessionToken();
  return `${base}/ws?token=${token ?? ""}`;
}

export function saveSessionToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  }
}

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

export function clearSessionToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_TOKEN_KEY);
  }
}

export async function loginUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Login gagal");
  }

  const data = await response.json();
  saveSessionToken(data.session_token);
  return data.user;
}

export async function getUser(): Promise<User> {
  const sessionToken = getSessionToken();
  if (!sessionToken) {
    throw new Error("Sesi tidak ditemukan, silakan login kembali");
  }

  const response = await fetch(`${API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (response.status === 401) {
    clearSessionToken();
    throw new Error("Sesi telah berakhir, silakan login kembali");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Gagal mendapatkan data pengguna");
  }

  const data = await response.json();
  return data.user;
}

// ── Chat API ─────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getSessionToken() ?? ""}`,
  };
}

export async function createChatSession(): Promise<ChatSession> {
  const response = await fetch(`${API_URL}/api/chat/sessions`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal membuat sesi chat");
  const data = await response.json();
  return data.session;
}

export async function getChatSessions(): Promise<ChatSession[]> {
  const response = await fetch(`${API_URL}/api/chat/sessions`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat sesi chat");
  const data = await response.json();
  return data.sessions ?? [];
}

export async function getChatMessages(sessionId: number): Promise<ChatMessage[]> {
  const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}/messages`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Gagal memuat pesan");
  const data = await response.json();
  return data.messages ?? [];
}

export async function sendChatMessage(
  sessionId: number,
  content: string
): Promise<ChatMessage> {
  const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error("Gagal mengirim pesan");
  const data = await response.json();
  return data.message;
}

// ── Subscription API ──────────────────────────────────────────────────────────

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await fetch(`${API_URL}/api/subscriptions/plans`);
  if (!response.ok) throw new Error("Gagal mengambil data paket langganan");
  const data = await response.json();
  return data.plans ?? [];
}

export async function getSubscriptionStatus(): Promise<Subscription | null> {
  const response = await fetch(`${API_URL}/api/subscriptions/status`, {
    headers: authHeaders(),
  });
  if (response.status === 401) {
    clearSessionToken();
    throw new Error("Sesi telah berakhir, silakan login kembali");
  }
  if (!response.ok) throw new Error("Gagal mengambil status langganan");
  const data = await response.json();
  return data.subscription ?? null;
}

export async function createCheckoutSession(
  planId: number,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const response = await fetch(`${API_URL}/api/subscriptions/checkout`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ plan_id: planId, success_url: successUrl, cancel_url: cancelUrl }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Gagal membuat sesi pembayaran");
  }
  const data = await response.json();
  return data.checkout_url;
}
