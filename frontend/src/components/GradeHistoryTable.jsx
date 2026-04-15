// ═══════════════════════════════════════════════════════════════════════════
// FILE: frontend/src/components/GradeHistoryTable.jsx
// DEVELOPER: Anak 7 (Frontend - Dashboard Components)
// DESKRIPSI: Tabel riwayat nilai per semester dengan accordion expand/collapse
// ═══════════════════════════════════════════════════════════════════════════

// ─── STEP 1: IMPORT ───────────────────────────────────────────────────────────
// import { useState } from 'react'
// import { History, ChevronDown, ChevronUp } from 'lucide-react'

// ─── STEP 2: BUAT KONSTANTA ───────────────────────────────────────────────────
// GRADE_COLORS: mapping nilai huruf ke CSS class (dari index.css)
// {
//   A: 'grade-A',   AB: 'grade-AB',  B: 'grade-B',
//   BC: 'grade-BC', C: 'grade-C',    D: 'grade-D',  E: 'grade-E',
// }
//
// SEM_LABELS: mapping nomor semester ke label string
// { 1: 'Semester 1', 2: 'Semester 2', 3: 'Semester 3' }

// ─── STEP 3: BUAT DEFAULT EXPORT function GradeHistoryTable ──────────────────
// Props: { riwayat }  → array of semester objects
//
// STEP 3a: State untuk accordion
// const [openSem, setOpenSem] = useState(
//   riwayat.length > 0 ? riwayat[riwayat.length - 1].semester : null
// )
// → Default buka semester terakhir (index -1)
//
// STEP 3b: Toggle function
// const toggle = (sem) => setOpenSem(openSem === sem ? null : sem)
// → Jika klik semester yang sudah terbuka → tutup (null), jika belum → buka

// STEP 3c: Return JSX struktur card
// Wrapper: <div class="card animate-slide-up">
//
//   [1] Header section: flex items-center gap-3 mb-5
//       - Icon container: w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600
//         flex items-center justify-center shadow
//         Isi: <History class="w-5 h-5 text-white" />
//       - Teks:
//         * <h3 class="section-title">Riwayat Nilai</h3>
//         * <p class="text-sm text-gray-500 dark:text-gray-400">Nilai historis semester 1 s.d. 3</p>
//
//   [2] List semester: <div class="space-y-3">
//       Map setiap item riwayat → render accordion item:
//
//       Wrapper item: <div key={sem.semester} class="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
//
//       [2a] Tombol header accordion:
//            <button onClick={() => toggle(sem.semester)}
//                    class="w-full flex items-center justify-between px-4 py-3
//                           bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100
//                           dark:hover:bg-gray-700 transition-colors">
//
//            Sisi kiri (flex items-center gap-3):
//            - Kotak nomor semester (w-8 h-8 rounded-lg, warna dinamis berdasarkan IPS):
//              * ips >= 3.5 → 'bg-emerald-500'
//              * ips >= 3.0 → 'bg-blue-500'
//              * ips >= 2.5 → 'bg-yellow-500'
//              * else       → 'bg-red-500'
//              Isi: {sem.semester}
//            - Teks info:
//              * <p> "Semester X": text-sm font-semibold text-gray-800 dark:text-gray-200
//                Isi: {SEM_LABELS[sem.semester]}
//              * <p> SKS: text-xs text-gray-400 dark:text-gray-500
//                Isi: "{sem.sks} SKS diambil"
//
//            Sisi kanan (flex items-center gap-3):
//            - IPS display (text-right):
//              * <p> "IPS": text-xs text-gray-400 dark:text-gray-500
//              * <p> nilai: text-lg font-extrabold text-gray-900 dark:text-white tabular-nums
//                Isi: {sem.ips.toFixed(2)}
//            - Icon chevron: kondisional
//              * openSem === sem.semester → <ChevronUp class="w-4 h-4 text-gray-400" />
//              * else                    → <ChevronDown class="w-4 h-4 text-gray-400" />
//
//       [2b] Detail matkul (hanya render jika openSem === sem.semester):
//            Wrapper: <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
//
//            Header kolom tabel:
//            <div class="grid grid-cols-12 px-4 py-2 bg-gray-50/50 dark:bg-gray-800/30
//                        text-xs font-semibold text-gray-400 dark:text-gray-500
//                        uppercase tracking-wider">
//              <span class="col-span-2">Kode</span>
//              <span class="col-span-6">Mata Kuliah</span>
//              <span class="col-span-1 text-center">SKS</span>
//              <span class="col-span-1 text-center">Nilai</span>
//              <span class="col-span-2 text-right">Angka</span>
//            </div>
//
//            Map setiap matkul → row tabel:
//            <div key={mk.kode} class="grid grid-cols-12 px-4 py-2.5
//                                      hover:bg-gray-50 dark:hover:bg-gray-700/20
//                                      transition-colors items-center">
//              col-span-2: <code class="text-xs font-mono text-gray-500 dark:text-gray-400">{mk.kode}</code>
//              col-span-6: <span class="text-sm text-gray-700 dark:text-gray-300 truncate pr-2">{mk.nama}</span>
//              col-span-1 text-center: <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{mk.sks}</span>
//              col-span-1 text-center: badge nilai huruf
//                <span class={`inline-block px-2 py-0.5 rounded-md text-xs font-bold
//                              ${GRADE_COLORS[mk.nilai_huruf] || 'bg-gray-100 text-gray-700'}`}>
//                  {mk.nilai_huruf}
//                </span>
//              col-span-2 text-right: <span class="text-sm font-semibold text-gray-600 dark:text-gray-400 tabular-nums">
//                {mk.nilai_angka.toFixed(1)}
//              </span>
//            </div>

// ─── CATATAN PENTING ──────────────────────────────────────────────────────────
// - Accordion pattern: satu state openSem menyimpan nomor semester yang terbuka
// - grid grid-cols-12: 12-column grid untuk layout tabel yang proporsional
// - col-span-N: menentukan berapa kolom yang dipakai setiap cell
// - divide-y: border horizontal antar row tanpa perlu border manual
// - overflow-hidden pada wrapper: agar rounded corner tidak terpotong konten
// - SEM_LABELS: hardcoded untuk 3 semester, sesuaikan jika semester lebih banyak
// - GRADE_COLORS menggunakan class dari index.css (grade-A, grade-B, dst)
// - Komponen ini dipakai di Dashboard.jsx sebagai riwayat nilai historis
