// ═══════════════════════════════════════════════════════════════════════════
// FILE: frontend/src/components/CourseTable.jsx
// DEVELOPER: Anak 7 (Frontend - Dashboard Components)
// DESKRIPSI: Tabel prediksi nilai mata kuliah dengan grade bar dan confidence bar
// ═══════════════════════════════════════════════════════════════════════════

// ─── STEP 1: IMPORT ───────────────────────────────────────────────────────────
// import { BookOpen, Target } dari 'lucide-react'

// ─── STEP 2: BUAT KONSTANTA ───────────────────────────────────────────────────
// GRADE_COLORS: mapping nilai huruf ke CSS class (dari index.css)
// { A: 'grade-A', AB: 'grade-AB', B: 'grade-B', BC: 'grade-BC',
//   C: 'grade-C', D: 'grade-D', E: 'grade-E' }
//
// GRADE_BAR_COLORS: mapping nilai huruf ke warna Tailwind untuk progress bar
// { A: 'bg-emerald-500', AB: 'bg-green-500', B: 'bg-blue-500',
//   BC: 'bg-sky-500', C: 'bg-yellow-500', D: 'bg-orange-500', E: 'bg-red-500' }

// ─── STEP 3: BUAT HELPER COMPONENT GradeBar ───────────────────────────────────
// function GradeBar({ value, max = 4 }) — tidak di-export
//
// - Hitung persentase: const pct = (value / max) * 100
// - Tentukan key warna berdasarkan nilai angka:
//   * value >= 4.0 → 'A'
//   * value >= 3.5 → 'AB'
//   * value >= 3.0 → 'B'
//   * value >= 2.5 → 'BC'
//   * value >= 2.0 → 'C'
//   * value >= 1.0 → 'D'
//   * else         → 'E'
// - Return JSX:
//   <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
//     <div class={`h-full rounded-full ${GRADE_BAR_COLORS[key] || 'bg-gray-400'} transition-all duration-500`}
//          style={{ width: `${pct}%` }} />
//   </div>

// ─── STEP 4: BUAT HELPER COMPONENT ConfidenceBar ──────────────────────────────
// function ConfidenceBar({ value }) — tidak di-export
//
// - Tentukan warna berdasarkan nilai confidence:
//   * value >= 80 → 'bg-emerald-500'
//   * value >= 70 → 'bg-blue-500'
//   * else        → 'bg-yellow-500'
// - Return JSX: flex items-center gap-2
//   * Track bar: flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden
//     Fill: h-full rounded-full ${color} transition-all duration-500
//           style={{ width: `${value}%` }}
//   * Label: <span class="text-xs text-gray-500 dark:text-gray-400 w-8 text-right tabular-nums">
//              {value}%
//            </span>

// ─── STEP 5: BUAT DEFAULT EXPORT function CourseTable ─────────────────────────
// Props: { courses }  → array of course prediction objects
//
// STEP 5a: Guard clause — jika courses kosong atau undefined:
// if (!courses || courses.length === 0) {
//   return (
//     <div class="card">
//       <p class="text-center text-gray-400">Tidak ada data mata kuliah prediksi.</p>
//     </div>
//   )
// }
//
// STEP 5b: Return JSX struktur card utama
// Wrapper: <div class="card animate-slide-up">
//
//   [1] Header: flex items-center gap-3 mb-5
//       - Icon container: w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600
//         flex items-center justify-center shadow
//         Isi: <Target class="w-5 h-5 text-white" />
//       - Teks:
//         * <h3 class="section-title">Prediksi Nilai Semester 5</h3>
//         * <p class="text-sm text-gray-500 dark:text-gray-400">
//             Rekomendasi mata kuliah dan prediksi nilai
//           </p>
//
//   [2] Desktop table (hidden md:block overflow-x-auto -mx-6):
//       <table class="w-full">
//         <thead>
//           <tr class="bg-gray-50 dark:bg-gray-700/50">
//             6 kolom header (px-6/px-4 py-3, text-xs font-semibold text-gray-500 uppercase tracking-wider):
//             - "Kode" (px-6, text-left)
//             - "Mata Kuliah" (px-4, text-left)
//             - "SKS" (px-4, text-center)
//             - "Nilai" (px-4, text-center)
//             - "Angka" (px-4, text-right)
//             - "Confidence" (px-6, text-left, w-48)
//           </tr>
//         </thead>
//         <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
//           Map courses → <tr key={course.kode} class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
//             <td px-6 py-3.5>: <code class="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{course.kode}</code>
//             <td px-4 py-3.5>: nama + GradeBar
//               <div>
//                 <p class="text-sm font-medium text-gray-900 dark:text-white">{course.nama}</p>
//                 <GradeBar value={course.prediksi_nilai_angka} />
//               </div>
//             <td px-4 py-3.5 text-center>: badge SKS
//               <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-bold">
//                 {course.sks}
//               </span>
//             <td px-4 py-3.5 text-center>: badge nilai huruf
//               <span class={`inline-block px-2.5 py-0.5 rounded-lg text-sm font-bold ${GRADE_COLORS[course.prediksi_nilai_huruf] || 'bg-gray-100 text-gray-700'}`}>
//                 {course.prediksi_nilai_huruf}
//               </span>
//             <td px-4 py-3.5 text-right>: nilai angka
//               <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
//                 {course.prediksi_nilai_angka.toFixed(1)}
//               </span>
//             <td px-6 py-3.5>: <ConfidenceBar value={course.confidence} />
//           </tr>
//         </tbody>
//       </table>
//
//   [3] Mobile cards (md:hidden space-y-3 mt-2):
//       Map courses → <div key={course.kode} class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
//         Baris atas: flex items-start justify-between gap-2 mb-2
//           Kiri (flex-1 min-w-0):
//             - Baris kode + SKS: flex items-center gap-2 mb-0.5
//               * <code> kode: text-xs font-mono bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded
//               * <span> SKS: text-xs text-gray-500 dark:text-gray-400
//             - <p> nama: text-sm font-semibold text-gray-800 dark:text-gray-200
//           Kanan (text-right flex-shrink-0):
//             - Badge nilai huruf: inline-block px-2.5 py-0.5 rounded-lg text-sm font-bold
//             - <p> nilai angka: text-xs text-gray-400 mt-0.5 tabular-nums
//         Baris bawah: <ConfidenceBar value={course.confidence} />
//
//   [4] Summary row (mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4):
//       - Total matkul: flex items-center gap-2
//         * <BookOpen class="w-4 h-4 text-gray-400" />
//         * <span> "Total: X mata kuliah"
//       - Total SKS: flex items-center gap-2
//         * <span> "Total SKS: X SKS"
//         * Hitung: courses.reduce((s, c) => s + c.sks, 0)
//       - Rata-rata nilai (ml-auto): flex items-center gap-2
//         * <span> "Rata-rata nilai prediksi: X.XX"
//         * Hitung: courses.reduce((s, c) => s + c.prediksi_nilai_angka, 0) / courses.length

// ─── CATATAN PENTING ──────────────────────────────────────────────────────────
// - -mx-6: negative margin agar tabel full-width melewati padding card
// - hidden md:block: tabel hanya tampil di layar medium ke atas
// - md:hidden: card mobile hanya tampil di layar kecil
// - divide-y: border horizontal antar row tabel
// - tabular-nums: angka dengan lebar seragam agar tidak bergeser
// - course.prediksi_nilai_angka.toFixed(1): 1 desimal untuk nilai angka
// - Komponen ini dipakai di Dashboard.jsx untuk menampilkan prediksi nilai matkul
