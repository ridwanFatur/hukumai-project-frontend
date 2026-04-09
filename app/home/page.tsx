"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppShell, { menuLabel } from "@/components/AppShell";
import PlaceholderView from "@/components/PlaceholderView";
import { MenuId } from "@/components/Sidebar";

const IN_PAGE_MENUS: MenuId[] = [
	"chatbot",
	"search",
	"summary",
	"explanation",
	"draft",
	"contract",
	"case-mapping",
	"notifications",
	"statistics",
];

function HomeContent() {
	const searchParams = useSearchParams();
	const rawView = searchParams.get("view") ?? "chatbot";
	const activeMenu: MenuId = IN_PAGE_MENUS.includes(rawView as MenuId)
		? (rawView as MenuId)
		: "chatbot";

	return (
		<AppShell
			activeMenu={activeMenu}
			syncOnMount={true}
			pageTitle={menuLabel(activeMenu)}
		>
			<PlaceholderView menuId={activeMenu} />
		</AppShell>
	);
}

function LoadingFallback() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-[#f0f4ff]">
			<div className="flex flex-col items-center gap-3">
				<div className="w-9 h-9 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
				<p className="text-sm text-slate-400">Memuat...</p>
			</div>
		</div>
	);
}

export default function HomePage() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<HomeContent />
		</Suspense>
	);
}
