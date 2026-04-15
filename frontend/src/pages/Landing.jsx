// ═══════════════════════════════════════════════════════════════════════════
// FILE: frontend/src/pages/Landing.jsx
// DEVELOPER: Anak 6 (Frontend - Landing Page)
// DESKRIPSI: Halaman utama (home) dengan hero section, search NIM,
//            stats, fitur, program studi, cara kerja, CTA, dan footer
// ═══════════════════════════════════════════════════════════════════════════

// ─── STEP 1: IMPORT ───────────────────────────────────────────────────────────
// import { useState, useRef } dari 'react'
// import { useNavigate } dari 'react-router-dom'
// import {
//   Search, ArrowRight, Brain, BarChart3, BookOpen, Users,
//   Zap, TrendingUp, GraduationCap, Star,
//   ChevronRight, Cpu, Database, Layers, Monitor, Calculator, Settings, FileText
// } dari 'lucide-react'
// import { InlineSpinner } dari '../components/LoadingSpinner'
// import { getStudent } dari '../api/client'

// ─── STEP 2: BUAT KONSTANTA DATA ──────────────────────────────────────────────
// PRODI_LIST: array 4 program studi
// [
//   { name: 'Teknologi Informasi',      key: 'TI', color: 'from-indigo-400 to-blue-500',   icon: Monitor,    desc: '...' },
//   { name: 'Akuntansi',                key: 'AK', color: 'from-emerald-400 to-teal-500',  icon: Calculator, desc: '...' },
//   { name: 'Teknik Mesin',             key: 'TM', color: 'from-orange-400 to-red-500',    icon: Settings,   desc: '...' },
//   { name: 'Administrasi Perkantoran', key: 'AP', color: 'from-violet-400 to-purple-500', icon: FileText,   desc: '...' },
// ]
//
// FEATURES: array 4 fitur unggulan
// [
//   { icon: Brain,    title: 'Prediksi Berbasis AI',     desc: '...', color: 'from-indigo-500 to-blue-600' },
//   { icon: BarChart3,title: 'Visualisasi Tren IPK',     desc: '...', color: 'from-purple-500 to-pink-600' },
//   { icon: BookOpen, title: 'Prediksi Per Mata Kuliah', desc: '...', color: 'from-emerald-500 to-teal-600' },
//   { icon: Zap,      title: 'Simulasi Beban SKS',       desc: '...', color: 'from-amber-500 to-orange-600' },
// ]
//
// HOW_IT_WORKS: array 4 langkah cara kerja
// [
//   { step: '01', title: 'Masukkan NIM',          desc: '...', icon: Search },
//   { step: '02', title: 'Analisis Data Historis', desc: '...', icon: Database },
//   { step: '03', title: 'Kalkulasi Prediksi',     desc: '...', icon: Cpu },
//   { step: '04', title: 'Tampilkan Dashboard',    desc: '...', icon: Layers },
// ]

// ─── STEP 3: BUAT HELPER FUNCTION validateNIM ─────────────────────────────────
// function validateNIM(nim):
// - Jika tidak match regex /^\d{8}$/ → return 'NIM harus terdiri dari 8 digit angka.'
// - else → return null (valid)

// ─── STEP 4: BUAT DEFAULT EXPORT function Landing ─────────────────────────────
//
// STEP 4a: State dan hooks
// const [nim, setNim] = useState('')
// const [error, setError] = useState('')
// const [loading, setLoading] = useState(false)
// const navigate = useNavigate()
// const searchRef = useRef(null)  → ref untuk scroll ke search box dari CTA
//
// STEP 4b: Handler search
// const handleSearch = async (searchNim = nim) => {
//   const trimmed = searchNim.trim()
//   const validationError = validateNIM(trimmed)
//   if (validationError) { setError(validationError); return }
//   setError('')
//   setLoading(true)
//   try {
//     await getStudent(trimmed)  → validasi NIM ada di database
//     navigate(`/dashboard/${trimmed}`)  → redirect ke dashboard
//   } catch (err) {
//     setError(err.message || 'Mahasiswa tidak ditemukan.')
//   } finally {
//     setLoading(false)
//   }
// }
//
// STEP 4c: Return JSX — <div class="min-h-screen">

// ─── SECTION 1: HERO ──────────────────────────────────────────────────────────
// <section class="relative overflow-hidden bg-white dark:bg-gray-950 pt-12 sm:pt-16 pb-16 sm:pb-24">
//
//   [1] Background decorations (absolute, pointer-events-none):
//       - Blob kanan atas: -top-40 -right-32 w-72 sm:w-96 h-72 sm:h-96
//         rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 blur-3xl
//       - Blob kiri bawah: -bottom-20 -left-20 w-64 sm:w-80 h-64 sm:h-80
//         rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-600/20 blur-3xl
//
//   [2] Content (relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center):
//
//       [2a] Badge "Sistem Prediksi Akademik Generasi Baru":
//            inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full
//            bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800
//            text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-fade-in
//            Isi: <Star class="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> + teks
//
//       [2b] Heading H1:
//            text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white
//            leading-tight mb-4 sm:mb-6 animate-slide-up
//            Isi: "Prediksi Masa Depan "
//                 <span class="gradient-text">Akademikmu</span>
//                 <br class="hidden sm:block" />
//                 " Dengan Data Nyata"
//
//       [2c] Paragraf deskripsi:
//            text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto
//            mb-8 sm:mb-10 animate-fade-in px-2
//
//       [2d] Search Box (ref={searchRef}):
//            max-w-lg mx-auto animate-slide-up px-0
//
//            Wrapper dengan glow effect:
//            <div class="relative group">
//              Glow: absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600
//                    opacity-20 blur-lg group-hover:opacity-30 transition-opacity
//              Input box: relative flex gap-2 p-2 bg-white dark:bg-gray-900 rounded-2xl
//                         border border-gray-200 dark:border-gray-700 shadow-xl
//                Input area (flex-1 flex items-center gap-2 sm:gap-3 px-2 sm:px-3 min-w-0):
//                  - <Search class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
//                  - <input type="text" inputMode="numeric"
//                           placeholder="Masukkan NIM (misal: 24026004)"
//                           value={nim}
//                           onChange={(e) => { setNim(e.target.value); setError('') }}
//                           onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                           maxLength={8}
//                           class="flex-1 bg-transparent text-gray-900 dark:text-white
//                                  placeholder-gray-400 outline-none text-sm sm:text-base
//                                  font-medium min-w-0" />
//                Tombol "Cari":
//                  <button onClick={() => handleSearch()} disabled={loading}
//                          class="btn-primary py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl flex-shrink-0 justify-center text-sm">
//                    Jika loading: <InlineSpinner /> + <span class="hidden sm:inline">Mencari...</span>
//                    Jika tidak: <span>Cari</span> + <ArrowRight class="w-4 h-4" />
//                  </button>
//            </div>
//
//            Error message (hanya jika error):
//            <div class="mt-3 flex items-start gap-2 text-red-600 dark:text-red-400 text-sm
//                        bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
//                        rounded-xl px-4 py-3 animate-fade-in text-left">
//              <span class="font-medium">{error}</span>
//            </div>

// ─── SECTION 2: STATS ─────────────────────────────────────────────────────────
// <section class="bg-gradient-to-r from-indigo-600 to-purple-700 py-8 sm:py-12">
//   max-w-5xl mx-auto px-4 sm:px-6 lg:px-8
//   grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center text-white
//
//   Map array 4 stat items:
//   [
//     { value: '500+', label: 'Total Mahasiswa', icon: Users },
//     { value: '4',    label: 'Program Studi',   icon: GraduationCap },
//     { value: '6',    label: 'Semester',        icon: BookOpen },
//     { value: '95%',  label: 'Akurasi Prediksi',icon: TrendingUp },
//   ]
//   Setiap item: flex flex-col items-center gap-1.5 sm:gap-2
//     - <stat.icon class="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
//     - <p class="text-2xl sm:text-3xl font-extrabold">{stat.value}</p>
//     - <p class="text-xs sm:text-sm text-white/70 font-medium">{stat.label}</p>

// ─── SECTION 3: FEATURES ──────────────────────────────────────────────────────
// <section id="features" class="py-14 sm:py-20 bg-gray-50 dark:bg-gray-900">
//   max-w-6xl mx-auto px-4 sm:px-6 lg:px-8
//
//   Header section (text-center mb-10 sm:mb-12):
//   - <h2 class="text-2xl sm:text-3xl font-extrabold ...">Fitur Unggulan</h2>
//   - <p> deskripsi
//
//   Grid 4 kolom: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6
//   Map FEATURES → <div key={feat.title} class="card hover:shadow-lg transition-shadow group">
//     - Icon box: w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${feat.color}
//       flex items-center justify-center mb-3 sm:mb-4 shadow
//       group-hover:scale-105 transition-transform
//       Isi: <feat.icon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//     - <h3 class="font-bold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">{feat.title}</h3>
//     - <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feat.desc}</p>

// ─── SECTION 4: PROGRAM STUDI ─────────────────────────────────────────────────
// <section class="py-12 sm:py-16 bg-white dark:bg-gray-950">
//   max-w-5xl mx-auto px-4 sm:px-6 lg:px-8
//
//   Header: text-center mb-8 sm:mb-10
//   - <h2> "Program Studi"
//   - <p> "Mencakup 4 program studi"
//
//   Grid 4 kolom: grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4
//   Map PRODI_LIST → render kartu prodi:
//   const Icon = prodi.icon  → destructure icon dari setiap prodi
//   <div key={prodi.key} class="card text-center hover:shadow-lg transition-shadow group cursor-default p-4 sm:p-6">
//     - Icon box: w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${prodi.color}
//       flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg
//       group-hover:scale-105 transition-transform
//       Isi: <Icon class="w-6 h-6 sm:w-7 sm:h-7 text-white" />
//     - <p class="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">{prodi.name}</p>
//     - <p class="text-xs text-gray-500 ... hidden sm:block">{prodi.desc}</p>
//       → hidden sm:block: deskripsi hanya tampil di layar sm ke atas

// ─── SECTION 5: HOW IT WORKS ──────────────────────────────────────────────────
// <section id="how-it-works" class="py-14 sm:py-20 bg-gray-50 dark:bg-gray-900">
//   max-w-5xl mx-auto px-4 sm:px-6 lg:px-8
//
//   Header: text-center mb-10 sm:mb-12
//   - <h2> "Cara Kerja"
//   - <p> "Proses prediksi yang transparan dan dapat dipahami"
//
//   Grid 4 kolom: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6
//   Map HOW_IT_WORKS dengan index i:
//   <div key={step.step} class="relative">
//
//     Connector line (hanya jika i < 3, hidden lg:block):
//     <div class="hidden lg:block absolute top-8 h-0.5 bg-gradient-to-r from-indigo-200
//                 to-transparent dark:from-indigo-800 z-0"
//          style={{ width: 'calc(100% - 2rem)', left: '50%' }} />
//     → Garis horizontal yang menghubungkan antar step di desktop
//
//     Card: <div class="card text-center relative z-10 p-4 sm:p-6">
//       - Icon box: w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600
//         flex items-center justify-center mx-auto mb-3 shadow-lg
//         Isi: <step.icon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//       - <span class="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
//           {step.step}
//         </span>
//       - <h3 class="font-bold text-gray-900 dark:text-white mt-1 mb-1.5 sm:mb-2 text-sm sm:text-base">
//           {step.title}
//         </h3>
//       - <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>

// ─── SECTION 6: CTA ───────────────────────────────────────────────────────────
// <section class="py-12 sm:py-16 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600">
//   max-w-3xl mx-auto px-4 text-center
//
//   - <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-3 sm:mb-4">
//       Mulai Prediksi Sekarang
//     </h2>
//   - <p class="text-indigo-100 mb-6 sm:mb-8 text-base sm:text-lg">
//       Masukkan NIM mahasiswa dan dapatkan analisis lengkap dalam hitungan detik.
//     </p>
//   - Tombol scroll ke search:
//     <button onClick={() => searchRef.current?.scrollIntoView({ behavior: 'smooth' })}
//             class="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl
//                    bg-white text-indigo-700 font-bold shadow-xl hover:bg-indigo-50
//                    transition-all duration-200 text-base sm:text-lg">
//       <Search class="w-4 h-4 sm:w-5 sm:h-5" />
//       Cari Mahasiswa
//       <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5" />
//     </button>

// ─── SECTION 7: FOOTER ────────────────────────────────────────────────────────
// <footer class="bg-gray-900 text-gray-400 py-6 sm:py-8">
//   max-w-5xl mx-auto px-4 text-center
//
//   - Logo row: flex items-center justify-center gap-2 mb-2 sm:mb-3
//     * <GraduationCap class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
//     * <span class="font-bold text-white text-sm sm:text-base">AcadPredict</span>
//   - <p class="text-xs sm:text-sm">Sistem Prediksi Performa Akademik Mahasiswa</p>
//   - <p class="text-xs mt-1.5 sm:mt-2 text-gray-500">
//       Data bersifat sintetis untuk keperluan demonstrasi. Prediksi tidak menggantikan
//       konsultasi akademik resmi.
//     </p>

// ─── CATATAN PENTING ──────────────────────────────────────────────────────────
// - searchRef: useRef untuk scroll ke search box saat tombol CTA diklik
//   searchRef.current?.scrollIntoView({ behavior: 'smooth' }) → smooth scroll
// - handleSearch menerima parameter opsional searchNim untuk fleksibilitas
// - inputMode="numeric": keyboard numerik di mobile
// - maxLength={8}: batasi input 8 karakter
// - id="features" dan id="how-it-works": digunakan oleh Navbar untuk scroll
// - gradient-text: custom class dari index.css (bg-clip-text text-transparent)
// - animate-slide-up, animate-fade-in: custom animations dari index.css
// - group / group-hover:scale-105: hover effect pada icon card
// - Connector line di HOW_IT_WORKS: z-0 agar di belakang card (z-10)
