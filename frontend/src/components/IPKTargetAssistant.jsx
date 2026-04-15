// ═══════════════════════════════════════════════════════════════════════════
// FILE: frontend/src/components/IPKTargetAssistant.jsx
// DEVELOPER: Anak 8 (Frontend - IPK Target Feature)
// DESKRIPSI: Wizard multi-step untuk analisis target IPK mahasiswa.
//            Mengumpulkan input user (target IPK, kebiasaan, gaya belajar,
//            matkul tersulit) lalu kirim ke backend dan tampilkan hasil analisis.
// ═══════════════════════════════════════════════════════════════════════════

// ─── STEP 1: IMPORT ───────────────────────────────────────────────────────────
// import { useState } dari 'react'
// import {
//   Target, ChevronRight, ChevronLeft, Loader2, CheckCircle,
//   AlertTriangle, XCircle, Sparkles, BarChart2, BookOpen, RefreshCw
// } dari 'lucide-react'
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//          ReferenceLine, ResponsiveContainer } dari 'recharts'
// import { postIPKTarget } dari '../api/client'

// ─── STEP 2: BUAT KONSTANTA ───────────────────────────────────────────────────
// STEPS: array label untuk step indicator
// ['Target IPK', 'Kebiasaan Belajar', 'Gaya Belajar', 'Mata Kuliah Sulit', 'Hasil']
//
// KEBIASAAN_OPTIONS: array 3 pilihan kebiasaan belajar
// [
//   { value: 'rutin',  label: 'Rutin setiap hari',  desc: 'Belajar terjadwal & konsisten' },
//   { value: 'kadang', label: 'Kadang-kadang',       desc: 'Belajar saat ada tugas/ujian' },
//   { value: 'jarang', label: 'Jarang',              desc: 'Belajar hanya menjelang ujian' },
// ]
//
// GAYA_OPTIONS: array 4 pilihan gaya belajar
// [
//   { value: 'visual',   label: 'Visual',              desc: 'Diagram, mind map, video' },
//   { value: 'membaca',  label: 'Membaca & Mencatat',  desc: 'Buku, ringkasan, catatan' },
//   { value: 'diskusi',  label: 'Diskusi',             desc: 'Kelompok belajar, tanya jawab' },
//   { value: 'praktek',  label: 'Praktek Langsung',    desc: 'Soal latihan, proyek, lab' },
// ]

// ─── STEP 3: BUAT COMPONENT ValidasiBadge ─────────────────────────────────────
// function ValidasiBadge({ validasi }) — tidak di-export
//
// - Buat object cfg dengan 4 key status:
//   'realistis':     { icon: CheckCircle,   cls: 'bg-emerald-50 ... border-emerald-300 ... text-emerald-700 ...' }
//   'ambisius':      { icon: AlertTriangle, cls: 'bg-amber-50 ... border-amber-300 ... text-amber-700 ...' }
//   'tidak_mungkin': { icon: XCircle,       cls: 'bg-red-50 ... border-red-300 ... text-red-700 ...' }
//   'tidak_valid':   { icon: XCircle,       cls: sama dengan tidak_mungkin }
//
// - const c = cfg[validasi.status] || cfg.ambisius  (fallback ke ambisius)
// - const Icon = c.icon
//
// Return JSX:
// <div class={`flex items-start gap-2 px-4 py-3 rounded-xl border ${c.cls}`}>
//   <Icon class="w-5 h-5 flex-shrink-0 mt-0.5" />
//   <div>
//     <p class="font-bold text-sm">{validasi.label}</p>
//     <p class="text-xs mt-0.5 opacity-90">{validasi.pesan}</p>
//   </div>
// </div>

// ─── STEP 4: BUAT COMPONENT ProyeksiChart ─────────────────────────────────────
// function ProyeksiChart({ proyeksi, targetIPK, currentIPK, semesterAktif }) — tidak di-export
//
// - Build data array:
//   const data = [
//     { name: `Sem ${semesterAktif - 1}`, ipk: currentIPK },  // titik awal (IPK saat ini)
//     ...proyeksi.map(r => ({
//       name: `Sem ${semesterAktif + r.semester_ke - 1}`,
//       ipk: r.ipk_proyeksi
//     }))
//   ]
//
// Return JSX: <div class="h-48">
//   <ResponsiveContainer width="100%" height="100%">
//     <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
//       <CartesianGrid strokeDasharray="3 3" stroke="currentColor" class="text-gray-100 dark:text-gray-700/50" />
//       <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine=false axisLine=false />
//       <YAxis domain={[Math.max(0, currentIPK - 0.5), 4.0]} tick={{ fontSize: 10 }} tickLine=false axisLine=false />
//       <Tooltip formatter={(v) => [v.toFixed(2), 'IPK Proyeksi']} />
//       <ReferenceLine y={targetIPK} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5}
//         label={{ value: `Target ${targetIPK}`, position: 'right', fontSize: 10, fill: '#f59e0b' }} />
//       <Line type="monotone" dataKey="ipk" stroke="#6366f1" strokeWidth={2.5}
//         dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
//     </LineChart>
//   </ResponsiveContainer>
// </div>

// ─── STEP 5: BUAT DEFAULT EXPORT function IPKTargetAssistant ──────────────────
// Props: { nim, riwayatSemester, semesterAktif, currentIPK, prediksiIPK }
//
// STEP 5a: State declarations
// const [step, setStep] = useState(0)          → step wizard saat ini (0-4)
// const [open, setOpen] = useState(false)       → apakah wizard terbuka
// const [loading, setLoading] = useState(false) → loading saat submit
// const [result, setResult] = useState(null)    → hasil dari API
// const [error, setError] = useState('')        → pesan error
// Form state:
// const [targetIPK, setTargetIPK] = useState('')
// const [targetError, setTargetError] = useState('')
// const [kebiasaan, setKebiasaan] = useState('')
// const [gaya, setGaya] = useState('')
// const [matkulTersulit, setMatkulTersulit] = useState([])  → array kode matkul
// const [bebanSKS, setBebanSKS] = useState(22)
//
// STEP 5b: Kumpulkan semua matkul unik dari riwayat
// const allMatkul = []
// const seen = new Set()
// riwayatSemester?.forEach(sem => {
//   sem.nilai_matkul?.forEach(mk => {
//     if (!seen.has(mk.kode)) {
//       seen.add(mk.kode)
//       allMatkul.push(mk)
//     }
//   })
// })
//
// STEP 5c: Helper functions
//
// toggleMatkul(kode): toggle pilihan matkul tersulit (max 5)
// const toggleMatkul = (kode) => {
//   setMatkulTersulit(prev =>
//     prev.includes(kode)
//       ? prev.filter(k => k !== kode)           // hapus jika sudah ada
//       : prev.length < 5 ? [...prev, kode] : prev  // tambah jika belum 5
//   )
// }
//
// validateTarget(val): validasi input target IPK
// - Jika bukan angka atau <= 0 → 'Masukkan angka yang valid'
// - Jika > 4.0 → 'IPK maksimum adalah 4.00'
// - Jika < currentIPK - 0.5 → 'Target terlalu rendah dari IPK saat ini'
// - else → '' (valid)
//
// canNext(): boolean apakah bisa lanjut ke step berikutnya
// - step 0: !validateTarget(targetIPK)
// - step 1: !!kebiasaan
// - step 2: !!gaya
// - step 3: true (matkul tersulit opsional)
//
// handleNext(): handler tombol "Lanjut"
// - step 0: validasi target, jika error set targetError dan return
// - step 3: panggil handleSubmit()
// - else: setStep(s => s + 1)
//
// handleSubmit(): kirim data ke API
// - setLoading(true), setError(''), setStep(4)
// - try: const res = await postIPKTarget(nim, { target_ipk, kebiasaan_belajar,
//         gaya_belajar, beban_sks_direncanakan, matkul_tersulit })
//   setResult(res)
// - catch: setError(e.message || 'Terjadi kesalahan.')
// - finally: setLoading(false)
//
// handleReset(): reset semua state ke awal
// - setStep(0), setResult(null), setError('')
// - setTargetIPK(''), setKebiasaan(''), setGaya(''), setMatkulTersulit([])
//
// STEP 5d: Render kondisional — jika !open
// Tampilkan tombol "Mulai" (collapsed state):
// <div class="card animate-slide-up border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-900/10">
//   <button onClick={() => setOpen(true)} class="w-full flex items-center justify-between gap-4 group">
//     Kiri: icon Target + teks "Asisten Target IPK" + deskripsi
//     Kanan: badge "Mulai" (bg-indigo-600, icon Sparkles)
//   </button>
// </div>
//
// STEP 5e: Render wizard (jika open)
// <div class="card animate-slide-up">
//
//   [1] Header wizard: flex items-center justify-between mb-5
//       Kiri: icon Target + judul + info IPK saat ini & prediksi
//       Kanan: tombol "Tutup" (text-xs, onClick: setOpen(false) + handleReset())
//
//   [2] Step indicator: flex items-center gap-1 mb-6
//       Map STEPS.slice(0, 4) → render 4 step circle + label + connector line
//       Circle style kondisional:
//       - i < step  → 'bg-indigo-600 text-white' + isi '✓'
//       - i === step → 'bg-indigo-100 ... ring-2 ring-indigo-500' + isi nomor
//       - else       → 'bg-gray-100 ... text-gray-400' + isi nomor
//       Connector line (i < 3): flex-1 h-0.5 mx-1 rounded
//       - i < step → 'bg-indigo-500'
//       - else     → 'bg-gray-200 dark:bg-gray-700'
//
//   [3] Step content (kondisional berdasarkan step):
//
//       Step 0 — Target IPK:
//       - Input number (min=0, max=4, step=0.01)
//         onChange: setTargetIPK + validateTarget
//       - Error message jika targetError
//       - 3 tombol shortcut: 3.00, 3.50, 3.75
//         onClick: setTargetIPK(String(v)) + setTargetError('')
//         Style aktif: bg-indigo-600 text-white border-indigo-600
//       - Info box: IPK saat ini + prediksi
//
//       Step 1 — Kebiasaan Belajar:
//       - Map KEBIASAAN_OPTIONS → radio button style
//         <button onClick={() => setKebiasaan(opt.value)}
//                 class kondisional: selected → border-indigo-500 bg-indigo-50
//         Isi: radio circle + label + desc
//
//       Step 2 — Gaya Belajar:
//       - Map GAYA_OPTIONS → sama seperti step 1
//
//       Step 3 — Matkul Tersulit:
//       - Map allMatkul → checkbox button style (max 5)
//         disabled jika sudah 5 dan belum dipilih
//         <button onClick={() => toggleMatkul(mk.kode)}
//                 class kondisional: selected → border-indigo-500 bg-indigo-50
//         Isi: checkbox square + nama matkul + kode + SKS + nilai
//       - Counter: "{matkulTersulit.length}/5 dipilih · Boleh dilewati"
//
//       Step 4 — Hasil:
//       - Jika loading: spinner Loader2 + teks "Menganalisis..."
//       - Jika error: pesan error + tombol "Coba Lagi" (handleReset)
//       - Jika result && !loading:
//         * <ValidasiBadge validasi={result.validasi} />
//         * Analisis Matematis:
//           - 4 stat cards: Target IPK, IPS Min/Semester, Sisa Semester, Capai di Semester
//           - <ProyeksiChart> jika result.proyeksi_ipk?.length > 0
//           - Tabel proyeksi: kolom Semester, IPK Proyeksi, Status
//             Status: jika ipk_proyeksi >= target → '✓ Target' (emerald), else '—'
//         * Panduan Personal:
//           - <pre> dengan whitespace-pre-wrap untuk format teks dari backend
//         * Tombol "Analisis Ulang" (handleReset)
//
//   [4] Navigation buttons (hanya jika step < 4):
//       flex items-center justify-between mt-6 pt-4 border-t
//       Kiri: tombol "Kembali" / "Batal"
//         - step === 0: onClick = setOpen(false) + handleReset(), label "Batal"
//         - else: onClick = setStep(s => s - 1), label "Kembali"
//       Kanan: tombol "Lanjut" / "Analisis Sekarang"
//         - disabled jika !canNext()
//         - step === 3: label "Analisis Sekarang" + icon Sparkles
//         - else: label "Lanjut" + icon ChevronRight

// ─── CATATAN PENTING ──────────────────────────────────────────────────────────
// - Wizard pattern: satu state `step` mengontrol konten yang ditampilkan
// - Step 4 adalah hasil, tidak ada tombol navigasi (hanya reset)
// - handleSubmit dipanggil dari handleNext saat step === 3
// - setStep(4) dipanggil di awal handleSubmit agar UI langsung pindah ke loading
// - postIPKTarget mengirim POST request ke /api/ipk-target/{nim}
// - result.panduan_personal: teks panjang dari backend, gunakan <pre> untuk format
// - bebanSKS: state ada tapi tidak ada UI untuk mengubahnya (default 22)
//   Bisa ditambahkan slider di step 3 jika diperlukan
// - Komponen ini dipakai di Dashboard.jsx di kolom kiri bawah
