import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Briefcase, Users, AlertCircle } from 'lucide-react'

import { applicationService } from '@/apis/applicationService'
import type { Application } from '@/types/application'
import ContractorAppCard from './components/ContractorAppCard/ContractorAppCard'
import StatusTabs from '@/components/StatusTabs/StatusTabs'
import SortDropdown from '@/components/SortDropDown/SortDropdown'
import { toast } from 'react-toastify'

const SORT_OPTIONS = [
  { label: 'Nộp gần đây', value: 'newest' },
  { label: 'Nộp lâu nhất', value: 'oldest' },
  { label: 'Giá thấp đến cao', value: 'lowest_budget' },
  { label: 'Giá cao đến thấp', value: 'highest_budget' }
]

export default function ProjectApplicationsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { projectId } = useParams<{ projectId: string }>()

  const [activeTab, setActiveTab] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [processingId, setProcessingId] = useState<string | null>(null)

  // FETCH API
  const { data: axiosResponse, isLoading } = useQuery({
    queryKey: ['project-applications', projectId],
    queryFn: () => applicationService.getApplicationsByProject(projectId as string),
    enabled: !!projectId
  })

  const applications: Application[] = axiosResponse?.data?.data || []

  // MUTATION CẬP NHẬT TRẠNG THÁI
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'accepted' | 'rejected' }) => {
      applicationService.updateApplicationStatus(id, status)
    },
    onMutate: (variables) => setProcessingId(variables.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-applications', projectId] })
      toast.success(variables.status === 'accepted' ? 'Đã duyệt trúng thầu ứng viên!' : 'Đã từ chối ứng viên.')
    },
    onError: () => toast.error('Có lỗi xảy ra khi cập nhật trạng thái!'),
    onSettled: () => setProcessingId(null)
  })

  const handleUpdateStatus = (appId: string, status: 'accepted' | 'rejected') => {
    const actionName = status === 'accepted' ? 'CHẤP NHẬN' : 'TỪ CHỐI'
    if (window.confirm(`Bạn có chắc chắn muốn ${actionName} báo giá này không?`)) {
      statusMutation.mutate({ id: appId, status })
    }
  }

  // TẠO DATA CHO TABS
  const tabs = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: applications.length },
      { id: 'pending', label: 'Chưa xử lý', count: applications.filter((a) => a.status === 'pending').length },
      { id: 'accepted', label: 'Đã trúng thầu', count: applications.filter((a) => a.status === 'accepted').length },
      { id: 'rejected', label: 'Đã từ chối', count: applications.filter((a) => a.status === 'rejected').length }
    ],
    [applications]
  )

  // LỌC VÀ SẮP XẾP DỮ LIỆU
  const filteredApps = useMemo(() => {
    return activeTab === 'all' ? applications : applications.filter((app) => app.status === activeTab)
  }, [applications, activeTab])

  const sortedApps = useMemo(() => {
    return [...filteredApps].sort((a, b) => {
      if (sortOrder === 'lowest_budget') return (a.proposedBudget || 0) - (b.proposedBudget || 0)
      if (sortOrder === 'highest_budget') return (b.proposedBudget || 0) - (a.proposedBudget || 0)

      const dateA = new Date(a.appliedAt).getTime()
      const dateB = new Date(b.appliedAt).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })
  }, [filteredApps, sortOrder])

  // --- RENDER CONTENT ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-3xl border border-slate-200">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Đang tải danh sách ứng viên...</p>
        </div>
      )
    }

    if (applications.length === 0) {
      return (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Chưa có ứng viên nào</h2>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            Dự án của bạn hiện chưa có ai gửi báo giá. Hãy kiên nhẫn chờ thêm một chút nhé.
          </p>
        </div>
      )
    }

    if (sortedApps.length === 0) {
      return (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium text-lg">Không có ứng viên nào ở trạng thái này.</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-6">
        {sortedApps.map((app) => (
          <ContractorAppCard key={app._id} app={app} processingId={processingId} onUpdateStatus={handleUpdateStatus} />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24 text-slate-800">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <button
            onClick={() => navigate('/manage-projects')}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors w-fit mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách dự án
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-1.5">Xét duyệt ứng viên</p>
              <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-snug line-clamp-1">
                Danh sách báo giá đã nhận
              </h1>
            </div>
            <div className="bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 shrink-0 w-fit">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-bold text-slate-700">{applications.length} Báo giá</span>
            </div>
          </div>

          {/* DÙNG 2 COMPONENT DÙNG CHUNG Ở ĐÂY */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <StatusTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <SortDropdown options={SORT_OPTIONS} value={sortOrder} onChange={setSortOrder} />
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto mt-8">{renderContent()}</div>
    </div>
  )
}
