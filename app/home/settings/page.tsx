"use client";

import AppShell from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell activeMenu="settings" syncOnMount={false}>
      <SettingsContent />
    </AppShell>
  );
}

function SettingsContent() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Setting</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola preferensi dan konfigurasi akun Anda.</p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Notifikasi</h3>
        <p className="text-xs text-gray-400 mb-4">Pilih jenis notifikasi yang ingin Anda terima.</p>
        <div className="space-y-4">
          {[
            { id: "reg", label: "Regulasi Baru", desc: "Notifikasi saat ada undang-undang atau peraturan baru" },
            { id: "court", label: "Putusan Pengadilan", desc: "Notifikasi putusan MA dan MK yang relevan" },
            { id: "weekly", label: "Laporan Mingguan", desc: "Ringkasan aktivitas dan tren hukum setiap minggu" },
            { id: "alert", label: "Peringatan Risiko", desc: "Notifikasi saat terdeteksi risiko pada dokumen Anda" },
          ].map(({ id, label, desc }) => (
            <div key={id} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <button
                className="relative mt-0.5 w-11 h-6 bg-gray-200 rounded-full transition-colors hover:bg-gray-300 shrink-0"
                role="switch"
                aria-checked="false"
              >
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Bahasa & Wilayah</h3>
        <p className="text-xs text-gray-400 mb-4">Atur preferensi bahasa dan zona waktu.</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bahasa</label>
            <select className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Bahasa Indonesia</option>
              <option>English</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Zona Waktu</label>
            <select className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>WIB (UTC+7) — Jakarta</option>
              <option>WITA (UTC+8) — Makassar</option>
              <option>WIT (UTC+9) — Jayapura</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Privasi & Keamanan</h3>
        <p className="text-xs text-gray-400 mb-4">Kelola pengaturan privasi data Anda.</p>
        <div className="space-y-3">
          {[
            { label: "Simpan riwayat percakapan", desc: "Percakapan chatbot disimpan untuk penyempurnaan layanan" },
            { label: "Izinkan analisis data anonim", desc: "Membantu kami meningkatkan akurasi analisis hukum" },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <button
                className="relative mt-0.5 w-11 h-6 bg-blue-600 rounded-full transition-colors shrink-0"
                role="switch"
                aria-checked="true"
              >
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
        <h3 className="font-semibold text-red-700 mb-1">Zona Berbahaya</h3>
        <p className="text-xs text-gray-400 mb-4">Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-300 transition-colors">
            Hapus Semua Riwayat
          </button>
          <button className="px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-300 transition-colors">
            Hapus Akun Permanen
          </button>
        </div>
      </div>
    </div>
  );
}
