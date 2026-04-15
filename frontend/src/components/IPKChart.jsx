// ═══════════════════════════════════════════════════════════════════════════
// FILE: frontend/src/components/IPKChart.jsx
// DEVELOPER: Anak 7 (Frontend - Dashboard Components)
// DESKRIPSI: Area chart tren IPS & IPK per semester menggunakan Recharts
// ═══════════════════════════════════════════════════════════════════════════

// ─── STEP 1: IMPORT ───────────────────────────────────────────────────────────
// Import dari 'recharts':
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//   ResponsiveContainer, ReferenceLine, Area, AreaChart, Legend
//
// Import dari 'lucide-react':
//   TrendingUp, TrendingDown, Minus

// ─── STEP 2: BUAT CUSTOM TOOLTIP COMPONENT ────────────────────────────────────
// const CustomTooltip = ({ active, payload, label }) => {
//
//   Guard: if (!active || !payload || !payload.length) return null
//
//   - Cek apakah ini data prediksi:
//     const isPredicted = label?.toString().includes('(Prediksi)')
//
//   Return JSX tooltip box:
//   <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
//               rounded-xl shadow-xl p-3">
//     <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</p>
//     Map payload → <p key={i} class="text-sm font-bold" style={{ color: p.color }}>
//       {p.name}: <span class="tabular-nums">{Number(p.value).toFixed(2)}</span>
//     </p>
//     Jika isPredicted:
//     <p class="text-xs text-amber-500 mt-1 italic">* Nilai prediksi</p>
//   </div>
// }

// ─── STEP 3: BUAT DEFAULT EXPORT function IPKChart ────────────────────────────
// Props: { riwayat, prediksiIPS, prediksiIPK }
//
// STEP 3a: Build chart data array
// const data = []
// let cumSks = 0, cumPoints = 0
//
// Loop riwayat dengan forEach:
//   cumSks += sem.sks
//   cumPoints += sem.ips * sem.sks
//   const ipk = cumPoints / cumSks  → IPK kumulatif dihitung manual
//   data.push({
//     name: `Semester ${sem.semester}`,
//     IPS: sem.ips,
//     IPK: parseFloat(ipk.toFixed(2)),
//   })
//
// Tambahkan data prediksi semester 5:
// data.push({
//   name: 'Sem 5 (Prediksi)',
//   IPS: prediksiIPS,
//   IPK: prediksiIPK,
//   isPredicted: true,
// })
//
// STEP 3b: Hitung trend dari 2 semester terakhir
// const trend = riwayat.length >= 2
//   ? riwayat[riwayat.length - 1].ips - riwayat[riwayat.length - 2].ips
//   : 0
//
// Tentukan icon, warna, dan label berdasarkan trend:
// - trend > 0.05  → TrendingUp,   'text-emerald-600 dark:text-emerald-400', 'Meningkat'
// - trend < -0.05 → TrendingDown, 'text-red-600 dark:text-red-400',         'Menurun'
// - else          → Minus,        'text-gray-600 dark:text-gray-400',        'Stabil'
//
// STEP 3c: Return JSX card
// Wrapper: <div class="card animate-slide-up">
//
//   [1] Header: flex items-center justify-between mb-4
//       Kiri:
//         <h3 class="section-title">Tren Performa Akademik</h3>
//         <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">IPS & IPK per semester</p>
//       Kanan (badge trend):
//         <div class={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 ${trendColor}`}>
//           <TrendIcon class="w-4 h-4" />
//           <span class="text-sm font-semibold">{trendLabel}</span>
//         </div>
//
//   [2] Chart container: <div class="h-64">
//       <ResponsiveContainer width="100%" height="100%">
//         <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
//
//           [2a] Gradient definitions (dalam <defs>):
//               - id="ipsGradient": indigo (#6366f1), opacity 0.3 → 0
//               - id="ipkGradient": purple (#a855f7), opacity 0.3 → 0
//               Format setiap gradient:
//               <linearGradient id="..." x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="..." stopOpacity={0.3} />
//                 <stop offset="95%" stopColor="..." stopOpacity={0} />
//               </linearGradient>
//
//           [2b] Grid: <CartesianGrid strokeDasharray="3 3" stroke="currentColor"
//                       class="text-gray-100 dark:text-gray-700/50" />
//
//           [2c] Axes:
//               XAxis: dataKey="name", tick fontSize 11, tickLine=false, axisLine=false
//               YAxis: domain=[0,4], ticks=[0,1,2,3,4], tick fontSize 11,
//                      tickLine=false, axisLine=false
//
//           [2d] Tooltip: content={<CustomTooltip />}
//
//           [2e] Legend: wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
//
//           [2f] ReferenceLine untuk garis prediksi:
//               x="Sem 5 (Prediksi)", stroke="#f59e0b", strokeDasharray="4 4",
//               strokeWidth={1.5}
//               label={{ value: 'Prediksi', position: 'top', fontSize: 10, fill: '#f59e0b' }}
//
//           [2g] Area IPS:
//               type="monotone", dataKey="IPS", stroke="#6366f1", strokeWidth={2.5}
//               fill="url(#ipsGradient)"
//               dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
//               activeDot={{ r: 6, strokeWidth: 0 }}
//               strokeDasharray={(d) => d.isPredicted ? '5 5' : '0'}
//               → Garis putus-putus untuk titik prediksi
//
//           [2h] Area IPK:
//               type="monotone", dataKey="IPK", stroke="#a855f7", strokeWidth={2.5}
//               fill="url(#ipkGradient)"
//               dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
//               activeDot={{ r: 6, strokeWidth: 0 }}
//
//   [3] Legend manual (di bawah chart): flex items-center gap-4 mt-3 pt-3 border-t
//       - Dot indigo + "IPS per semester"
//       - Dot purple + "IPK kumulatif"
//       - Garis dashed amber + "Nilai prediksi" (ml-auto)
//       Format dot: <div class="w-3 h-3 rounded-full bg-indigo-500" />
//       Format dashed: <div class="w-6 h-0.5 border-t-2 border-dashed border-amber-400" />

// ─── CATATAN PENTING ──────────────────────────────────────────────────────────
// - IPK dihitung kumulatif manual (bukan dari data), karena data hanya punya IPS
//   Formula: IPK = total_poin / total_sks, dimana poin = IPS * SKS per semester
// - fill="url(#ipsGradient)": referensi ke SVG gradient yang didefinisikan di <defs>
// - strokeDasharray pada Area: tidak bisa per-point, ini workaround dengan function
//   (hanya berlaku untuk recharts versi tertentu)
// - ReferenceLine x=...: garis vertikal di titik data tertentu
// - Komponen ini dipakai di Dashboard.jsx sebagai chart tren akademik
