// ═══════════════════════════════════════════════════════════════════════════
// FILE: frontend/src/components/SKSBadge.jsx
// DEVELOPER: Anak 7 (Frontend - Dashboard Components)
// DESKRIPSI: Badge rekomendasi SKS dengan progress bar dan keterangan
// ═══════════════════════════════════════════════════════════════════════════

// ─── STEP 1: IMPORT ───────────────────────────────────────────────────────────
// Import { BookCheck, Info } dari 'lucide-react'

// ─── STEP 2: BUAT KONSTANTA SKS_CONFIG ───────────────────────────────────────
// Buat object SKS_CONFIG dengan key angka SKS (24, 23, 22, 21).
// Setiap key berisi object konfigurasi warna dan label:
//
// 24: {
//   color: 'from-emerald-500 to-green-600',
//   bg: 'bg-emerald-50 dark:bg-emerald-900/20',
//   border: 'border-emerald-200 dark:border-emerald-800',
//   text: 'text-emerald-800 dark:text-emerald-300',
//   label: 'Beban Penuh',
//   desc: 'IPK >= 3.5 — Mahasiswa berprestasi dapat mengambil beban maksimum',
// }
// 23: warna biru (from-blue-500 to-indigo-600), label: 'Beban Tinggi'
//     desc: 'IPK >= 3.0 — Performa sangat baik, dapat mengambil beban lebih'
// 22: warna kuning (from-yellow-500 to-amber-600), label: 'Beban Normal'
//     desc: 'IPK >= 2.5 — Beban SKS standar yang direkomendasikan'
// 21: warna merah (from-red-500 to-rose-600), label: 'Beban Ringan'
//     desc: 'IPK < 2.5 — Disarankan mengambil beban lebih sedikit untuk fokus perbaikan'

// ─── STEP 3: BUAT HELPER COMPONENT IPKBar (internal, tidak di-export) ─────────
// Tidak perlu dibuat karena SKSBadge tidak menggunakan IPKBar.
// Progress bar SKS dibuat langsung di dalam SKSBadge.

// ─── STEP 4: BUAT DEFAULT EXPORT function SKSBadge ───────────────────────────
// Props: { rekomendasi_sks, prediksi_ipk }
//
// Di dalam fungsi:
// - Ambil config: const config = SKS_CONFIG[rekomendasi_sks] || SKS_CONFIG[22]
//   (fallback ke 22 jika nilai tidak ada di config)
//
// Return JSX struktur berikut:

// STEP 4a: Wrapper card
// - class: `card ${config.bg} border ${config.border} animate-slide-up`
// - Gunakan template literal agar class dinamis sesuai config

// STEP 4b: Baris atas — flex items-start gap-4
// Berisi 3 bagian:
//
//   [1] Icon container (w-14 h-14 rounded-2xl, gradient bg, shadow-lg, flex-shrink-0)
//       - class bg: `bg-gradient-to-br ${config.color}`
//       - Isi: <BookCheck className="w-7 h-7 text-white" />
//
//   [2] Info tengah (flex-1)
//       - Baris judul: flex items-center gap-2 mb-1
//         * <h3> "Rekomendasi SKS" (font-bold text-gray-900 dark:text-white)
//         * Badge label: <span> dengan class `px-2 py-0.5 rounded-full text-xs font-bold
//           ${config.text} ${config.bg} border ${config.border}`
//           Isi: {config.label}
//       - Angka SKS besar: flex items-baseline gap-2 mb-2
//         * <span> angka: `text-5xl font-extrabold bg-gradient-to-r ${config.color}
//           bg-clip-text text-transparent`  → Isi: {rekomendasi_sks}
//         * <span> "SKS": text-lg font-semibold text-gray-500 dark:text-gray-400
//       - Deskripsi: flex items-start gap-1.5 text-sm ${config.text}
//         * <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
//         * <p>{config.desc}</p>
//
//   [3] Prediksi IPK (text-right flex-shrink-0)
//       - <p> "Prediksi IPK": text-xs text-gray-400 dark:text-gray-500 mb-1
//       - <p> nilai: text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums
//         Isi: {prediksi_ipk?.toFixed(2)}

// STEP 4c: Progress bar SKS (di bawah baris atas, mt-4)
// - Label row: flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1
//   * <span>"Beban SKS"</span>
//   * <span>"{rekomendasi_sks} / 24 SKS maksimum"</span>
// - Track bar: w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden
//   * Fill bar: h-full rounded-full bg-gradient-to-r ${config.color} transition-all duration-700
//     style={{ width: `${(rekomendasi_sks / 24) * 100}%` }}
//     → Hitung persentase: (rekomendasi_sks / 24) * 100

// ─── CATATAN PENTING ──────────────────────────────────────────────────────────
// - bg-clip-text text-transparent: teknik gradient text di Tailwind
//   Harus pakai bg-gradient-to-r + bg-clip-text + text-transparent bersamaan
// - config.color dipakai untuk: icon bg, angka SKS gradient, progress bar fill
// - config.bg dipakai untuk: card background dan badge background
// - config.border dipakai untuk: card border dan badge border
// - config.text dipakai untuk: badge text color dan deskripsi text color
// - prediksi_ipk?.toFixed(2): optional chaining karena bisa undefined
// - Komponen ini dipakai di Dashboard.jsx section prediksi summary
