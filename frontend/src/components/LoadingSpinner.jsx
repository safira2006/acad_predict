// ═══════════════════════════════════════════════════════════════════════════
// FILE: frontend/src/components/LoadingSpinner.jsx
// DEVELOPER: Anak 6 (Frontend - API Client & Shared Components)
// DESKRIPSI: Komponen loading spinner animasi untuk state loading
// ═══════════════════════════════════════════════════════════════════════════

// ─── CARA MEMBUAT KOMPONEN INI ────────────────────────────────────────────────

// STEP 1: Buat default export function LoadingSpinner
// - Terima props: { message = 'Memuat data...' }  (message punya default value)
// - Return JSX berupa div wrapper dengan class:
//   "flex flex-col items-center justify-center py-20 gap-4"

// STEP 2: Di dalam wrapper, buat div container untuk spinner dengan class "relative"
// - Di dalamnya buat 2 div lingkaran yang berputar (nested spinner):
//
//   Lingkaran luar (w-16 h-16):
//   - class: "w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900
//             animate-spin border-t-indigo-600 dark:border-t-indigo-400"
//
//   Lingkaran dalam (w-8 h-8), posisi absolute di tengah:
//   - class: "absolute inset-2 w-8 h-8 rounded-full border-4
//             border-purple-100 dark:border-purple-900 animate-spin
//             border-t-purple-600 dark:border-t-purple-400"
//   - style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
//   - Efek: berputar berlawanan arah dengan kecepatan berbeda → terlihat dinamis

// STEP 3: Setelah div spinner, tambahkan tag <p> untuk pesan loading:
// - class: "text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse"
// - Isi: {message}  (tampilkan props message)

// ─── CARA MEMBUAT NAMED EXPORT InlineSpinner ──────────────────────────────────

// STEP 4: Buat named export function InlineSpinner (tanpa props)
// - Return satu div lingkaran kecil:
//   class: "w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
// - Digunakan di dalam tombol (misal tombol "Mencari..." di Landing)
//   sehingga ukurannya kecil dan warnanya putih agar kontras dengan background tombol

// ─── CATATAN PENTING ──────────────────────────────────────────────────────────
// - animate-spin: Tailwind utility untuk CSS animation rotate 360deg infinite
// - animate-pulse: Tailwind utility untuk fade in/out effect pada teks
// - border-t-*: hanya border atas yang berwarna → menciptakan efek "loading arc"
// - inset-2: absolute positioning dengan offset 8px dari semua sisi
// - animationDirection: 'reverse' → spinner dalam berputar berlawanan arah
// - animationDuration: '0.8s' → lebih cepat dari default 1s → terlihat lebih aktif
// - Komponen ini dipakai di Dashboard.jsx saat fetch data (LoadingSpinner)
//   dan di Landing.jsx saat tombol search loading (InlineSpinner)
