import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart, Loader2, ArrowLeft, BookmarkCheck } from 'lucide-react'
import { toast } from 'react-toastify'

import { projectService } from '@/apis/projectService'
import ProjectCard from '@/components/ProjectCard/ProjectCard'
import { useAuthStore } from '@/store/useAuthStore'
import SearchBar from '@/components/SearchBar/SearchBar' // Import component SearchBar dùng chung

export default function SavedProjectsPage() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const [searchTerm, setSearchTerm] = useState('')

  // 1. GỌI API & LỌC DỮ LIỆU
  const { data: axiosResponse, isLoading } = useQuery({
    queryKey: ['projects-for-saved'],
    queryFn: () => projectService.getProjects({ limit: 100 })
  })

  const allProjects = axiosResponse?.data?.data || []

  // Chỉ lấy dự án của mình & Lọc thêm bằng Local Search
  const savedProjects = allProjects.filter((project: any) => user?._id && project.listLike?.includes(user._id))

  const displayedProjects = savedProjects.filter(
    (project: any) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // 2. LOGIC TOGGLE LIKE
  const toggleLikeMutation = useMutation({
    mutationFn: (projectId: string) => projectService.toggleLikeProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-for-saved'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Đã cập nhật danh sách yêu thích.')
    },
    onError: () => toast.error('Không thể thực hiện thao tác này.')
  })

  const handleToggleLike = (projectId: string) => {
    toggleLikeMutation.mutate(projectId)
  }

  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24">
      {/* ── HERO BANNER (Giữ thiết kế Dashboard cá nhân) ── */}
      <div className="bg-slate-900 pt-10 pb-28 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-gradient-to-b from-indigo-500/20 to-transparent rotate-12 blur-3xl" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[100%] bg-gradient-to-b from-rose-500/10 to-transparent -rotate-12 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-bold text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Quay lại tìm dự án
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                <Heart size={32} className="fill-current" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  Dự án <span className="text-rose-400">đã lưu</span>
                </h1>
                <p className="text-slate-400 text-sm sm:text-base mt-1.5 font-medium max-w-md">
                  Bộ sưu tập các cơ hội việc làm tuyệt vời mà bạn không muốn bỏ lỡ.
                </p>
              </div>
            </div>

            {/* Khối Thống Kê nhanh */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10 w-fit">
              <BookmarkCheck className="text-emerald-400 w-5 h-5" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tổng cộng</p>
                <p className="text-lg font-black text-white leading-none">
                  {savedProjects.length} <span className="text-sm font-medium text-slate-300">dự án</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        {/* SỬ DỤNG COMPONENT SEARCH BAR CHUNG TẠI ĐÂY */}
        {savedProjects.length > 0 && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={() => {}} // Local search tự chạy nên không cần gọi API
              onClear={() => setSearchTerm('')}
              placeholder="Tìm nhanh dự án trong bộ sưu tập (theo tên, kỹ năng)..."
            />
          </div>
        )}

        {/* LISTING */}
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-24 flex flex-col items-center justify-center gap-4 mt-8">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="font-bold text-slate-400 animate-pulse text-sm">Đang tải bộ sưu tập của bạn...</p>
          </div>
        ) : savedProjects.length === 0 ? (
          /* TRẠNG THÁI TRỐNG (EMPTY STATE PREMIUM) */
          <div className="bg-white rounded-3xl border border-slate-100 p-12 sm:p-20 flex flex-col items-center text-center shadow-lg shadow-slate-200/40 relative overflow-hidden mt-8">
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            ></div>

            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-xl animate-pulse" />
              <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-full flex items-center justify-center mb-6 text-slate-300 relative z-10 shadow-sm">
                <Heart size={48} className="stroke-[1.5]" />
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-3 relative z-10">Bạn chưa lưu dự án nào</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed relative z-10">
              Hãy lướt qua danh sách các dự án mới nhất và nhấn vào biểu tượng trái tim để lưu lại những cơ hội phù hợp
              với bạn nhé.
            </p>
            <Link
              to="/projects"
              className="relative z-10 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors shadow-md hover:shadow-indigo-200"
            >
              Khám phá dự án ngay
            </Link>
          </div>
        ) : displayedProjects.length === 0 ? (
          /* TRẠNG THÁI KHÔNG TÌM THẤY KHI SEARCH LỌC */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-bold mb-2">Không tìm thấy kết quả nào khớp với "{searchTerm}"</p>
            <button onClick={() => setSearchTerm('')} className="text-indigo-600 font-bold text-sm hover:underline">
              Xóa tìm kiếm
            </button>
          </div>
        ) : (
          /* DANH SÁCH DỰ ÁN */
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {displayedProjects.map((project: any) => (
              <ProjectCard key={project._id} project={project} onToggleLike={handleToggleLike} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
