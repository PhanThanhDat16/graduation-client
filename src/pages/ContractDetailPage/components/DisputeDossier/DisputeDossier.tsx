import { Scale } from 'lucide-react'

interface DisputeDossierProps {
  currentDispute: any
}

export default function DisputeDossier({ currentDispute }: DisputeDossierProps) {
  if (!currentDispute) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8 mt-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
        {/* Header */}
        <div className="bg-red-50/50 border-b border-red-100 px-6 py-4 flex items-center justify-between">
          <h3 className="font-black text-red-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-red-600" />
            Hồ Sơ Tranh Chấp
          </h3>
          <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full uppercase tracking-wider">
            {currentDispute.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Nội dung 2 bên */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Lời khai của KHÁCH HÀNG (Bên A) */}
          <div className="p-6">
            <h4 className="text-sm font-bold text-slate-900 uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Lời khai của Khách Hàng
            </h4>
            {currentDispute.contractorReason ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Lý do / Bằng chứng
                  </p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl leading-relaxed whitespace-pre-line border border-slate-100">
                    {currentDispute.contractorReason}
                  </p>
                </div>
                {currentDispute.contractorRequestedResolution && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Mong muốn giải quyết
                    </p>
                    <p className="text-sm font-medium text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      {currentDispute.contractorRequestedResolution}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-sm text-slate-400 font-medium italic">
                Chưa cập nhật lời khai...
              </div>
            )}
          </div>

          {/* Lời khai của FREELANCER (Bên B) */}
          <div className="p-6">
            <h4 className="text-sm font-bold text-slate-900 uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Lời khai của Freelancer
            </h4>
            {currentDispute.freelancerReason ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Lý do / Bằng chứng
                  </p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl leading-relaxed whitespace-pre-line border border-slate-100">
                    {currentDispute.freelancerReason}
                  </p>
                </div>
                {currentDispute.freelancerRequestedResolution && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Mong muốn giải quyết
                    </p>
                    <p className="text-sm font-medium text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      {currentDispute.freelancerRequestedResolution}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-sm text-slate-400 font-medium italic">
                Chưa cập nhật lời khai...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
