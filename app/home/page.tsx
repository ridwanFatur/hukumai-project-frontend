"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, getUser, clearSessionToken } from "@/services/api";
import { User } from "@/types/user";

export default function HomePage() {
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initUser = async () => {
      try {
        const clerkToken = await getToken();
        if (!clerkToken) throw new Error("Token tidak tersedia");

        // Sync user with backend (creates or updates user in DB)
        await loginUser(clerkToken);

        // Fetch user data from backend
        const userData = await getUser();
        setUser(userData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui"
        );
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, [getToken]);

  const handleSignOut = async () => {
    clearSessionToken();
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm p-8 text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Hukum AI</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Keluar
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-1">
          <p className="text-gray-500 text-sm">Selamat datang,</p>
          <h2 className="text-2xl font-semibold text-gray-900">
            {user?.name || user?.email || "Pengguna"}
          </h2>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
      </main>
    </div>
  );
}
