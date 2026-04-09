"use client";

import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-dvh bg-white flex flex-col px-6 py-10">

			{/* Header logo */}
			<div className="flex items-center gap-2 mb-10">
				<div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
					<ScaleLogoIcon />
				</div>
				<span className="font-bold text-slate-900 text-xl tracking-tight">Hukum AI</span>
			</div>

			{/* Centered Content */}
			<div className="flex-1 flex items-center justify-center">
				<div className="max-w-2xl mx-auto text-center">
					<h1 className="text-4xl font-extrabold text-slate-900 mb-4">404</h1>
					<p className="text-slate-600 text-lg mb-3">Halaman Tidak Ditemukan</p>
					<p className="text-slate-500 text-base mb-8">
						Halaman yang kamu cari tidak tersedia atau mungkin sudah dipindahkan.
					</p>

					<Link
						href="/"
						className="text-blue-600 font-medium hover:underline text-sm"
					>
						← Kembali ke Beranda
					</Link>
				</div>
			</div>

			{/* Footer */}
			<p className="pt-10 text-xs text-slate-400 text-center">
				© 2026 Hukum AI. Hak cipta dilindungi.
			</p>
		</div>
	);
}

function ScaleLogoIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="white"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
		>
			<path d="M12 3v18M4 6l8 2 8-2M4 6l4 6H0L4 6zM20 6l4 6h-8l4-6zM6 21h12" />
		</svg>
	);
}