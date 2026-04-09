"use client";

export type MenuId =
	| "chatbot"
	| "search"
	| "summary"
	| "explanation"
	| "draft"
	| "contract"
	| "case-mapping"
	| "notifications"
	| "statistics"
	| "profile"
	| "settings"
	| "billing";

interface MenuItem {
	id: MenuId;
	label: string;
	icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
	{ id: "chatbot", label: "Chatbot Q&A Hukum (Natural Language)", icon: <ChatIcon /> },
	{ id: "search", label: "Pencarian Regulasi & Putusan yang Cerdas", icon: <SearchIcon /> },
	{ id: "summary", label: "Ringkasan Dokumen Hukum Otomatis", icon: <DocumentIcon /> },
	{ id: "explanation", label: "Penjelasan Pasal untuk Orang Awam", icon: <BookIcon /> },
	{ id: "draft", label: "Draft Dokumen Hukum Otomatis", icon: <PencilIcon /> },
	{ id: "contract", label: "Analisis Risiko Hukum Kontrak", icon: <ShieldIcon /> },
	{ id: "case-mapping", label: "Pemetaan Risiko Kasus dari Input User", icon: <MapIcon /> },
	{ id: "notifications", label: "Notifikasi Perubahan Regulasi & Putusan", icon: <BellIcon /> },
	{ id: "statistics", label: "Statistik Tren Yuridis & Insight", icon: <ChartIcon /> },
];

const bottomMenuItems: MenuItem[] = [
	{ id: "profile", label: "Profil", icon: <UserIcon /> },
	{ id: "settings", label: "Setting", icon: <GearIcon /> },
	{ id: "billing", label: "Billing", icon: <CreditCardIcon /> },
];

interface SidebarProps {
	activeMenu: MenuId;
	onMenuSelect: (id: MenuId) => void;
	isOpen: boolean;
	onClose: () => void;
	user: { name?: string; email?: string } | null;
	onLogout: () => void;
}

export default function Sidebar({
	activeMenu,
	onMenuSelect,
	isOpen,
	onClose,
	user,
	onLogout,
}: SidebarProps) {
	return (
		<>
			{/* Mobile backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/60 md:hidden"
					onClick={onClose}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar panel */}
			<aside
				className={[
					"fixed inset-y-0 left-0 z-50 w-64 flex flex-col",
					"bg-linear-to-b from-blue-950 to-blue-900",
					"transition-transform duration-300 ease-in-out",
					"md:relative md:translate-x-0 md:shrink-0",
					isOpen ? "translate-x-0" : "-translate-x-full",
				].join(" ")}
			>
				{/* Brand header */}
				<div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
					<div className="flex items-center gap-2.5">
						<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
							<ScaleIcon />
						</div>
						<span className="font-bold text-white text-lg tracking-tight">Hukum AI</span>
					</div>
					<button
						onClick={onClose}
						className="md:hidden p-1.5 rounded-lg text-blue-300 hover:bg-white/10 hover:text-white transition-colors"
						aria-label="Tutup sidebar"
					>
						<XIcon />
					</button>
				</div>

				{/* Main navigation */}
				<nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 sidebar-scroll">
					{menuItems.map((item) => (
						<NavButton
							key={item.id}
							item={item}
							active={activeMenu === item.id}
							onClick={() => onMenuSelect(item.id)}
						/>
					))}
				</nav>

				{/* Footer section */}
				<div className="border-t border-white/10 px-2 pt-3 pb-4 space-y-0.5">
					{bottomMenuItems.map((item) => (
						<NavButton
							key={item.id}
							item={item}
							active={activeMenu === item.id}
							onClick={() => onMenuSelect(item.id)}
						/>
					))}

					{/* Divider */}
					<div className="my-1 mx-3 border-t border-white/10" />

					{/* User info */}
					{user && (
						<div className="px-3 py-2">
							<p className="text-xs text-blue-200 font-medium truncate">
								{user.name || user.email}
							</p>
							{user.name && user.email && (
								<p className="text-xs text-blue-400 truncate">{user.email}</p>
							)}
						</div>
					)}

					{/* Logout button */}
					<button
						onClick={onLogout}
						className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
					>
						<span className="w-5 h-5 shrink-0">
							<LogoutIcon />
						</span>
						<span>Keluar</span>
					</button>
				</div>
			</aside>
		</>
	);
}

// ── NavButton ────────────────────────────────────────────────────────────────

function NavButton({
	item,
	active,
	onClick,
}: {
	item: { label: string; icon: React.ReactNode };
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={[
				"w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left",
				"transition-colors duration-150",
				active
					? "bg-white/15 text-white font-medium shadow-inner"
					: "text-blue-100 hover:bg-white/10 hover:text-white",
			].join(" ")}
		>
			<span className="w-5 h-5 shrink-0">{item.icon}</span>
			<span className="text-sm leading-snug">{item.label}</span>
		</button>
	);
}

// ── SVG Icon helper ──────────────────────────────────────────────────────────

function Icon({ children }: { children: React.ReactNode }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.75}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-full h-full"
		>
			{children}
		</svg>
	);
}

function ScaleIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
			<path d="M12 3v18M4 6l8 2 8-2M4 6l4 6H0L4 6zM20 6l4 6h-8l4-6zM6 21h12" />
		</svg>
	);
}

function ChatIcon() {
	return <Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><circle cx="9" cy="10" r=".5" fill="currentColor" /><circle cx="12" cy="10" r=".5" fill="currentColor" /><circle cx="15" cy="10" r=".5" fill="currentColor" /></Icon>;
}

function SearchIcon() {
	return <Icon><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>;
}

function DocumentIcon() {
	return <Icon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></Icon>;
}

function BookIcon() {
	return <Icon><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></Icon>;
}

function PencilIcon() {
	return <Icon><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>;
}

function ShieldIcon() {
	return <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>;
}

function MapIcon() {
	return <Icon><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></Icon>;
}

function BellIcon() {
	return <Icon><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Icon>;
}

function ChartIcon() {
	return <Icon><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></Icon>;
}

function UserIcon() {
	return <Icon><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>;
}

function GearIcon() {
	return <Icon><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Icon>;
}

function CreditCardIcon() {
	return <Icon><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></Icon>;
}

function XIcon() {
	return <div className="w-6 h-6">
		<Icon>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</Icon>
	</div>
}

function LogoutIcon() {
	return <Icon><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></Icon>;
}
