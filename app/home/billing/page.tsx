"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getSubscriptionPlans, getSubscriptionStatus, createCheckoutSession } from "@/services/api";
import { SubscriptionPlan, Subscription } from "@/types/subscription";

export default function BillingPage() {
  return (
    <AppShell activeMenu="billing" syncOnMount={false} hideSidebarOnDesktop>
      <BillingContent />
    </AppShell>
  );
}

const ENTERPRISE_WHATSAPP = "6285724684169";

function BillingContent() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getSubscriptionPlans(), getSubscriptionStatus()])
      .then(([plansData, subData]) => {
        setPlans(plansData);
        setSubscription(subData);
      })
      .catch(() => setError("Gagal memuat data langganan. Silakan muat ulang halaman."))
      .finally(() => setLoading(false));
  }, []);

  const activePlanSlug = subscription?.plan_slug ?? "free";

  async function handleProCheckout(plan: SubscriptionPlan) {
    setCheckingOut(plan.id);
    setError(null);
    try {
      const origin = window.location.origin;
      const checkoutUrl = await createCheckoutSession(
        plan.id,
        `${origin}/home/billing?payment=success`,
        `${origin}/home/billing?payment=cancelled`
      );
      window.location.href = checkoutUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memulai pembayaran");
      setCheckingOut(null);
    }
  }

  function handleEnterpriseContact() {
    const message = encodeURIComponent(
      "Halo, saya tertarik dengan paket Enterprise Hukum AI. Boleh saya mendapatkan informasi lebih lanjut?"
    );
    window.open(`https://wa.me/${ENTERPRISE_WHATSAPP}?text=${message}`, "_blank", "noopener");
  }

  function formatPrice(plan: SubscriptionPlan): string {
    if (plan.slug === "enterprise") return "Hubungi Kami";
    if (plan.price === 0) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
      .format(plan.price);
  }

  function getPeriodLabel(plan: SubscriptionPlan): string {
    if (plan.slug === "enterprise" || plan.price === 0) return "";
    return `/${plan.interval === "month" ? "bulan" : "tahun"}`;
  }

  function renderButton(plan: SubscriptionPlan) {
    const isCurrent = plan.slug === activePlanSlug;
    const isLoading = checkingOut === plan.id;

    if (isCurrent) {
      return (
        <button
          disabled
          className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400 cursor-default"
        >
          Paket Aktif
        </button>
      );
    }

    if (plan.slug === "enterprise") {
      return (
        <button
          onClick={handleEnterpriseContact}
          className="w-full py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          Hubungi Sales
        </button>
      );
    }

    if (plan.slug === "pro") {
      return (
        <button
          onClick={() => handleProCheckout(plan)}
          disabled={isLoading}
          className="w-full py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors"
        >
          {isLoading ? "Memproses..." : "Pilih Paket Pro"}
        </button>
      );
    }

    return (
      <button
        disabled
        className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400 cursor-default"
      >
        Pilih Paket
      </button>
    );
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola langganan dan pembayaran Anda.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
              <div className="space-y-2 mb-6">
                {[1, 2, 3, 4].map((j) => <div key={j} className="h-4 bg-gray-100 rounded" />)}
              </div>
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola langganan dan pembayaran Anda.</p>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Current plan banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 mb-7 text-white shadow-lg shadow-blue-200 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-blue-100 text-xs font-medium uppercase tracking-wide mb-0.5">Paket Aktif Anda</p>
          <p className="text-xl font-bold">{subscription?.plan_name ?? "Gratis"}</p>
          {subscription?.current_period_end ? (
            <p className="text-blue-200 text-sm mt-0.5">
              Aktif hingga {new Date(subscription.current_period_end).toLocaleDateString("id-ID")}
            </p>
          ) : (
            <p className="text-blue-200 text-sm mt-0.5">Diperpanjang otomatis setiap bulan</p>
          )}
        </div>
        {activePlanSlug === "free" && (
          <button
            onClick={() => {
              const proPlan = plans.find((p) => p.slug === "pro");
              if (proPlan) handleProCheckout(proPlan);
            }}
            className="px-5 py-2 bg-white text-blue-700 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-colors shrink-0"
          >
            Upgrade Sekarang
          </button>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
        {plans.map((plan) => {
          const isCurrent = plan.slug === activePlanSlug;
          const isPopular = plan.slug === "pro";
          return (
            <div
              key={plan.id}
              className={[
                "bg-white rounded-xl border p-6 flex flex-col shadow-sm transition-shadow hover:shadow-md",
                isCurrent ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200",
              ].join(" ")}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-1">
                    <span className="text-2xl font-extrabold text-blue-600">{formatPrice(plan)}</span>
                    {getPeriodLabel(plan) && (
                      <span className="text-sm text-gray-400">{getPeriodLabel(plan)}</span>
                    )}
                  </div>
                </div>
                {isPopular && (
                  <span className="text-xs bg-blue-600 text-white font-semibold px-2.5 py-1 rounded-full">
                    Populer
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

              {renderButton(plan)}
            </div>
          );
        })}
      </div>

      {/* Billing history */}
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
