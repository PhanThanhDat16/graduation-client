import { useNavigate } from 'react-router-dom'
import { Briefcase, ArrowLeft } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { projectService } from '@/apis/projectService'
import type { ProjectCreateParams } from '@/types/project'
import ProjectForm from '@/components/ProjectForm/ProjectForm'
import type { ProjectSchema } from '@/utils/rules'
import { toast } from 'react-toastify'

export default function PostProjectPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Móc API Create Project
  const createMutation = useMutation({
    mutationFn: (data: ProjectCreateParams) => projectService.createProject(data),
    onSuccess: () => {
      // Báo cho React Query biết data đã cũ, cần fetch lại ở trang Danh sách
      queryClient.invalidateQueries({ queryKey: ['my-projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })

      toast.success('Đăng dự án thành công!')
      navigate('/manage-projects')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi đăng dự án. Vui lòng thử lại!')
    }
  })

  // Hàm xử lý khi Form bấm Submit
  const handleCreateSubmit = (data: ProjectSchema) => {
    // Ép kiểu dữ liệu ngân sách từ string sang number trước khi gửi API
    const payload: ProjectCreateParams = {
      title: data.title,
      description: data.description,
      category: data.category,
      skills: data.skills,
      budgetMin: Number(data.budgetMin),
      budgetMax: Number(data.budgetMax),
      status: 'open' // Mặc định khi tạo là open
    }

    createMutation.mutate(payload)
  }

  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24 text-slate-800">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-200 py-4 sticky top-[64px] z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Khởi tạo công việc
              </p>
              <h1 className="font-heading font-extrabold text-xl text-slate-900 leading-none">Đăng dự án mới</h1>
            </div>
          </div>
          <div className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg hidden sm:block border border-slate-200">
            Bước 1 / 1
          </div>
        </div>
      </div>

      {/* ── NỘI DUNG ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-800 rounded-2xl p-6 text-white shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg mb-1">Mô tả rõ ràng, tìm người dễ dàng!</h2>
            <p className="text-indigo-100 text-sm">
              Các dự án có mô tả chi tiết và kỹ năng rõ ràng thường nhận được báo giá chất lượng hơn 70%.
            </p>
          </div>
          <Briefcase className="w-12 h-12 text-white/20 shrink-0 hidden sm:block" />
        </div>

        {/* Gọi Component Form */}
        <ProjectForm
          isSubmitting={createMutation.isPending}
          onSubmit={handleCreateSubmit}
          submitText="Đăng Dự Án Ngay"
        />
      </div>
    </div>
  )
}
