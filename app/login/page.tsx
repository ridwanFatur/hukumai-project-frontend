"use client";

import { useSignIn } from "@clerk/nextjs/legacy";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
	const { signIn, isLoaded } = useSignIn();
	const { isSignedIn } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isSignedIn) {
			router.push("/home");
		}
	}, [isSignedIn, router]);

	const handleGoogleLogin = () => {
		if (!isLoaded || !signIn) return;
		signIn.authenticateWithRedirect({
			strategy: "oauth_google",
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/home",
		});
	};

	return (
		<div className="min-h-screen flex">
			{/* ── Left panel (desktop only) ─────────────────────────────────────── */}
			<div className="hidden lg:flex flex-col w-[55%] relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-blue-900">
				{/* Decorative orbs */}
				<div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-700/20 blur-3xl" />
				<div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl" />
				<div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl" />

				{/* Grid pattern overlay */}
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
						backgroundSize: "40px 40px",
					}}
				/>

				<div className="relative z-10 flex flex-col h-full p-12">
					{/* Logo */}
					<div className="flex items-center gap-3 mb-auto">
						<div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
							<ScaleLogoIcon />
						</div>
						<span className="font-bold text-white text-xl tracking-tight">Hukum AI</span>
					</div>

					{/* Hero text */}
					<div className="mt-auto mb-12">
						<h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
							Solusi Hukum
							<br />
							<span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-cyan-300">
								Berbasis Kecerdasan
							</span>
							<br />
							Buatan
						</h1>
						<p className="text-blue-200 text-lg leading-relaxed max-w-md">
							Analisis dokumen, temukan regulasi, dan dapatkan panduan hukum yang akurat — semuanya didukung oleh AI terkini.
						</p>
					</div>

					{/* Feature list */}
					<div className="grid grid-cols-2 gap-3 mb-12">
						{[
							{ icon: "💬", label: "Chatbot Q&A Hukum", desc: "Tanya jawab natural" },
							{ icon: "🔍", label: "Pencarian Cerdas", desc: "Regulasi & putusan" },
							{ icon: "📄", label: "Analisis Kontrak", desc: "Deteksi risiko otomatis" },
							{ icon: "✍️", label: "Draft Dokumen", desc: "Generate dalam detik" },
						].map(({ icon, label, desc }) => (
							<div
								key={label}
								className="flex items-start gap-3 bg-white/8 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm"
							>
								<span className="text-xl leading-none mt-0.5">{icon}</span>
								<div>
									<p className="text-sm font-semibold text-white">{label}</p>
									<p className="text-xs text-blue-300 mt-0.5">{desc}</p>
								</div>
							</div>
						))}
					</div>

					{/* Trust indicators */}
					<div className="flex items-center gap-6 text-blue-300 text-xs">
						<div className="flex items-center gap-1.5">
							<svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
							</svg>
							Data terenkripsi
						</div>
						<div className="flex items-center gap-1.5">
							<svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
							</svg>
							Sesuai regulasi PDPA
						</div>
						<div className="flex items-center gap-1.5">
							<svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
							</svg>
							99.9% uptime
						</div>
					</div>
				</div>
			</div>

			{/* ── Right panel (login form) ───────────────────────────────────────── */}
			<div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-white">
				{/* Mobile-only logo */}
				<div className="lg:hidden flex items-center gap-2.5 mb-10">
					<div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
						<ScaleLogoIcon />
					</div>
					<span className="font-bold text-slate-900 text-xl tracking-tight">Hukum AI</span>
				</div>

				<div className="w-full max-w-sm">
					{/* Header */}
					<div className="mb-10">
						<h2 className="text-3xl font-extrabold text-slate-900 mb-2">Selamat datang</h2>
						<p className="text-slate-500 text-base">
							Masuk untuk mengakses platform hukum berbasis AI.
						</p>
					</div>

					{/* Google login button */}
					<button
						onClick={handleGoogleLogin}
						disabled={!isLoaded}
						className="w-full flex items-center gap-4 px-5 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 border-2 border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
					>
						<div className="shrink-0">
							<GoogleIcon />
						</div>
						<span className="flex-1 text-center text-slate-700 font-semibold text-[15px] group-hover:text-slate-900 transition-colors">
							Masuk dengan Google
						</span>
					</button>

					{/* Terms */}
					<p className="text-xs text-slate-400 text-center leading-relaxed my-8">
						Dengan masuk, Anda menyetujui{" "}
						<Link href="/terms" className="text-blue-600 font-medium hover:underline">
							Syarat & Ketentuan
						</Link>{" "}
						serta{" "}
						<Link href="/privacy" className="text-blue-600 font-medium hover:underline">
							Kebijakan Privasi
						</Link>{" "}
						kami.
					</p>
				</div>

				{/* Footer */}
				<p className="mt-auto pt-10 text-xs text-slate-400 text-center">
					© 2026 Hukum AI. Hak cipta dilindungi.
				</p>
			</div>
		</div>
	);
}

// ── Icons ────────────────────────────────────────────────────────────────────

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

function GoogleIcon() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
			<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
			<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
			<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
		</svg>
	);
}
