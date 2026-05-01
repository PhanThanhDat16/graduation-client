import { Link, useNavigate } from 'react-router-dom'
import { Clock, DollarSign, Edit, Trash2, FileText, Image as ImageIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { formatBudget } from '@/utils/fomatters'
import { projectService } from '@/apis/projectService'

const getProjectStatusUI = (status: string) => {
  switch (status) {
    case 'open':
      return {
        label: 'Đang tuyển',
        color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
        bar: 'bg-indigo-500'
      } // Màu chủ đạo của app
    case 'progress':
      return {
        label: 'Đang thực hiện',
        color: 'bg-amber-50 text-amber-600 border-amber-200',
        bar: 'bg-amber-400'
      } // Màu Cam/Vàng nổi bật báo hiệu đang làm
    case 'closed':
      return {
        label: 'Đã đóng',
        color: 'bg-slate-50 text-slate-500 border-slate-200',
        bar: 'bg-slate-300'
      } // Màu Xám tĩnh lặng
    default:
      return {
        label: 'Bản nháp',
        color: 'bg-slate-100 text-slate-400 border-slate-200',
        bar: 'bg-slate-200'
      }
  }
}

interface ManageProjectCardProps {
  project: any
}

export default function ManageProjectCard({ project }: ManageProjectCardProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const statusUI = getProjectStatusUI(project.status)

  const firstImage = project.images && project.images.length > 0 ? project.images[0] : null
  const extraImagesCount = project.images ? project.images.length - 1 : 0

  const closeMutation = useMutation({
    // Gọi API update, truyền status: 'closed'
    mutationFn: () => projectService.updateProject(project._id, { status: 'closed' }),
    onSuccess: () => {
      // Báo cho React Query tải lại danh sách dự án
      queryClient.invalidateQueries({ queryKey: ['my-projects'] })
      toast.success('Đã đóng dự án thành công!')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi đóng dự án. Vui lòng thử lại!')
    }
  })

  // Hàm kích hoạt khi bấm nút Đóng
  const handleCloseProject = () => {
    if (window.confirm('Bạn có chắc chắn muốn đóng dự án này? Người khác sẽ không thể gửi báo giá nữa.')) {
      closeMutation.mutate()
    }
  }

  return (
    <div
      className={`bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col sm:flex-row group ${
        project.status === 'closed'
          ? 'border-slate-200 opacity-75 grayscale-[20%]'
          : 'border-slate-200/80 hover:border-indigo-200'
      }`}
    >
      {/* Vạch màu trạng thái bên trái */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 z-10 ${statusUI.bar}`} />

      {/* ── BÊN TRÁI: KHUNG ẢNH ── */}
      {firstImage && (
        <div className="relative w-full sm:w-48 shrink-0 h-40 sm:h-auto border-b sm:border-b-0 sm:border-r border-slate-100 overflow-hidden bg-slate-50">
          <img
            src={firstImage}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60"></div>

          {extraImagesCount > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md flex items-center gap-1 text-white px-2 py-0.5 rounded-lg border border-white/10 shadow-sm">
              <ImageIcon size={12} className="opacity-80" />
              <span className="text-[10px] font-bold">+{extraImagesCount}</span>
            </div>
          )}
        </div>
      )}

      {/* ── BÊN PHẢI: NỘI DUNG & HÀNH ĐỘNG ── */}
      <div className="flex-1 flex flex-col p-5 pl-7">
        <div className="flex-1 min-w-0 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border shadow-sm ${statusUI.color}`}
            >
              {statusUI.label}
            </span>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Đăng ngày {new Date(project.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          <Link to={`/projects/${project._id}`} className="block mb-3">
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
              {project.title}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-700">
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

        {/* CỘT HÀNH ĐỘNG (FOOTER) */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
          <div className="flex gap-2 w-full sm:w-auto">
            {/* Ẩn nút Sửa và Đóng nếu dự án đã Đóng */}
            {project.status !== 'closed' && (
              <>
                <button
                  onClick={() => navigate(`/edit-project/${project._id}`)}
                  className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit className="w-4 h-4" /> Sửa
                </button>

                <button
                  onClick={handleCloseProject}
                  disabled={closeMutation.isPending}
                  className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {closeMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {closeMutation.isPending ? 'Đang đóng...' : 'Đóng'}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => navigate(`/manage-projects/${project._id}`)}
            className={`w-full sm:w-auto px-6 py-2.5 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
              project.status === 'closed'
                ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            Xem báo giá
          </button>
        </div>
      </div>
    </div>
  )
}
