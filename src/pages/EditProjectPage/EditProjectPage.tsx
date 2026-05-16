import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, AlertTriangle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { projectService } from '@/apis/projectService'
import type { ProjectCreateParams } from '@/types/project'
import ProjectForm from '@/components/ProjectForm/ProjectForm'
import type { ProjectSchema } from '@/utils/rules'
import { useState } from 'react'

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // GỌI API LẤY CHI TIẾT DỰ ÁN CŨ
  const {
    data: axiosResponse,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProjectById(id as string),
    enabled: !!id
  })

  const oldProjectData = axiosResponse?.data?.data

  // TẠO DATA CŨ ĐỂ ĐỔ VÀO FORM (Bao gồm cả mảng images)
  const initialFormData: any = oldProjectData
    ? {
        title: oldProjectData.title,
        description: oldProjectData.description,
        category: oldProjectData.category,
        skills: oldProjectData.skills,
        budgetMin: String(oldProjectData.budgetMin),
        budgetMax: String(oldProjectData.budgetMax),
        images: oldProjectData.images || [] // Truyền ảnh cũ vào đây
      }
    : undefined
  const [isUploading, setIsUploading] = useState(false)
  // MÓC API UPDATE PROJECT
  const updateMutation = useMutation({
    mutationFn: (data: Partial<ProjectCreateParams>) => projectService.updateProject(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      queryClient.invalidateQueries({ queryKey: ['my-projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })

      toast.success('Cập nhật dự án thành công!')
      navigate('/manage-projects')
    },
    onError: (error: any) => {
      console.log(error)
      toast.error('Có lỗi xảy ra khi cập nhật. Vui lòng thử lại!')
    }
  })

  // HÀM XỬ LÝ KHI FORM BẤM SUBMIT
  const handleUpdateSubmit = async (data: ProjectSchema, newFiles: File[], remainingExistingImages: string[]) => {
    try {
      let newlyUploadedUrls: string[] = []

      // BƯỚC 1: NẾU CÓ ẢNH MỚI -> GỌI API UPLOAD
      if (newFiles.length > 0) {
        setIsUploading(true)
        const uploadRes = await projectService.uploadImages(newFiles)
        console.log(uploadRes)
        newlyUploadedUrls = uploadRes.data.data.images || []
      }

      // BƯỚC 2: GỘP ẢNH CŨ VÀ MỚI
      const finalImagesArray = [...remainingExistingImages, ...newlyUploadedUrls]

      // BƯỚC 3: GỬI API CẬP NHẬT
      const payload: Partial<ProjectCreateParams> = {
        title: data.title,
        description: data.description,
        category: data.category,
        skills: data.skills,
        budgetMin: Number(data.budgetMin),
        budgetMax: Number(data.budgetMax),
        status: oldProjectData?.status,
        images: finalImagesArray
      }

      updateMutation.mutate(payload)
    } catch (error) {
      console.error('lỗinef', error)
      toast.error('Lỗi khi tải ảnh lên server! Vui lòng thử lại sau.')
    } finally {
      setIsUploading(false)
    }
  }

  // --- RENDER PHẦN UI ---
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
              <h1 className="font-extrabold text-xl text-slate-900 leading-none">Cập nhật thông tin dự án</h1>
            </div>
          </div>
          <div className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg hidden sm:block border border-slate-200">
            {isLoading ? 'Đang tải...' : 'Bước 1 / 1'}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-800 rounded-2xl p-6 text-white shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg mb-1">Cập nhật để tối ưu hóa!</h2>
            <p className="text-indigo-100 text-sm">
              Bạn có thể thay đổi, xóa ảnh cũ hoặc thêm ảnh mới để mô tả chi tiết hơn.
            </p>
          </div>
          <Briefcase className="w-12 h-12 text-white/20 shrink-0 hidden sm:block" />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Đang tải dữ liệu dự án cũ...</p>
          </div>
        ) : (
          <ProjectForm
            key={id}
            initialData={initialFormData}
            isSubmitting={updateMutation.isPending || isUploading} // Khóa nút khi đang xử lý
            onSubmit={handleUpdateSubmit}
            submitText="Cập nhật dự án"
          />
        )}
      </div>
    </div>
  )
}
