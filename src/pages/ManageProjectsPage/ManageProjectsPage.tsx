import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Briefcase, AlertCircle } from 'lucide-react'
import { projectService } from '@/apis/projectService'
import ManageProjectCard from './components/ManageProjectCard/ManageProjectCard'
import StatusTabs from '@/components/StatusTabs/StatusTabs'
import SortDropdown from '@/components/SortDropdown/SortDropdown'

// Tuỳ chọn sắp xếp cho Contractor
const SORT_OPTIONS = [
  { label: 'Đăng gần đây', value: 'newest' },
  { label: 'Đăng lâu nhất', value: 'oldest' }
]

export default function ManageProjectsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  const { data: axiosResponse, isLoading } = useQuery({
    queryKey: ['my-projects'],
    queryFn: () => projectService.getMyProjects()
  })

  const projects: any[] = axiosResponse?.data?.data || []

  const tabs = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: projects.length },
      { id: 'open', label: 'Đang tuyển', count: projects.filter((p) => p.status === 'open').length },
      { id: 'progress', label: 'Đang thực hiện', count: projects.filter((p) => p.status === 'progress').length },
      { id: 'closed', label: 'Đã đóng', count: projects.filter((p) => p.status === 'closed').length }
    ],
    [projects]
  )

  // 3. LỌC VÀ SẮP XẾP DỮ LIỆU
  const filteredProjects = useMemo(() => {
    return activeTab === 'all' ? projects : projects.filter((p) => p.status === activeTab)
  }, [projects, activeTab])

  const sortedProjects = useMemo(() => {
    // Copy mảng trước khi sort để không làm mutate data của React Query
    return [...filteredProjects].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })
  }, [filteredProjects, sortOrder])

  // RENDER DANH SÁCH DỰ ÁN
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-3xl border border-slate-200">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Đang tải dự án của bạn...</p>
        </div>
      )
    }

    // Trường hợp chưa đăng dự án nào bao giờ
    if (projects.length === 0) {
      return (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <Briefcase className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Chưa có dự án nào</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Bạn chưa đăng tải dự án nào lên hệ thống. Hãy bắt đầu tìm kiếm nhân tài ngay!
          </p>
          <Link
            to="/post-project"
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors inline-block"
          >
            Đăng dự án đầu tiên
          </Link>
        </div>
      )
    }

    // Trường hợp filter Tab nhưng không có kết quả
    if (sortedProjects.length === 0) {
      return (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-lg">Không có dự án nào ở trạng thái này.</p>
        </div>
      )
    }

    // Render danh sách chuẩn
    return (
      <div className="space-y-5">
        {sortedProjects.map((project) => (
          <ManageProjectCard key={project._id} project={project} />
        ))}
      </div>
    )
  }

  // --- BỐ CỤC CHÍNH ---
  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24 flex flex-col md:flex-row w-full text-slate-800">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-extrabold text-3xl text-slate-900 mb-1.5 tracking-tight">Dự án của tôi</h1>
            <p className="text-sm font-medium text-slate-500">Quản lý tiến độ và xét duyệt ứng viên.</p>
          </div>
          <Link
            to="/post-project"
            className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all active:scale-95 shrink-0"
          >
            + Đăng dự án mới
          </Link>
        </div>

        {/* TOOLBAR: GỒM TABS LỌC VÀ DROPDOWN SẮP XẾP */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <StatusTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="shrink-0">
            <SortDropdown options={SORT_OPTIONS} value={sortOrder} onChange={setSortOrder} />
          </div>
        </div>

        {/* CONTENT */}
        {renderContent()}
      </main>
    </div>
  )
}
