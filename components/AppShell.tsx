"use client";

import { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { loginUser, getUser, clearSessionToken } from "@/services/api";
import { User } from "@/types/user";
import Sidebar, { MenuId } from "./Sidebar";
import LogoutDialog from "./LogoutDialog";

interface AppShellProps {
	activeMenu: MenuId;
	children: React.ReactNode;
	/** Pass true on the entry page (/home) to run loginUser sync before getUser */
	syncOnMount?: boolean;
	pageTitle?: string;
}

export default function AppShell({
	activeMenu,
	children,
	syncOnMount = false,
	pageTitle,
}: AppShellProps) {
	const { getToken } = useAuth();
	const { signOut } = useClerk();
	const router = useRouter();

	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showLogout, setShowLogout] = useState(false);

	useEffect(() => {
		const init = async () => {
			try {
				if (syncOnMount) {
					const clerkToken = await getToken();
					if (!clerkToken) throw new Error("Token tidak tersedia");
					await loginUser(clerkToken);
				}
				const userData = await getUser();
				setUser(userData);
			} catch {
				clearSessionToken();
				router.push("/login");
			} finally {
				setLoading(false);
			}
		};
		init();
	}, [getToken, syncOnMount, router]);

	const handleMenuSelect = (id: MenuId) => {
		setSidebarOpen(false);
		if (id === "profile" || id === "settings" || id === "billing") {
			router.push(`/home/${id}`);
		} else {
			router.push(`/home?view=${id}`);
		}
	};

	const handleLogoutConfirm = async () => {
		clearSessionToken();
		await signOut();
		router.push("/login");
	};

	if (loading) {
		return (
			<div className="min-h-dvh flex items-center justify-center bg-[#f0f4ff]">
				<div className="flex flex-col items-center gap-3">
					<div className="w-9 h-9 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
					<p className="text-sm text-slate-400">Memuat...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen overflow-hidden bg-[#f0f4ff]">
			<Sidebar
				activeMenu={activeMenu}
				onMenuSelect={handleMenuSelect}
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				user={user}
				onLogout={() => setShowLogout(true)}
			/>

			{/* Main column */}
			<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
				{/* Top bar */}
				<header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0 shadow-sm">
					{/* Hamburger – mobile only */}
					<button
						onClick={() => setSidebarOpen(true)}
						className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
						aria-label="Buka menu"
					>
						<HamburgerIcon />
					</button>

					<div className="flex-1 min-w-0">
						<h1 className="text-sm font-semibold text-gray-800 truncate">
							{pageTitle ?? menuLabel(activeMenu)}
						</h1>
					</div>

					{/* User avatar */}
					{user && (
						<div
							className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md"
							title={user.name || user.email}
						>
							<span className="text-white text-xs font-bold">
								{(user.name || user.email || "?")[0].toUpperCase()}
							</span>
						</div>
					)}
				</header>

				{/* Page content */}
				<main className="flex-1 overflow-y-auto p-5 md:p-6">{children}</main>
			</div>

			{showLogout && (
				<LogoutDialog
					onConfirm={handleLogoutConfirm}
					onCancel={() => setShowLogout(false)}
				/>
			)}
		</div>
	);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function menuLabel(id: MenuId): string {
	const labels: Record<MenuId, string> = {
		chatbot: "Chatbot Q&A Hukum (Natural Language)",
		search: "Pencarian Regulasi & Putusan yang Cerdas",
		summary: "Ringkasan Dokumen Hukum Otomatis",
		explanation: "Penjelasan Pasal untuk Orang Awam",
		draft: "Draft Dokumen Hukum Otomatis",
		contract: "Analisis Risiko Hukum Kontrak",
		"case-mapping": "Pemetaan Risiko Kasus dari Input User",
		notifications: "Notifikasi Perubahan Regulasi & Putusan",
		statistics: "Statistik Tren Yuridis & Insight",
		profile: "Profil",
		settings: "Setting",
		billing: "Billing",
	};
	return labels[id] ?? id;
}

function HamburgerIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
		>
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="18" x2="21" y2="18" />
		</svg>
	);
}
