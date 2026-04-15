// ═══════════════════════════════════════════════════════════════════════════
// FILE: frontend/src/pages/Dashboard.jsx
// DEVELOPER: Anak 7 (Frontend - Dashboard Page)
// DESKRIPSI: Halaman dashboard lengkap untuk satu mahasiswa.
//            Menampilkan profil, prediksi IPS/IPK, chart tren, simulasi SKS,
//            daftar matkul, riwayat nilai, catatan akademik, dan asisten target IPK.
// ═══════════════════════════════════════════════════════════════════════════

// ─── STEP 1: IMPORT ───────────────────────────────────────────────────────────
// import { useEffect, useState, useMemo } dari 'react'
// import { useParams, Link } dari 'react-router-dom'
// import {
//   ArrowLeft, RefreshCw, AlertCircle, TrendingUp, TrendingDown,
//   Minus, Target, MessageSquare, Calendar, Award, Info,
//   CheckSquare, BookOpen, ChevronDown, ChevronUp,
//   History, User, GraduationCap, ListChecks, X, RotateCcw
// } dari 'lucide-react'
// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
//   ResponsiveContainer, Legend, ReferenceLine
// } dari 'recharts'
// import { getPredict } dari '../api/client'
// import LoadingSpinner dari '../components/LoadingSpinner'
// import IPKTargetAssistant dari '../components/IPKTargetAssistant'

// ─── STEP 2: KONSTANTA ────────────────────────────────────────────────────────
// PRODI_COLORS: gradient per prodi (sama seperti di komponen lain)
// {
//   TI: 'from-indigo-500 to-blue-600',
//   AK: 'from-emerald-500 to-teal-600',
//   TM: 'from-orange-500 to-red-600',
//   AP: 'from-violet-500 to-purple-600',
// }
//
// GRADE_BADGE: class badge per nilai huruf (bg + text + border, support dark mode)
// {
//   A:  'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700',
//   AB: 'bg-teal-100 ...',
//   B:  'bg-blue-100 ...',
//   BC: 'bg-yellow-100 ...',
//   C:  'bg-orange-100 ...',
//   D:  'bg-red-100 ...',
//   E:  'bg-gray-100 ...',
// }
//
// SKS_CONFIG: konfigurasi tampilan per jumlah SKS (24, 23, 22, 21)
// Setiap key berisi: { color, bg, border, text, label }
// 24: emerald, label 'Beban Penuh'
// 23: blue/indigo, label 'Beban Tinggi'
// 22: yellow/amber, label 'Beban Normal'
// 21: orange/red, label 'Beban Ringan'

// ─── STEP 3: HELPER FUNCTIONS ─────────────────────────────────────────────────
// function getIPKColor(ipk): return Tailwind text color class berdasarkan IPK
//   >= 3.5 → 'text-emerald-600 dark:text-emerald-400'
//   >= 3.0 → 'text-blue-600 dark:text-blue-400'
//   >= 2.5 → 'text-yellow-600 dark:text-yellow-400'
//   else   → 'text-red-600 dark:text-red-400'
//
// function getIPKBg(ipk): return Tailwind bg color class berdasarkan IPK
//   >= 3.5 → 'bg-emerald-500'
//   >= 3.0 → 'bg-blue-500'
//   >= 2.5 → 'bg-yellow-500'
//   else   → 'bg-red-500'
//
// function getInitials(nama): return 2 huruf kapital dari 2 kata pertama nama
//   nama.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

// ─── STEP 4: COMPONENT StudentProfileCard ─────────────────────────────────────
// Props: { student, prediksi }
//
// - const ipk = student.ipk_kumulatif
// - const trend = prediksi?.trend || 'stabil'
// - Buat trendConfig object dengan 3 key (meningkat, menurun, stabil):
//   Setiap key: { icon: TrendingUp/TrendingDown/Minus, label: string, cls: string }
//   cls adalah class badge (bg + text + border, support dark mode)
// - const tc = trendConfig[trend] || trendConfig.stabil
// - const TrendIcon = tc.icon
// - const prodi_color = PRODI_COLORS[student.prodi_key] || 'from-indigo-500 to-purple-600'
//
// Return JSX: <div class="card animate-slide-up">
//   flex flex-col sm:flex-row items-start sm:items-center gap-4
//
//   [1] Avatar (w-14 h-14 sm:w-16 sm:h-16 rounded-2xl, gradient bg, shadow-lg, flex-shrink-0):
//       class: `bg-gradient-to-br ${prodi_color}`
//       Isi: <span class="text-white font-extrabold text-lg sm:text-xl">{getInitials(student.nama)}</span>
//
//   [2] Info (flex-1 min-w-0):
//       - Baris nama + badge prodi: flex flex-wrap items-center gap-2 mb-1
//         * <h2> nama: text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white truncate
//         * Badge prodi_key: px-2.5 py-0.5 rounded-full text-xs font-bold
//           bg-gradient-to-r ${prodi_color} text-white flex-shrink-0
//       - Info row (flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500):
//         * NIM dengan icon GraduationCap (font-mono font-semibold text-gray-700)
//         * Jenis kelamin dengan icon User ('L' → 'Laki-laki', 'P' → 'Perempuan', else '-')
//         * Nama prodi (hidden sm:inline)
//         * Angkatan
//       - Semester aktif: mt-1 flex items-center gap-2 text-xs sm:text-sm
//         * Label "Semester Aktif:" (text-gray-500)
//         * Nilai: font-bold text-gray-800 dark:text-gray-200
//
//   [3] Trend badge (flex-shrink-0):
//       <div class={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold ${tc.cls}`}>
//         <TrendIcon class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//         {tc.label}
//       </div>
//
//   [4] IPK progress bar (mt-4 pt-4 border-t border-gray-100 dark:border-gray-700):
//       - Header row: flex items-center justify-between mb-2
//         * "IPK Kumulatif" (text-sm font-semibold text-gray-700 dark:text-gray-300)
//         * Nilai IPK: text-lg font-extrabold tabular-nums ${getIPKColor(ipk)}
//           Isi: {ipk.toFixed(2)} / 4.00
//       - Track bar: w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden
//         Fill: h-full rounded-full ${getIPKBg(ipk)} transition-all duration-700
//               style={{ width: `${(ipk / 4.0) * 100}%` }}
//       - Scale labels: flex justify-between mt-1 text-xs text-gray-400
//         5 label: 0.00, 2.00, 3.00, 3.50, 4.00

// ─── STEP 5: COMPONENT PredictionSummaryCards ─────────────────────────────────
// Props: { prediksi, currentIPK, selectedScenario }
//
// - const st = prediksi.semester_target
// - Ambil nilai dari selectedScenario jika ada, fallback ke prediksi:
//   const ips = selectedScenario ? selectedScenario.prediksi_ips : prediksi.prediksi_ips
//   const ipk = selectedScenario ? selectedScenario.prediksi_ipk : prediksi.prediksi_ipk_baru
//   const recSks = selectedScenario ? selectedScenario.sks : prediksi.rekomendasi_sks
// - const conf = prediksi.confidence
// - const sksCfg = SKS_CONFIG[recSks] || SKS_CONFIG[22]
//
// Return JSX: grid grid-cols-1 sm:grid-cols-2 gap-4
//
//   [Card A] Prediksi IPS: <div class="card animate-slide-up">
//     - Label: "Prediksi Semester {st} (Sedang Berjalan)" (text-xs uppercase tracking-wide)
//     - Angka IPS besar: text-5xl font-extrabold tabular-nums ${getIPKColor(ips)}
//       Isi: {ips.toFixed(2)}
//     - "IPS" label kecil di samping
//     - Row "Prediksi IPK Baru": flex justify-between text-sm
//     - Row "Keyakinan": flex justify-between text-sm
//     - Badge semester: px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200
//       inline-flex items-center gap-1
//       Isi: <Target class="w-3.5 h-3.5 text-indigo-500" /> + "Semester {st}"
//
//   [Card B] Rekomendasi SKS: <div class={`card animate-slide-up ${sksCfg.bg} border ${sksCfg.border}`}>
//     - Label: "Rekomendasi SKS" (text-xs uppercase tracking-wide)
//     - Angka SKS besar: text-5xl font-extrabold tabular-nums
//       bg-gradient-to-r ${sksCfg.color} bg-clip-text text-transparent
//       Isi: {recSks}
//     - "SKS" label kecil di samping
//     - Badge label SKS: px-2 py-0.5 rounded-full text-xs font-bold ${sksCfg.text} ${sksCfg.bg}
//     - Progress bar SKS: w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2
//       Fill: bg-gradient-to-r ${sksCfg.color}
//             style={{ width: `${(recSks / 24) * 100}%` }}
//     - Label: "{recSks} / 24 SKS maksimum" (text-xs text-gray-400 mt-1)

// ─── STEP 6: COMPONENT ChartTooltip (untuk TrendChart) ────────────────────────
// const ChartTooltip = ({ active, payload, label }) => {
//   Guard: if (!active || !payload || !payload.length) return null
//   const isPred = label?.toString().includes('Prediksi')
//   Return JSX tooltip box (bg-white dark:bg-gray-800, border, rounded-xl, shadow-xl, p-3):
//     - <p> label: text-xs font-semibold text-gray-500 mb-1
//     - Map payload → <p key={i} style={{ color: p.color }} class="text-sm font-bold">
//         {p.name}: <span class="tabular-nums">{Number(p.value).toFixed(2)}</span>
//       </p>
//     - Jika isPred: <p class="text-xs text-amber-500 mt-1 italic">* Nilai prediksi</p>
// }

// ─── STEP 7: COMPONENT TrendChart ─────────────────────────────────────────────
// Props: { riwayat, prediksiIPS, prediksiIPK, semesterTarget, selectedScenario }
//
// - Ambil nilai display dari selectedScenario jika ada:
//   const displayIPS = selectedScenario ? selectedScenario.prediksi_ips : prediksiIPS
//   const displayIPK = selectedScenario ? selectedScenario.prediksi_ipk : prediksiIPK
//
// - Build data array (sama seperti IPKChart.jsx):
//   const data = []
//   let cumSks = 0, cumPoints = 0
//   riwayat.forEach(sem => {
//     cumSks += sem.sks; cumPoints += sem.ips * sem.sks
//     data.push({ name: `Semester ${sem.semester}`, IPS: sem.ips, IPK: parseFloat((cumPoints/cumSks).toFixed(2)) })
//   })
//   data.push({ name: `Sem ${semesterTarget} (Prediksi)`, IPS: displayIPS, IPK: displayIPK, isPredicted: true })
//
// - Hitung trend dari 2 semester terakhir:
//   const trend = riwayat.length >= 2
//     ? riwayat[riwayat.length - 1].ips - riwayat[riwayat.length - 2].ips : 0
//   Tentukan TrendIcon, trendColor, trendLabel berdasarkan threshold 0.05
//
// Return JSX: <div class="card animate-slide-up">
//   [1] Header: flex items-center justify-between mb-4
//       Kiri: h3 "Tren Performa Akademik" + p "IPS & IPK per semester"
//       Kanan: badge trend (flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50)
//
//   [2] Chart: <div class="h-64">
//       <ResponsiveContainer width="100%" height="100%">
//         <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
//           <defs>
//             Gradient "ipsGrad": indigo #6366f1, opacity 0.3 → 0
//             Gradient "ipkGrad": purple #a855f7, opacity 0.3 → 0
//           </defs>
//           <CartesianGrid strokeDasharray="3 3" stroke="currentColor" class="text-gray-100 dark:text-gray-700/50" />
//           <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine=false axisLine=false />
//           <YAxis domain={[0, 4]} ticks={[0,1,2,3,4]} tick={{ fontSize: 11 }} tickLine=false axisLine=false />
//           <Tooltip content={<ChartTooltip />} />
//           <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
//           <ReferenceLine x={`Sem ${semesterTarget} (Prediksi)`} stroke="#f59e0b"
//             strokeDasharray="4 4" strokeWidth={1.5}
//             label={{ value: 'Prediksi', position: 'top', fontSize: 10, fill: '#f59e0b' }} />
//           <Area type="monotone" dataKey="IPS" stroke="#6366f1" strokeWidth={2.5}
//             fill="url(#ipsGrad)" dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
//             activeDot={{ r: 6, strokeWidth: 0 }} />
//           <Area type="monotone" dataKey="IPK" stroke="#a855f7" strokeWidth={2.5}
//             fill="url(#ipkGrad)" dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
//             activeDot={{ r: 6, strokeWidth: 0 }} />
//         </AreaChart>
//       </ResponsiveContainer>
//
//   [3] Legend manual (flex items-center gap-4 mt-3 pt-3 border-t):
//       - Dot indigo + "IPS per semester"
//       - Dot purple + "IPK kumulatif"
//       - Dashed amber + "Nilai prediksi" (ml-auto)

// ─── STEP 8: COMPONENT MatkulListModal ────────────────────────────────────────
// Props: { scenario, onClose }
// Guard: if (!scenario) return null
//
// - const cfg = SKS_CONFIG[scenario.sks] || SKS_CONFIG[22]
//
// Return JSX: modal overlay (fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm)
//   onClick={onClose} → klik backdrop tutup modal
//
//   Modal box (bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col)
//   onClick={e => e.stopPropagation()} → cegah bubble ke backdrop
//
//   [1] Header (flex items-center justify-between px-5 py-4 border-b):
//       Kiri: icon BookOpen (gradient cfg.color) + judul "Daftar Matakuliah" + label SKS
//       Kanan: tombol X (p-1.5 rounded-lg hover:bg-gray-100)
//
//   [2] Stats row (px-4 py-3 bg-gray-50 border-b grid grid-cols-3 gap-3 text-center):
//       3 stat: Total SKS, Prediksi IPS, IPK Baru
//       Masing-masing: label text-xs text-gray-400 + nilai font-extrabold tabular-nums
//
//   [3] Daftar matkul (flex-1 overflow-y-auto px-4 py-3 space-y-1.5):
//       Map scenario.matkul → <div key={mk.kode} class="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border">
//         Kiri (flex-1 min-w-0):
//           <p> nama matkul: text-sm font-medium truncate
//           <p> kode + wajib/pilihan: text-xs text-gray-400
//         Kanan (text-right flex-shrink-0):
//           <p> SKS: text-xs font-bold text-gray-600
//           Jika mk.prediksi_nilai_huruf: badge nilai huruf (GRADE_BADGE)
//
//   [4] Footer (px-5 py-3 border-t):
//       Tombol "Tutup" (w-full py-2 rounded-xl text-sm font-semibold bg-gray-100)

// ─── STEP 9: COMPONENT SKSScenarios ───────────────────────────────────────────
// Props: { scenarios, rekomendasi_sks, selectedSks, onSelectSks, onOpenPilihMatkul, isCustom, onReset }
//
// - const [modalScenario, setModalScenario] = useState(null)
//   → state untuk modal daftar matkul per scenario
//
// Return JSX: <div class="card animate-slide-up">
//
//   [1] Header: flex flex-wrap items-start justify-between gap-3 mb-5
//       Kiri: icon Award + judul "Simulasi SKS — Jika Anda Mengambil..." + deskripsi
//       Kanan: tombol-tombol
//         - Jika isCustom: tombol "Reset" (onClick={onReset}, icon RotateCcw)
//         - Tombol "Pilih Matakuliah" (onClick={onOpenPilihMatkul}, icon ListChecks, gradient indigo-purple)
//
//   [2] Jika isCustom: info banner (bg-indigo-50 border-indigo-200 rounded-xl px-3 py-2)
//       Isi: <CheckSquare /> + teks "Menggunakan pilihan matakuliah kustom. Klik Reset..."
//
//   [3] Grid 4 kartu scenario: grid grid-cols-2 lg:grid-cols-4 gap-3
//       Map scenarios → render kartu:
//       - const cfg = SKS_CONFIG[sc.sks] || SKS_CONFIG[22]
//       - const isRec = sc.sks === rekomendasi_sks
//       - const isSelected = !isCustom && sc.sks === selectedSks
//
//       <button key={sc.sks} onClick={() => onSelectSks(sc.sks)}
//               class kondisional:
//               - isSelected: `${cfg.bg} ${cfg.border} ring-2 ring-offset-2 ring-indigo-500 shadow-lg`
//               - else: 'bg-gray-50 border-gray-200 hover:border-indigo-300'
//               Base: rounded-2xl p-4 border-2 transition-all text-left cursor-pointer hover:scale-[1.02] active:scale-[0.98]>
//
//         Jika isRec: badge "Rekomendasi" (text-xs font-bold text-indigo-600, icon Target)
//         Jika isSelected && !isRec: badge "Dipilih" (icon CheckSquare)
//
//         Angka SKS: text-4xl font-extrabold bg-gradient-to-r ${cfg.color} bg-clip-text text-transparent
//         Label: "SKS · {sc.matkul_count} matkul" (text-xs text-gray-400 mb-3)
//
//         Stats (space-y-1.5):
//           - "Prediksi IPS": flex justify-between text-xs
//           - "IPK Baru": flex justify-between text-xs
//
//         Footer kartu: mt-2.5 flex items-center justify-between
//           - Badge label SKS: px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.text} ${cfg.bg}
//           - Jika sc.matkul?.length > 0: tombol "Lihat" (icon BookOpen)
//             onClick: e.stopPropagation() + setModalScenario(sc)
//
//   [4] Render modal jika modalScenario:
//       {modalScenario && <MatkulListModal scenario={modalScenario} onClose={() => setModalScenario(null)} />}

// ─── STEP 10: COMPONENT PilihMatkulModal ──────────────────────────────────────
// Props: { allCourses, currentIPK, cumSks, onConfirm, onClose }
//
// Konstanta: const MIN_SKS = 12, MAX_SKS = 24
//
// - const wajibCourses = allCourses.filter(c => c.wajib)
// - const pilihanCourses = allCourses.filter(c => !c.wajib)
// - const wajibSks = wajibCourses.reduce((s, c) => s + c.sks, 0)
//
// State:
// const [selected, setSelected] = useState(() => new Set(wajibCourses.map(c => c.kode)))
// → Inisialisasi dengan semua matkul wajib sudah terpilih
//
// useMemo untuk totalSks:
// const totalSks = useMemo(() => {
//   return allCourses.filter(c => selected.has(c.kode)).reduce((s, c) => s + c.sks, 0)
// }, [selected, allCourses])
// → Recalculate hanya saat selected atau allCourses berubah
//
// toggle(kode, sks): toggle pilihan matkul pilihan
// const toggle = (kode, sks) => {
//   setSelected(prev => {
//     const next = new Set(prev)
//     if (next.has(kode)) {
//       next.delete(kode)
//     } else {
//       const newTotal = totalSks + sks
//       if (newTotal > MAX_SKS) return prev  // jangan tambah jika melebihi max
//       next.add(kode)
//     }
//     return next
//   })
// }
//
// const isValid = totalSks >= MIN_SKS && totalSks <= MAX_SKS
//
// handleConfirm(): hitung IPS dan IPK dari matkul yang dipilih, lalu panggil onConfirm
// const handleConfirm = () => {
//   const chosenCourses = allCourses.filter(c => selected.has(c.kode))
//   const ips = totalSks > 0
//     ? chosenCourses.reduce((s, c) => s + c.prediksi_nilai_angka * c.sks, 0) / totalSks
//     : 0
//   const roundedIps = Math.round(ips * 100) / 100
//   const totalSksNew = cumSks + totalSks
//   const ipk = totalSksNew > 0
//     ? Math.min(4, Math.max(0, Math.round(((cumSks * currentIPK + roundedIps * totalSks) / totalSksNew) * 100) / 100))
//     : roundedIps
//   onConfirm({ sks: totalSks, prediksi_ips: roundedIps, prediksi_ipk: ipk,
//               matkul_count: chosenCourses.length, matkul: chosenCourses, isCustom: true })
// }
//
// const sksColor = totalSks < MIN_SKS || totalSks > MAX_SKS ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
//
// Return JSX: modal overlay (fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm)
//   Modal box: bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col
//
//   [1] Header: flex items-center justify-between px-5 py-4 border-b
//       Kiri: icon ListChecks (gradient indigo-purple) + judul + "Min 12 · Maks 24 SKS"
//       Kanan: tombol X
//
//   [2] SKS Counter: px-5 py-3 bg-gray-50 border-b flex items-center justify-between
//       - "Total SKS dipilih:" (text-sm text-gray-600)
//       - Angka: text-xl font-extrabold tabular-nums ${sksColor}
//         Isi: {totalSks} / {MAX_SKS}
//
//   [3] Course List (flex-1 overflow-y-auto px-5 py-3 space-y-4):
//
//       [3a] Matkul Wajib (otomatis terpilih, tidak bisa di-uncheck):
//            Label: "Matakuliah Wajib (otomatis terpilih)" (text-xs font-bold uppercase)
//            Map wajibCourses → <div key={c.kode} class="flex items-center gap-3 p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
//              <CheckSquare class="w-4 h-4 text-indigo-500 flex-shrink-0" />
//              <div class="flex-1 min-w-0">
//                <p> nama: text-sm font-medium truncate
//                <p> kode: text-xs text-gray-400
//              </div>
//              <span> SKS: text-xs font-bold text-indigo-600
//
//       [3b] Matkul Pilihan (bisa di-toggle):
//            Label: "Matakuliah Pilihan" (text-xs font-bold uppercase)
//            Map pilihanCourses → render tombol toggle:
//            - const isChecked = selected.has(c.kode)
//            - const wouldExceed = !isChecked && totalSks + c.sks > MAX_SKS
//            <button key={c.kode} onClick={() => toggle(c.kode, c.sks)}
//                    disabled={wouldExceed}
//                    class kondisional:
//                    - isChecked: 'bg-emerald-50 border-emerald-200'
//                    - wouldExceed: 'bg-gray-50 border-gray-100 opacity-40 cursor-not-allowed'
//                    - else: 'bg-gray-50 border-gray-200 hover:border-indigo-300'>
//              Checkbox square (w-4 h-4 rounded border-2 flex items-center justify-center):
//                - isChecked: 'bg-emerald-500 border-emerald-500' + isi '✓' (text-white text-xs)
//                - else: 'border-gray-300 dark:border-gray-600'
//              Info (flex-1 min-w-0):
//                <p> nama: text-sm font-medium truncate
//                <p> kode + prediksi nilai: text-xs text-gray-400
//              <span> SKS: text-xs font-bold text-gray-600
//
//   [4] Footer (px-5 py-4 border-t flex items-center justify-between gap-3):
//       Kiri: validasi info
//         - totalSks < MIN_SKS: "Minimal {MIN_SKS} SKS" (text-red-500)
//         - totalSks > MAX_SKS: "Maksimal {MAX_SKS} SKS" (text-red-500)
//         - isValid: "{totalSks} SKS · {selected.size} matkul" (text-emerald-600)
//       Kanan: 2 tombol
//         - "Batal": bg-gray-100 hover:bg-gray-200
//         - "Konfirmasi": disabled jika !isValid
//           isValid → gradient indigo-purple
//           else    → bg-gray-300 cursor-not-allowed

// ─── STEP 11: COMPONENT CurrentSemesterCourses ────────────────────────────────
// Props: { riwayat, semesterTarget, selectedScenario }
//
// - const lastSem = riwayat.length > 0 ? riwayat[riwayat.length - 1] : null
// - Ambil matkul dari scenario atau fallback ke riwayat terakhir:
//   const matkul = selectedScenario?.matkul ?? lastSem?.nilai_matkul ?? []
//   const totalSks = selectedScenario?.sks ?? lastSem?.sks ?? 0
//
// Jika matkul kosong: render card dengan pesan "Data semester aktif belum tersedia"
//
// Return JSX: <div class="card animate-slide-up">
//   [1] Header: flex flex-wrap items-start justify-between gap-3 mb-5
//       Kiri: icon BookOpen (violet-purple) + judul "Matakuliah Semester {semesterTarget} (Sedang Berjalan)"
//             + "{matkul.length} mata kuliah · {totalSks} SKS"
//       Kanan: badge SKS (px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200)
//
//   [2] Daftar matkul (space-y-2 max-h-96 overflow-y-auto pr-1):
//       Map matkul → render row:
//       - const nilaiHuruf = c.prediksi_nilai_huruf ?? c.nilai_huruf
//         → Support 2 format: dari scenario (prediksi_nilai_huruf) dan riwayat (nilai_huruf)
//
//       <div key={c.kode} class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border">
//         Info (flex-1 min-w-0):
//           - Baris meta: flex items-center gap-1.5 mb-0.5
//             * <code> kode: text-xs font-mono text-gray-400
//             * separator "·"
//             * SKS: text-xs text-gray-500
//             * Jika c.wajib !== undefined: badge "Wajib"/"Pilihan"
//               Wajib: bg-indigo-50 text-indigo-500
//               Pilihan: bg-gray-100 text-gray-400
//           - <p> nama: text-sm font-medium text-gray-800 truncate
//         Nilai (text-right flex-shrink-0):
//           - Jika nilaiHuruf: badge nilai huruf (GRADE_BADGE) + nilai angka (text-xs text-gray-400)
//           - Else: badge "Berlangsung" (bg-amber-50 text-amber-600 border-amber-200)

// ─── STEP 12: COMPONENT GradeHistory ──────────────────────────────────────────
// Props: { riwayat }
//
// - const GRADE_COLORS = { A: 'grade-A', AB: 'grade-AB', ... E: 'grade-E' }
//   (definisikan di luar atau di dalam component)
//
// - const [openSem, setOpenSem] = useState(
//     riwayat.length > 0 ? riwayat[riwayat.length - 1].semester : null
//   )
//
// Return JSX: <div class="card animate-slide-up">
//   [1] Header: icon History (violet-purple) + "Riwayat Nilai" + "Nilai historis semester 1 s.d. {riwayat.length}"
//
//   [2] Accordion list (space-y-3):
//       Map riwayat → accordion item (border rounded-xl overflow-hidden):
//
//       [2a] Tombol header:
//            onClick: setOpenSem(openSem === sem.semester ? null : sem.semester)
//            Kiri: kotak nomor (warna berdasarkan IPS) + "Semester X" + "{sks} SKS · {matkul.length} matkul"
//            Kanan: IPS display + chevron icon (kondisional)
//
//       [2b] Detail (hanya jika openSem === sem.semester):
//            - Header kolom (hidden sm:grid grid-cols-12): Kode, Mata Kuliah, SKS, Nilai, Angka
//            - Map nilai_matkul → 2 versi row:
//              * Desktop (hidden sm:grid grid-cols-12): kode, nama, sks, badge nilai, angka
//              * Mobile (sm:hidden flex): nama + sks, badge nilai

// ─── STEP 13: COMPONENT AcademicNotes ─────────────────────────────────────────
// Props: { catatan }
//
// Return JSX: <div class="card animate-slide-up">
//   [1] Header: icon MessageSquare (amber-orange) + "Catatan Akademik" + "Rekomendasi dan analisis performa"
//   [2] Kotak catatan: bg-amber-50 border border-amber-200 rounded-xl p-4
//       <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{catatan}</p>
//   [3] Info disclaimer: bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2
//       <Info class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
//       <p class="text-xs text-blue-700 leading-relaxed">
//         "Prediksi dihasilkan berdasarkan data historis menggunakan algoritma weighted average
//          (Sem3:50%, Sem2:30%, Sem1:20%). Hasil bersifat estimasi. ..."
//       </p>

// ─── STEP 14: COMPONENT GraduationPage ────────────────────────────────────────
// Props: { data }
// Ditampilkan jika data.status === 'lulus'
//
// - const prodi_color = PRODI_COLORS[data.prodi_key] || 'from-indigo-500 to-purple-600'
// - const ipk = data.ipk_kumulatif
//
// Return JSX: <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
//   [1] Breadcrumb: <Link to="/"> + separator + NIM
//   [2] Gradient strip: h-1.5 rounded-full bg-gradient-to-r ${prodi_color} mb-6
//   [3] Card utama (text-center):
//       - Avatar GraduationCap (w-20 h-20 rounded-3xl, gradient bg)
//       - Badge "LULUS" (bg-emerald-100 border-emerald-200, icon Award)
//       - Nama mahasiswa (text-2xl font-extrabold)
//       - Info: NIM · prodi · angkatan
//       - Grid 2 kolom: IPK Kumulatif + Semester Ditempuh
//       - Progress bar IPK
//       - Tombol "Kembali ke Beranda" (btn-primary, icon ArrowLeft)
//   [4] Jika ada riwayat: render <GradeHistory riwayat={data.riwayat_semester} />

// ─── STEP 15: MAIN COMPONENT Dashboard (default export) ───────────────────────
// export default function Dashboard()
//
// STEP 15a: Hooks dan state
// const { nim } = useParams()  → ambil NIM dari URL parameter
// const [data, setData] = useState(null)
// const [loading, setLoading] = useState(true)
// const [error, setError] = useState('')
// const [selectedSks, setSelectedSks] = useState(null)       → SKS yang dipilih user
// const [customScenario, setCustomScenario] = useState(null) → scenario kustom dari PilihMatkul
// const [showPilihMatkul, setShowPilihMatkul] = useState(false)
//
// STEP 15b: Fetch data function
// const fetchData = async () => {
//   setLoading(true); setError(''); setCustomScenario(null); setSelectedSks(null)
//   try {
//     const result = await getPredict(nim)
//     setData(result)
//   } catch (err) {
//     setError(err.message || 'Terjadi kesalahan saat memuat data.')
//   } finally {
//     setLoading(false)
//   }
// }
//
// STEP 15c: useEffect untuk fetch saat NIM berubah
// useEffect(() => { fetchData() }, [nim])
//
// STEP 15d: Render kondisional
//
// Jika loading:
// return (
//   <div class="max-w-6xl mx-auto px-4 py-12">
//     <LoadingSpinner message="Memuat data dan menghitung prediksi..." />
//   </div>
// )
//
// Jika error:
// return (
//   <div class="max-w-2xl mx-auto px-4 py-20 text-center">
//     <div class="card">
//       Icon AlertCircle (w-16 h-16 rounded-2xl bg-red-100, icon merah)
//       <h2> "Data Tidak Ditemukan"
//       <p> {error}
//       2 tombol: "Kembali" (Link to="/", btn-secondary) + "Coba Lagi" (onClick=fetchData, btn-primary)
//     </div>
//   </div>
// )
//
// Jika !data: return null
//
// Jika data.status === 'lulus': return <GraduationPage data={data} />
//
// STEP 15e: Destructure data
// const { prediksi, riwayat_semester, ...student } = data
// const prodi_key = data.prodi_key
//
// STEP 15f: Hitung nilai efektif
// const effectiveSks = selectedSks ?? prediksi?.rekomendasi_sks
// const selectedScenario = customScenario
//   ?? prediksi?.sks_scenarios?.find(s => s.sks === effectiveSks)
//   ?? null
// const cumSks = riwayat_semester.reduce((s, sem) => s + sem.sks, 0)
//
// STEP 15g: Return JSX utama
// <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
//
//   [1] Breadcrumb (flex items-center gap-1.5 sm:gap-2 mb-5 sm:mb-6 flex-wrap):
//       - <Link to="/"> dengan icon ArrowLeft + "Beranda"
//       - Separator "/"
//       - "Dashboard" (hidden sm:inline)
//       - Separator "/"
//       - NIM (font-mono font-bold text-indigo-600, truncate max-w-[100px] sm:max-w-none)
//       - ml-auto: tanggal generated_at (hidden sm:flex, icon Calendar) + tombol Refresh
//
//   [2] Gradient accent bar:
//       <div class={`h-1.5 rounded-full bg-gradient-to-r ${PRODI_COLORS[prodi_key] || '...'} mb-6`} />
//
//   [3] Section 1 — Student Profile (mb-6):
//       <StudentProfileCard student={student} prediksi={prediksi} />
//
//   [4] Section 2 — Prediction Summary (mb-6):
//       <PredictionSummaryCards prediksi={prediksi} currentIPK={student.ipk_kumulatif}
//                               selectedScenario={selectedScenario} />
//
//   [5] Section 3 — Trend Chart (mb-6):
//       <TrendChart riwayat={riwayat_semester}
//                   prediksiIPS={prediksi.prediksi_ips}
//                   prediksiIPK={prediksi.prediksi_ipk_baru}
//                   semesterTarget={prediksi.semester_target}
//                   selectedScenario={selectedScenario} />
//
//   [6] Section 4 — SKS Scenarios (mb-6, hanya jika sks_scenarios ada):
//       {prediksi.sks_scenarios && prediksi.sks_scenarios.length > 0 && (
//         <SKSScenarios
//           scenarios={prediksi.sks_scenarios}
//           rekomendasi_sks={prediksi.rekomendasi_sks}
//           selectedSks={effectiveSks}
//           onSelectSks={(sks) => { setSelectedSks(sks); setCustomScenario(null) }}
//           onOpenPilihMatkul={() => setShowPilihMatkul(true)}
//           isCustom={!!customScenario}
//           onReset={() => { setCustomScenario(null); setSelectedSks(null) }}
//         />
//       )}
//
//   [7] Modal Pilih Matakuliah (hanya jika showPilihMatkul && prediksi.all_semester_courses):
//       <PilihMatkulModal
//         allCourses={prediksi.all_semester_courses}
//         currentIPK={student.ipk_kumulatif}
//         cumSks={cumSks}
//         onConfirm={(scenario) => { setCustomScenario(scenario); setShowPilihMatkul(false) }}
//         onClose={() => setShowPilihMatkul(false)}
//       />
//
//   [8] Section 5 — Current Semester Courses (mb-6):
//       <CurrentSemesterCourses riwayat={riwayat_semester}
//                               semesterTarget={prediksi.semester_target}
//                               selectedScenario={selectedScenario} />
//
//   [9] Section 6+7 — Grade History + Academic Notes (grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6):
//       Kolom kiri (space-y-6):
//         - <IPKTargetAssistant nim={nim} riwayatSemester={riwayat_semester}
//                               semesterAktif={student.semester_aktif}
//                               currentIPK={student.ipk_kumulatif}
//                               prediksiIPK={prediksi.prediksi_ipk_baru} />
//         - <GradeHistory riwayat={riwayat_semester} />
//       Kolom kanan (space-y-6):
//         - <AcademicNotes catatan={prediksi.catatan_akademik} />
//         - Quick performance summary card:
//           <div class="card">
//             Header: icon Award + "Ringkasan Performa"
//             Map riwayat_semester → progress bar row:
//               flex items-center gap-3:
//               - Label "Semester X" (w-24 text-sm text-gray-500 flex-shrink-0)
//               - Track bar (flex-1 bg-gray-100 rounded-full h-2 overflow-hidden):
//                 Fill warna berdasarkan IPS:
//                 >= 3.5 → from-emerald-400 to-green-500
//                 >= 3.0 → from-blue-400 to-indigo-500
//                 >= 2.5 → from-yellow-400 to-amber-500
//                 else   → from-red-400 to-rose-500
//                 style={{ width: `${(sem.ips / 4.0) * 100}%` }}
//               - Nilai IPS (w-10 text-right text-sm font-bold tabular-nums)
//             Row prediksi (pt-2 border-t):
//               - Label "Prediksi Sem X (Aktif)" (text-indigo-600, w-24)
//               - Track bar indigo-purple
//               - Nilai prediksi IPS (text-indigo-600)
//               Nilai: selectedScenario ? selectedScenario.prediksi_ips : prediksi.prediksi_ips
//
//   [10] Footer (text-center py-6 border-t border-gray-100 dark:border-gray-800):
//        <p class="text-sm text-gray-400 dark:text-gray-500">
//          Data bersifat sintetis untuk keperluan demonstrasi sistem · AcadPredict 2024
//        </p>

// ─── CATATAN PENTING ──────────────────────────────────────────────────────────
// - useParams(): hook React Router untuk ambil parameter URL (:nim)
// - useEffect dengan [nim]: re-fetch saat NIM berubah (navigasi antar mahasiswa)
// - selectedScenario: null jika tidak ada custom/pilihan, atau object scenario
//   Digunakan oleh TrendChart, PredictionSummaryCards, CurrentSemesterCourses
//   untuk menampilkan data sesuai scenario yang dipilih
// - customScenario: hasil dari PilihMatkulModal (scenario kustom user)
// - effectiveSks: selectedSks ?? rekomendasi_sks (fallback ke rekomendasi)
// - cumSks: total SKS yang sudah ditempuh (untuk kalkulasi IPK baru di PilihMatkul)
// - data.status === 'lulus': mahasiswa sudah lulus, tampilkan GraduationPage
// - Semua sub-component didefinisikan di file yang sama (tidak di-import)
//   karena mereka sangat spesifik untuk halaman ini
// - Urutan render section mengikuti alur informasi: profil → prediksi → chart
//   → simulasi → matkul aktif → riwayat → catatan
