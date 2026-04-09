"use client";

import AppShell from "@/components/AppShell";

export default function BillingPage() {
  return (
    <AppShell activeMenu="billing" syncOnMount={false} hideSidebarOnDesktop>
      <BillingContent />
    </AppShell>
  );
}

const plans = [
  {
    id: "free",
    name: "Gratis",
    price: "Rp 0",
    period: "/bulan",
    badge: null,
    current: true,
    cta: "Paket Aktif",
    features: [
      "5 pertanyaan chatbot / hari",
      "Pencarian regulasi dasar",
      "Ringkasan 3 dokumen / bulan",
      "Akses komunitas",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "Rp 299.000",
    period: "/bulan",
    badge: "Populer",
    current: false,
    cta: "Pilih Paket Pro",
    features: [
      "Pertanyaan chatbot tak terbatas",
      "Pencarian & filter lanjutan",
      "Ringkasan dokumen tak terbatas",
      "Analisis risiko kontrak",
      "Draft dokumen otomatis",
      "Notifikasi regulasi real-time",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Hubungi Kami",
    period: "",
    badge: null,
    current: false,
    cta: "Hubungi Sales",
    features: [
      "Semua fitur Pro",
      "Multi-pengguna & tim",
      "Akses API penuh",
      "Dashboard analitik lanjutan",
      "Integrasi kustom",
      "Dukungan prioritas 24/7",
    ],
  },
];

function BillingContent() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola langganan dan pembayaran Anda.</p>
      </div>

      {/* Current plan banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 mb-7 text-white shadow-lg shadow-blue-200 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-blue-100 text-xs font-medium uppercase tracking-wide mb-0.5">Paket Aktif Anda</p>
          <p className="text-xl font-bold">Gratis</p>
          <p className="text-blue-200 text-sm mt-0.5">Diperpanjang otomatis setiap bulan</p>
        </div>
        <button className="px-5 py-2 bg-white text-blue-700 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-colors shrink-0">
          Upgrade Sekarang
        </button>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={[
              "bg-white rounded-xl border p-6 flex flex-col shadow-sm transition-shadow hover:shadow-md",
              plan.current
                ? "border-blue-500 ring-2 ring-blue-500/20"
                : "border-gray-200",
            ].join(" ")}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-1">
                  <span className="text-2xl font-extrabold text-blue-600">{plan.price}</span>
                  {plan.period && <span className="text-sm text-gray-400">{plan.period}</span>}
                </div>
              </div>
              {plan.badge && (
                <span className="text-xs bg-blue-600 text-white font-semibold px-2.5 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
            </div>

            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={[
                "w-full py-2.5 rounded-lg text-sm font-semibold transition-colors",
                plan.current
                  ? "bg-gray-100 text-gray-400 cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 text-white",
              ].join(" ")}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Billing history (placeholder) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Riwayat Pembayaran</h3>
        <div className="text-center py-10">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Belum ada riwayat pembayaran</p>
          <p className="text-xs text-gray-400 mt-1">Riwayat transaksi akan muncul di sini</p>
        </div>
      </div>
    </div>
  );
}
