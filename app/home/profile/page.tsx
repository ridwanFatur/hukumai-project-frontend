"use client";

import AppShell from "@/components/AppShell";

export default function ProfilePage() {
  return (
    <AppShell activeMenu="profile" syncOnMount={false} hideSidebarOnDesktop>
      <ProfileContent />
    </AppShell>
  );
}

function ProfileContent() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola informasi profil dan akun Anda.</p>
      </div>

      {/* Avatar section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Foto Profil</h3>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
            <span className="text-white text-3xl font-bold">?</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Foto profil diambil dari akun Google Anda.
            </p>
            <button className="px-4 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors border border-blue-200">
              Perbarui Foto
            </button>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Informasi Pribadi</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Nama lengkap Anda"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              readOnly
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              placeholder="email@contoh.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 placeholder-gray-400 text-sm focus:outline-none cursor-not-allowed"
              readOnly
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Email tidak dapat diubah karena terhubung dengan akun Google.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Profesi / Jabatan
            </label>
            <input
              type="text"
              placeholder="Contoh: Pengacara, Notaris, Mahasiswa Hukum"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Organisasi / Kantor Hukum
            </label>
            <input
              type="text"
              placeholder="Nama organisasi atau kantor hukum"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Informasi Akun</h3>
        <div className="space-y-3">
          {[
            { label: "Status Akun", value: "Aktif", badge: "green" },
            { label: "Bergabung Sejak", value: "—" },
            { label: "Login Terakhir", value: "—" },
            { label: "Metode Login", value: "Google OAuth" },
          ].map(({ label, value, badge }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500">{label}</span>
              {badge === "green" ? (
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">{value}</span>
              ) : (
                <span className="text-sm text-gray-800 font-medium">{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
