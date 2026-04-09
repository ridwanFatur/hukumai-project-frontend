import { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SESSION_TOKEN_KEY = "hukumai_session_token";

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
