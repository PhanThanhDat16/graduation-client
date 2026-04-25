import { Link, useNavigate } from 'react-router-dom'
import { Clock, DollarSign, Users, Edit, Trash2, FileText } from 'lucide-react'
import { formatBudget } from '@/utils/fomatters'

// Hàm cấu hình màu sắc trạng thái
const getProjectStatusUI = (status: string) => {
  switch (status) {
    case 'open':
      return { label: 'Đang tuyển', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' }
    case 'progress':
      return { label: 'Đang thực hiện', color: 'bg-blue-50 text-blue-700 border-blue-200', bar: 'bg-blue-500' }
    case 'closed':
      return { label: 'Đã đóng', color: 'bg-slate-100 text-slate-600 border-slate-200', bar: 'bg-slate-400' }
    default:
      return { label: 'Bản nháp', color: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-400' }
  }
}

interface ManageProjectCardProps {
  project: any
}

export default function ManageProjectCard({ project }: ManageProjectCardProps) {
  const navigate = useNavigate()
  const statusUI = getProjectStatusUI(project.status)

  // Mock số liệu nếu API chưa trả về
  const proposalCount = project.applicationCount || 0
  const hiredCount = project.contractId ? 1 : 0

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
      {/* Vạch màu trạng thái bên trái */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusUI.bar}`} />

      <div className="p-6 pl-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* CỘT 1: THÔNG TIN DỰ ÁN */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${statusUI.color}`}
              >
                {statusUI.label}
              </span>
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Đăng ngày {new Date(project.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>

            <Link to={`/projects/${project._id}`} className="block mb-3">
              <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                {project.title}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-700">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                {formatBudget(project.budgetMin)} - {formatBudget(project.budgetMax)} ₫
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <FileText className="w-4 h-4 text-indigo-500" />
                {project.category}
              </div>
            </div>
          </div>

          {/* CỘT 2: THỐNG KÊ (Đã thu gọn lại tinh tế hơn) */}
          <div className="shrink-0 flex gap-4 items-center lg:border-l border-slate-100 lg:pl-6 py-2">
            <div className="text-center px-2">
              <p className="text-2xl font-black text-indigo-600 leading-none mb-1">{proposalCount}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Báo giá</p>
            </div>
            <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
            <div className="text-center px-2">
              <p className="text-2xl font-black text-slate-700 leading-none mb-1">{hiredCount}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đã thuê</p>
            </div>
          </div>
        </div>

        {/* CỘT 3: HÀNH ĐỘNG (FOOTER) */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex gap-2 w-full sm:w-auto">
            {/* NÚT SỬA SẼ DẪN ĐẾN TRANG POST-PROJECT (Kèm ID để biết là đang sửa) */}
            <button
              onClick={() => navigate(`/edit-project/${project._id}`)}
              className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit className="w-4 h-4" /> Sửa
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-1.5">
              <Trash2 className="w-4 h-4" /> Đóng dự án
            </button>
          </div>

          <button
            onClick={() => navigate(`/manage-projects/${project._id}/applications`)}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" /> Xem báo giá
          </button>
        </div>
      </div>
    </div>
  )
}
