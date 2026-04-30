import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, AlertTriangle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { projectService } from '@/apis/projectService'
import type { ProjectCreateParams } from '@/types/project'
import ProjectForm from '@/components/ProjectForm/ProjectForm'
import { toast } from 'react-toastify'
import type { ProjectSchema } from '@/utils/rules'

export default function EditProjectPage() {
  // 1. Lấy ID dự án từ URL (ví dụ: /edit-project/60a7b...)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 2. GỌI API LẤY CHI TIẾT DỰ ÁN CŨ
  const {
    data: axiosResponse,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProjectById(id as string),
    // Chỉ gọi API khi có id hợp lệ
    enabled: !!id
  })

  // Dữ liệu dự án cũ từ API
  const oldProjectData = axiosResponse?.data?.data

  // 3. CHUYỂN ĐỔI DỮ LIỆU CŨ SANG ĐỊNH DẠNG CỦA FORM
  // (camelCase và ép kiểu số)
  const initialFormData: ProjectSchema | undefined = oldProjectData
    ? {
        title: oldProjectData.title,
        description: oldProjectData.description,
        category: oldProjectData.category,
        skills: oldProjectData.skills,
        // Ép kiểu number -> string để hiển thị trên input form
        budgetMin: String(oldProjectData.budgetMin),
        budgetMax: String(oldProjectData.budgetMax)
      }
    : undefined

  // 4. MÓC API UPDATE PROJECT (useMutation)
  const updateMutation = useMutation({
    mutationFn: (data: Partial<ProjectCreateParams>) => projectService.updateProject(id as string, data),
    onSuccess: () => {
      // Làm mới dữ liệu ở các trang liên quan
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      queryClient.invalidateQueries({ queryKey: ['my-projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })

      toast.success('Cập nhật dự án thành công!')
      // Cập nhật xong thì quay về trang quản lý
      navigate('/manage-projects')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!')
    }
  })

  // 5. HÀM XỬ LÝ KHI FORM BẤM SUBMIT (handleUpdate)
  const handleUpdateSubmit = (data: ProjectSchema) => {
    // Ép kiểu dữ liệu ngân sách từ string sang number trước khi gửi API
    const payload: Partial<ProjectCreateParams> = {
      title: data.title,
      description: data.description,
      category: data.category,
      skills: data.skills,
      budgetMin: Number(data.budgetMin),
      budgetMax: Number(data.budgetMax),
      // Giữ nguyên status cũ hoặc logic của bạn
      status: oldProjectData?.status
    }

    updateMutation.mutate(payload)
  }

  // --- RENDER PHẦN UI ---

  // Xử lý trạng thái lỗi
  if (isError) {
    return (
      <div className="bg-slate-50 min-h-screen pt-20 px-4">
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-lg">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="font-extrabold text-2xl text-slate-900 mb-2">Không tìm thấy dự án!</h2>
          <p className="text-slate-600 mb-8">
            Dự án bạn đang cố chỉnh sửa không tồn tại hoặc bạn không có quyền truy cập.
          </p>
          <button
            onClick={() => navigate('/manage-projects')}
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Quay về trang quản lý
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24 text-slate-800">
      {/* ── HEADER (Y hệt trang đăng) ── */}
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
                Chỉnh sửa công việc
              </p>
              <h1 className="font-heading font-extrabold text-xl text-slate-900 leading-none">
                Cập nhật thông tin dự án
              </h1>
            </div>
          </div>
          <div className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg hidden sm:block border border-slate-200">
            {isLoading ? 'Đang tải...' : 'Bước 1 / 1'}
          </div>
        </div>
      </div>

      {/* ── NỘI DUNG ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-800 rounded-2xl p-6 text-white shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg mb-1">Cập nhật để tối ưu hóa!</h2>
            <p className="text-indigo-100 text-sm">
              Bạn có thể điều chỉnh mô tả hoặc ngân sách để thu hút thêm nhiều freelancer phù hợp hơn.
            </p>
          </div>
          <Briefcase className="w-12 h-12 text-white/20 shrink-0 hidden sm:block" />
        </div>

        {/* GỌI COMPONENT FORM (Với data cũ) */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Đang tải dữ liệu dự án cũ...</p>
          </div>
        ) : (
          <ProjectForm
            // ĐIỂM CHỐT LÀ ĐÂY: Gắn key để form render lại khi có data mới
            key={id}
            initialData={initialFormData}
            isSubmitting={updateMutation.isPending}
            onSubmit={handleUpdateSubmit}
            submitText="Cập nhật dự án" // Đổi text nút bấm
          />
        )}
      </div>
    </div>
  )
}
