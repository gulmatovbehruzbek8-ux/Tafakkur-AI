import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import Link from "next/link";

export default function PrincipalDashboard() {
  const globalMetrics = [
    { label: "Jami Talabalar", value: "1,420", change: "+12% o'sish" },
    { label: "O'qituvchilar", value: "84", change: "To'liq shtat" },
    { label: "Faol Guruhlar", value: "56", change: "4 ta fakultet" },
    { label: "O'rtacha Davomat", value: "92.4%", change: "Barqaror" },
    { label: "Universitet GPA", value: "4.12", change: "+0.15 ball" }
  ];

  const activeClasses = [
    { id: 1, name: "Algoritmlar nazariyasi (Ma'ruza)", group: "AI-22", teacher: "O. Turdiyev", progress: 85, attendance: "24/25", status: "Yaxshi" },
    { id: 2, name: "Ma'lumotlar tuzilmasi", group: "SE-21", teacher: "A. Qosimov", progress: 60, attendance: "18/20", status: "Diqqat talab" },
    { id: 3, name: "Sun'iy intellekt asoslari", group: "AI-23", teacher: "N. Karimova", progress: 92, attendance: "25/25", status: "A'lo" },
    { id: 4, name: "Dasturlash asoslari", group: "CS-11", teacher: "M. Aliyev", progress: 45, attendance: "28/30", status: "O'rtacha" },
  ];

  return (
    <div className="tf-page">
      <Sidebar role="admin" activeRoute="/admin" />
      <TafakkurCompanion currentContext="Rektorat Boshqaruv Markazi" />
      
      <main className="tf-main pb-20">
        <div className="tf-container-wide space-y-8">
          
          <header className="tf-header animate-fade-up">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>HEMIS SYNC ● Real-Time Connected</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">Urganch Davlat Universiteti</span>
              </div>
              <h1 className="tf-title">Universitet Ekotizimi Salomatligi</h1>
              <p className="tf-subtitle">Barcha fakultetlar, talabalar faolligi, professorlar yuki va akademik tendensiyalar</p>
            </div>
            <span className="tf-badge tf-badge-success">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Barcha Tizimlar Barqaror
            </span>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-up delay-1">
            {globalMetrics.map((metric) => (
              <div key={metric.label} className="tf-metric">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                <div className="mt-3">
                  <span className="text-2xl md:text-3xl font-bold text-ink font-mono tracking-tight">{metric.value}</span>
                  <p className="text-[11px] font-semibold text-teal-700 mt-1">{metric.change}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="tf-card-solid overflow-hidden animate-fade-up delay-2">
            <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-bold text-ink tracking-tight">Guruhlar va Dars O&apos;zlashtirish (SOW)</h2>
                <p className="text-xs text-slate-400 mt-0.5">Semestr rejasi va darslarga qatnashish tahlili</p>
              </div>
              <Link href="/admin/users" className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors self-start sm:self-auto">
                Foydalanuvchilarni ko&apos;rish →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse tf-table">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="p-4 pl-6">Fan va Guruh</th>
                    <th className="p-4">Biriktirilgan O&apos;qituvchi</th>
                    <th className="p-4">Davomat</th>
                    <th className="p-4">SOW O&apos;zlashtirish</th>
                    <th className="p-4 pr-6 text-right">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {activeClasses.map(cls => (
                    <tr key={cls.id} className="hover:bg-teal-50/30 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-semibold text-ink">{cls.name}</div>
                        <div className="text-xs font-mono font-medium text-teal-700 mt-0.5">{cls.group} guruhi</div>
                      </td>
                      <td className="p-4 text-slate-700 font-medium">{cls.teacher}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200/60 font-mono text-xs font-semibold text-slate-700">
                          {cls.attendance}
                        </span>
                      </td>
                      <td className="p-4 w-1/3">
                        <div className="flex items-center gap-3">
                          <div className="tf-progress flex-1">
                            <span style={{ width: `${cls.progress}%`, background: cls.progress >= 85 ? 'linear-gradient(90deg,#059669,#10b981)' : cls.progress >= 60 ? 'linear-gradient(90deg,#0f766e,#14b8a6)' : 'linear-gradient(90deg,#e11d48,#fb7185)' }} />
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-700 w-10 text-right">{cls.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`tf-badge ${
                          cls.status === "A'lo" ? 'tf-badge-success' :
                          cls.status === 'Diqqat talab' ? 'tf-badge-danger' :
                          'tf-badge-teal'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            cls.status === "A'lo" ? 'bg-emerald-500' :
                            cls.status === 'Diqqat talab' ? 'bg-rose-500' : 'bg-teal-500'
                          }`} />
                          {cls.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
