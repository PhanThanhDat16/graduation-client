import { useState } from 'react'
import { Briefcase, Loader2Icon, ArrowDown, ArrowUp } from 'lucide-react'
import type { Project } from '@/types/project'

// Import ProjectCard của bạn (Sửa lại đường dẫn nếu cần)
import ProjectCard from '@/components/ProjectCard'

interface ProfileProjectsProps {
  projects: Project[]
  loading: boolean
}

export default function ProfileProjects({ projects, loading }: ProfileProjectsProps) {
  const [showAll, setShowAll] = useState(false)

  // Chỉ lấy 3 dự án đầu tiên nếu chưa bấm "Xem tất cả"
  const displayProjects = showAll ? projects : projects.slice(0, 3)

  // Hàm xử lý Like (Bạn có thể nối vào projectService sau)
  const handleToggleLike = (projectId: string) => {
    console.log('Toggled like for project:', projectId)
    // Tương lai: Gọi API projectService.toggleLikeProject(projectId) ở đây
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
      {/* Header của thẻ */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-500" /> Dự án đã đăng
        </h2>
        <span className="bg-indigo-50 text-indigo-600 font-bold text-xs px-2.5 py-1 rounded-full border border-indigo-100">
          {projects.length}
        </span>
      </div>

      {/* Danh sách Dự án (1 Cột) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
          <Loader2Icon className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="text-sm font-medium">Đang tải dự án...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-500 font-medium">Người dùng này chưa có dự án nào.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {displayProjects.map((proj) => (
            <ProjectCard key={proj._id} project={proj} onToggleLike={handleToggleLike} />
          ))}
        </div>
      )}

      {/* Nút Xem Tất Cả / Thu Gọn */}
      {projects.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-6 py-3 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:border-indigo-100 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
        >
          {showAll ? (
            <>
              Thu gọn danh sách <ArrowUp size={16} />
            </>
          ) : (
            <>
              Xem tất cả {projects.length} dự án <ArrowDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  )
}
