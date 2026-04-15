// ═══════════════════════════════════════════════════════════════════════════
// FILE: frontend/src/components/StudentCard.jsx
// DEVELOPER: Anak 7 (Frontend - Dashboard Components)
// DESKRIPSI: Kartu profil mahasiswa dengan info lengkap dan IPK bar
// ═══════════════════════════════════════════════════════════════════════════

// ─── STEP 1: IMPORT ───────────────────────────────────────────────────────────
// Import { User, Hash, BookOpen, Calendar, Award, TrendingUp } dari 'lucide-react'

// ─── STEP 2: BUAT KONSTANTA WARNA ─────────────────────────────────────────────
// Buat 2 object konstanta:
//
// PRODI_COLORS: gradient background untuk avatar/header strip
// {
//   TI: 'from-indigo-500 to-blue-600',
//   AK: 'from-emerald-500 to-teal-600',
//   TM: 'from-orange-500 to-red-600',
//   AP: 'from-violet-500 to-purple-600',
// }
//
// PRODI_BADGE_COLORS: warna badge teks prodi
// {
//   TI: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
//   AK: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
//   TM: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
//   AP: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
// }

// ─── STEP 3: BUAT HELPER COMPONENT IPKBar ─────────────────────────────────────
// function IPKBar({ value }) — tidak di-export, hanya dipakai di StudentCard
//
// - Hitung persentase: const pct = (value / 4.0) * 100
// - Tentukan warna gradient berdasarkan nilai IPK:
//   * value >= 3.5 → 'from-emerald-400 to-green-500'
//   * value >= 3.0 → 'from-blue-400 to-indigo-500'
//   * value >= 2.5 → 'from-yellow-400 to-amber-500'
//   * else         → 'from-red-400 to-rose-500'
// - Return JSX:
//   <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
//     <div class={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
//          style={{ width: `${pct}%` }} />
//   </div>

// ─── STEP 4: BUAT DEFAULT EXPORT function StudentCard ─────────────────────────
// Props: { student }
//
// STEP 4a: Destructure props student
// const { nim, nama, prodi, prodi_key, angkatan, jenis_kelamin, semester_aktif, ipk_kumulatif } = student
//
// STEP 4b: Tentukan variabel turunan
// - const gradient = PRODI_COLORS[prodi_key] || 'from-gray-500 to-gray-600'
// - const badgeClass = PRODI_BADGE_COLORS[prodi_key] || 'bg-gray-100 text-gray-800'
// - const ipkLabel: string berdasarkan ipk_kumulatif
//   * >= 3.5 → 'Cumlaude'
//   * >= 3.0 → 'Sangat Memuaskan'
//   * >= 2.5 → 'Memuaskan'
//   * else   → 'Perlu Perhatian'
// - const ipkLabelColor: string berdasarkan ipk_kumulatif
//   * >= 3.5 → 'text-emerald-600 dark:text-emerald-400'
//   * >= 3.0 → 'text-blue-600 dark:text-blue-400'
//   * >= 2.5 → 'text-yellow-600 dark:text-yellow-400'
//   * else   → 'text-red-600 dark:text-red-400'
//
// STEP 4c: Return JSX struktur card
// Wrapper: <div class="card animate-slide-up overflow-hidden">
//
//   [1] Header gradient strip (garis tipis di atas card):
//       <div class={`-mx-6 -mt-6 mb-6 h-2 bg-gradient-to-r ${gradient}`} />
//       → -mx-6 -mt-6: negatif margin agar strip menyentuh tepi card
//
//   [2] Konten utama: <div class="flex flex-col sm:flex-row gap-4">
//
//       [2a] Avatar (w-16 h-16 rounded-2xl, gradient bg, text-white, font-bold, shadow-lg):
//            class: `w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center
//                    justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg`
//            Isi: {nama.charAt(0)}  → huruf pertama nama sebagai avatar

//       [2b] Info mahasiswa (flex-1 min-w-0):
//            - Baris nama + badge prodi: flex flex-wrap items-start gap-2 mb-1
//              * <h2> nama: text-xl font-bold text-gray-900 dark:text-white truncate
//              * <span> badge prodi_key: px-2 py-0.5 rounded-full text-xs font-semibold ${badgeClass}
//            - <p> nama prodi lengkap: text-sm text-gray-500 dark:text-gray-400 mb-3
//            - Grid 4 kolom info: grid grid-cols-2 sm:grid-cols-4 gap-3
//              Render 4 komponen <InfoItem>:
//              * icon={Hash}     label="NIM"           value={nim}
//              * icon={Calendar} label="Angkatan"       value={angkatan}
//              * icon={BookOpen} label="Semester"       value={`Semester ${semester_aktif}`}
//              * icon={User}     label="Jenis Kelamin"  value={jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
//
//       [2c] IPK display (flex-shrink-0 text-center sm:text-right):
//            - <p> label "IPK Kumulatif": text-xs text-gray-500 uppercase tracking-wide mb-1
//            - <p> nilai IPK: text-4xl font-extrabold text-gray-900 dark:text-white tabular-nums
//              Isi: {ipk_kumulatif.toFixed(2)}
//            - <p> ipkLabel: text-xs font-semibold mt-1 ${ipkLabelColor}
//            - <div class="w-24 mx-auto sm:mx-0 sm:ml-auto mt-2">
//                <IPKBar value={ipk_kumulatif} />
//              </div>
//            - <p> "dari 4.00": text-xs text-gray-400 dark:text-gray-500 mt-1

// ─── STEP 5: BUAT HELPER COMPONENT InfoItem ───────────────────────────────────
// function InfoItem({ icon: Icon, label, value }) — tidak di-export
//
// Return JSX:
// <div class="flex items-center gap-2">
//   <div class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
//     <Icon class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
//   </div>
//   <div class="min-w-0">
//     <p class="text-xs text-gray-400 dark:text-gray-500">{label}</p>
//     <p class="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{value}</p>
//   </div>
// </div>
//
// CATATAN: InfoItem dideklarasikan SETELAH StudentCard (di bawah) karena
// JavaScript hoisting tidak berlaku untuk function expression / arrow function,
// tapi berlaku untuk function declaration. Pastikan urutan deklarasi benar.

// ─── CATATAN PENTING ──────────────────────────────────────────────────────────
// - -mx-6 -mt-6: negative margin untuk "bleed" strip keluar batas padding card
// - nama.charAt(0): ambil huruf pertama nama untuk avatar inisial
// - truncate: text overflow ellipsis agar nama panjang tidak merusak layout
// - tabular-nums: font feature untuk angka dengan lebar seragam (tidak bergeser)
// - sm:flex-row: di mobile stack vertikal, di sm+ jadi horizontal
// - Komponen ini dipakai di halaman Dashboard.jsx sebagai profil mahasiswa
