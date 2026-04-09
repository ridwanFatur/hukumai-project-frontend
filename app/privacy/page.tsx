"use client";

import Link from "next/link";

export default function PrivacyPage() {
	return (
		<div className="min-h-dvh bg-white flex flex-col px-6 py-10">
			{/* Header logo */}
			<div className="flex items-center gap-2 mb-10">
				<div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
					<ScaleLogoIcon />
				</div>
				<span className="font-bold text-slate-900 text-xl tracking-tight">Hukum AI</span>
			</div>

			{/* Content Wrapper */}
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-extrabold text-slate-900 mb-4">Kebijakan Privasi</h1>
				<p className="text-slate-500 text-base mb-8">
					Kebijakan privasi ini menjelaskan bagaimana Hukum AI mengumpulkan, menggunakan,
					menyimpan, dan melindungi data Anda.
				</p>

				<div className="space-y-8 text-slate-700 text-[15px] leading-relaxed">
					<section>
						<h2 className="text-xl font-semibold text-slate-900 mb-2">1. Pengumpulan Data</h2>
						<p>
							Kami mengumpulkan data yang Anda berikan secara langsung, termasuk email,
							informasi profil, dan dokumen yang Anda unggah untuk dianalisis.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-slate-900 mb-2">2. Penggunaan Data</h2>
						<p>
							Data digunakan untuk meningkatkan akurasi AI, memproses analisis, dan memberikan
							rekomendasi hukum yang relevan. Hukum AI tidak menjual data kepada pihak ketiga.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-slate-900 mb-2">3. Keamanan & Enkripsi</h2>
						<p>
							Semua data diproteksi menggunakan enkripsi modern. Sistem kami juga diaudit secara
							berkala untuk menjaga integritas dan keamanan informasi Anda.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-slate-900 mb-2">4. Akses & Kontrol</h2>
						<p>
							Anda dapat meminta penghapusan akun, data, atau riwayat chat kapan saja melalui
							menu pengaturan akun atau dengan menghubungi tim kami.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold text-slate-900 mb-2">5. Perubahan Kebijakan</h2>
						<p>
							Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan
							diumumkan di halaman ini.
						</p>
					</section>
				</div>

				{/* Back link */}
				<div className="mt-12">
					<Link
						href="/login"
						className="text-blue-600 font-medium hover:underline text-sm"
					>
						← Kembali ke halaman login
					</Link>
				</div>
			</div>

			{/* Footer */}
			<p className="mt-auto pt-10 text-xs text-slate-400 text-center">
				© 2025 Hukum AI. Hak cipta dilindungi.
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