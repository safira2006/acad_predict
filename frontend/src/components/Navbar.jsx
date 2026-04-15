// ═══════════════════════════════════════════════════════════════════════════
// FILE: frontend/src/components/Navbar.jsx
// DEVELOPER: Anak 5 (Frontend - Setup & Config)
// DESKRIPSI: Navigation bar sticky dengan dark mode toggle, mobile menu,
//            dan popup modal untuk "Cara Kerja" & "Fitur"
// ═══════════════════════════════════════════════════════════════════════════

// ─── STEP 1: IMPORT ───────────────────────────────────────────────────────────
// import { useState } from 'react'
// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import {
//   Moon, Sun, GraduationCap, BarChart3, X, Menu,
//   Cpu, Database, Layers, Search,
//   Brain, BookOpen, Zap, BarChart3 as BarIcon,
//   ChevronRight, Home
// } dari 'lucide-react'
// CATATAN: BarChart3 di-alias sebagai BarIcon karena diimport dua kali

// ─── STEP 2: BUAT KONSTANTA POPUP_CONTENT ─────────────────────────────────────
// Object dengan 2 key: 'cara-kerja' dan 'fitur'
// Setiap key berisi: { title, subtitle, color, steps[] }
//
// 'cara-kerja':
//   title: 'Cara Kerja Sistem'
//   subtitle: 'Proses prediksi yang transparan dan dapat dipahami'
//   color: 'from-indigo-500 to-purple-600'
//   steps: array 4 item, masing-masing { icon, step, title, desc }
//     [0] icon: Search,   step: '01', title: 'Masukkan NIM',          desc: '...'
//     [1] icon: Database, step: '02', title: 'Analisis Data Historis', desc: '...'
//     [2] icon: Cpu,      step: '03', title: 'Kalkulasi Prediksi',     desc: '...'
//     [3] icon: Layers,   step: '04', title: 'Tampilkan Dashboard',    desc: '...'
//
// 'fitur':
//   title: 'Fitur Unggulan'
//   subtitle: 'Dirancang untuk membantu memantau dan memprediksi performa akademik'
//   color: 'from-purple-500 to-pink-600'
//   steps: array 4 item, step: null (tidak ada nomor langkah)
//     [0] icon: Brain,    title: 'Prediksi Berbasis AI',     desc: '...'
//     [1] icon: BarIcon,  title: 'Visualisasi Tren IPK',     desc: '...'
//     [2] icon: BookOpen, title: 'Prediksi Per Mata Kuliah', desc: '...'
//     [3] icon: Zap,      title: 'Simulasi Beban SKS',       desc: '...'

// ─── STEP 3: BUAT COMPONENT NavPopup ──────────────────────────────────────────
// function NavPopup({ type, onClose }) — tidak di-export
//
// STEP 3a: Guard clause
// const content = POPUP_CONTENT[type]
// if (!content) return null
//
// STEP 3b: Return JSX modal overlay
// Wrapper: <div class="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
//   → Klik di luar modal → tutup
//
//   Backdrop: <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//
//   Modal box: <div class="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl
//                          w-full max-w-lg overflow-hidden animate-slide-up"
//                   onClick={e => e.stopPropagation()}>
//     → stopPropagation: cegah klik di dalam modal menutup modal
//
//     [1] Header gradient: <div class={`bg-gradient-to-r ${content.color} p-5 sm:p-6 text-white`}>
//         - flex items-start justify-between gap-3
//         - Kiri: <h2> title + <p> subtitle (text-white/80)
//         - Kanan: tombol X (w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30)
//           onClick={onClose}
//
//     [2] Content: <div class="p-5 sm:p-6 space-y-4">
//         Map content.steps → render setiap step:
//         <div key={i} class="flex items-start gap-3">
//           Icon container: w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${content.color}
//             flex items-center justify-center shadow flex-shrink-0
//             Isi: <Icon class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//           Info (flex-1 min-w-0):
//             - flex items-center gap-2:
//               * Jika item.step ada: <span class="text-xs font-bold text-indigo-500 uppercase tracking-widest">{item.step}</span>
//               * <p class="font-bold text-gray-900 dark:text-white text-sm">{item.title}</p>
//             - <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
//
//     [3] Footer: <div class="px-5 sm:px-6 pb-5 sm:pb-6">
//         Tombol "Mengerti":
//         <button onClick={onClose}
//                 class={`w-full py-3 rounded-2xl bg-gradient-to-r ${content.color}
//                         text-white font-bold text-sm flex items-center justify-center gap-2
//                         hover:opacity-90 transition-opacity`}>
//           Mengerti <ChevronRight class="w-4 h-4" />
//         </button>

// ─── STEP 4: BUAT DEFAULT EXPORT function Navbar ──────────────────────────────
// Props: { darkMode, setDarkMode }
//
// STEP 4a: Hooks
// const location = useLocation()
// const navigate = useNavigate()
// const isLanding = location.pathname === '/'  → true jika di halaman home
// const [popup, setPopup] = useState(null)       → null | 'cara-kerja' | 'fitur'
// const [mobileOpen, setMobileOpen] = useState(false)
//
// STEP 4b: Handler navigasi
// const handleNavClick = (type) => {
//   setMobileOpen(false)
//   if (isLanding) {
//     // Di halaman landing: scroll ke section yang sesuai
//     const id = type === 'cara-kerja' ? 'how-it-works' : 'features'
//     const el = document.getElementById(id)
//     if (el) {
//       el.scrollIntoView({ behavior: 'smooth' })
//     } else {
//       navigate('/')
//       setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100)
//     }
//   } else {
//     // Di halaman lain: tampilkan popup modal
//     setPopup(type)
//   }
// }
//
// STEP 4c: Return JSX
// Wrapper fragment: <>
//
//   [1] <nav class="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
//                   border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
//
//       Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
//       Inner: flex items-center justify-between h-16
//
//       [1a] Logo: <Link to="/" class="flex items-center gap-2 group flex-shrink-0">
//           - Icon box: w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600
//             flex items-center justify-center shadow-lg
//             group-hover:shadow-indigo-500/30 transition-shadow duration-200
//             Isi: <GraduationCap class="w-5 h-5 text-white" />
//           - Teks: <span class="text-lg font-bold text-gray-900 dark:text-white">
//               Acad<span class="text-indigo-600 dark:text-indigo-400">Predict</span>
//             </span>
//
//       [1b] Desktop nav (hidden md:flex items-center gap-6):
//           - <Link to="/"> "Beranda" — warna aktif jika isLanding
//             class kondisional: isLanding → 'text-indigo-600 dark:text-indigo-400'
//                                else     → 'text-gray-600 dark:text-gray-300 hover:text-gray-900...'
//           - <button onClick={() => handleNavClick('cara-kerja')}> "Cara Kerja"
//           - <button onClick={() => handleNavClick('fitur')}> "Fitur"
//
//       [1c] Right side (flex items-center gap-2):
//           - Jika !isLanding: tombol "Cari Mahasiswa" (hidden sm:flex)
//             <Link to="/" class="hidden sm:flex items-center gap-1.5 ...">
//               <BarChart3 class="w-4 h-4" /> Cari Mahasiswa
//             </Link>
//           - Tombol dark mode toggle (w-9 h-9 rounded-xl):
//             onClick={() => setDarkMode(!darkMode)}
//             Isi kondisional: darkMode → <Sun /> : <Moon />
//           - Hamburger button (md:hidden):
//             onClick={() => setMobileOpen(!mobileOpen)}
//             Isi kondisional: mobileOpen → <X /> : <Menu />
//
//       [1d] Mobile menu (hanya render jika mobileOpen, md:hidden):
//           <div class="md:hidden border-t border-gray-100 dark:border-gray-800
//                       bg-white dark:bg-gray-900 px-4 py-3 space-y-1 animate-fade-in">
//             4 item menu:
//             - <Link to="/" onClick={() => setMobileOpen(false)}> Beranda (icon: Home)
//             - <button onClick={() => handleNavClick('cara-kerja')}> Cara Kerja (icon: Cpu)
//             - <button onClick={() => handleNavClick('fitur')}> Fitur (icon: Zap)
//             - Jika !isLanding: <Link to="/"> Cari Mahasiswa (icon: BarChart3, warna indigo)
//
//   [2] Render popup jika ada:
//       {popup && <NavPopup type={popup} onClose={() => setPopup(null)} />}

// ─── CATATAN PENTING ──────────────────────────────────────────────────────────
// - sticky top-0 z-40: navbar tetap di atas saat scroll
// - backdrop-blur-md: efek blur pada background navbar (glassmorphism)
// - bg-white/90: background semi-transparan (90% opacity)
// - isLanding: digunakan untuk 2 hal: warna link aktif & behavior klik nav
// - handleNavClick: scroll ke section jika di landing, popup jika di halaman lain
// - stopPropagation: penting agar klik di dalam modal tidak menutup modal
// - group / group-hover: Tailwind utility untuk hover effect pada child element
// - animate-fade-in: custom animation dari index.css untuk mobile menu
