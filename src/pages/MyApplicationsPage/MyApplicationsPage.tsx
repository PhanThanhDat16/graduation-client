import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Briefcase, Search, DollarSign, AlertCircle, TrendingUp, LayoutGrid } from 'lucide-react'

import { applicationService } from '@/apis/applicationService'
import { formatBudget } from '@/utils/fomatters'
import type { Application } from '@/types/application'

import ApplicationCard from './components/ApplicationCard'
import ApplicationModal from './components/ApplicationModal'
import StatusTabs from '@/components/StatusTabs/StatusTabs'
import SortDropdown from '@/components/SortDropDown/SortDropdown'
import { toast } from 'react-toastify'

const SORT_OPTIONS = [
  { label: 'Gửi gần đây', value: 'newest' },
  { label: 'Gửi lâu nhất', value: 'oldest' },
  { label: 'Giá trị cao', value: 'highestBudget' }
]

export default function MyApplicationsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest') // State sắp xếp
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  useEffect(() => {
    document.body.style.overflow = selectedApp ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedApp])

  const { data: axiosResponse, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationService.getMyApplications()
  })
  const applications: Application[] = axiosResponse?.data?.data || []
  const deleteMutation = useMutation({
    mutationFn: (id: string) => applicationService.deleteApplication(id),
    onMutate: (id) => {
      setDeletingId(id)
      setSelectedApp(null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] })
      toast.success('Đã rút báo giá thành công!')
    },
    onError: () => toast.error('Có lỗi xảy ra, không thể rút báo giá lúc này.'),
    onSettled: () => setDeletingId(null)
  })

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn rút hồ sơ báo giá này không?')) {
      deleteMutation.mutate(id)
    }
  }

  // Cấu hình Tabs truyền vào component
  const tabs = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: applications.length },
      { id: 'pending', label: 'Đang chờ', count: applications.filter((a) => a.status === 'pending').length },
      { id: 'accepted', label: 'Trúng thầu', count: applications.filter((a) => a.status === 'accepted').length },
      { id: 'rejected', label: 'Từ chối', count: applications.filter((a) => a.status === 'rejected').length }
    ],
    [applications]
  )

  // Lọc theo Tab
  const filteredApps = useMemo(
    () => (activeTab === 'all' ? applications : applications.filter((a) => a.status === activeTab)),
    [applications, activeTab]
  )

  // SẮP XẾP BẰNG FRONTEND
  const sortedApps = useMemo(() => {
    return [...filteredApps].sort((a, b) => {
      if (sortOrder === 'highestBudget') {
        return (b.proposedBudget || 0) - (a.proposedBudget || 0)
      }
      const dateA = new Date(a.appliedAt).getTime()
      const dateB = new Date(b.appliedAt).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })
  }, [filteredApps, sortOrder])

  // Thống kê
  const totalBudget = useMemo(() => applications.reduce((s, a) => s + (a.proposedBudget || 0), 0), [applications])
  const winRate =
    applications.length > 0
      ? Math.round((applications.filter((a) => a.status === 'accepted').length / applications.length) * 100)
      : 0

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Đang tải dữ liệu...</p>
        </div>
      )

    if (applications.length === 0)
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-slate-200 rounded-3xl shadow-sm mt-6">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-5">
            <Briefcase className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Chưa có báo giá nào</h2>
          <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
            Bạn chưa gửi đề xuất nào. Hãy tìm kiếm những dự án phù hợp ngay hôm nay!
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-sm"
          >
            <Search className="w-4 h-4" /> Khám phá dự án
          </Link>
        </div>
      )

    if (sortedApps.length === 0)
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm mt-6">
          <AlertCircle className="w-12 h-12 text-slate-200 mb-3" />
          <p className="text-slate-500 text-sm font-medium">Không có báo giá nào ở trạng thái này.</p>
        </div>
      )

    return (
      <div className="grid gap-5 mt-6">
        {/* Render danh sách đã sắp xếp */}
        {sortedApps.map((app) => (
          <ApplicationCard
            key={app._id}
            app={app}
            deletingId={deletingId}
            onDelete={handleDelete}
            onViewDetail={setSelectedApp}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-body pb-24 text-slate-800">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm rounded-b-2xl px-4 sm:px-6">
        <div className="max-w-7xl mx-auto pt-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">Báo giá của tôi</h1>
                <p className="text-sm font-medium text-slate-500 mt-1">Quản lý các đề xuất dự án bạn đã nộp.</p>
              </div>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-100 transition-colors shrink-0"
            >
              <Search className="w-4 h-4" /> Tìm việc mới
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <StatusTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <SortDropdown options={SORT_OPTIONS} value={sortOrder} onChange={setSortOrder} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6">
        {!isLoading && applications.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <LayoutGrid className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng báo giá</p>
                <p className="text-2xl font-extrabold text-slate-900 leading-none">{applications.length}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng giá trị</p>
                <p className="text-2xl font-extrabold text-emerald-600 leading-none">
                  {formatBudget(totalBudget)}
                  <span className="text-sm ml-1">₫</span>
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${winRate > 0 ? 'bg-blue-50' : 'bg-slate-100'}`}
              >
                <TrendingUp className={`w-5 h-5 ${winRate > 0 ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tỷ lệ trúng thầu</p>
                <p
                  className={`text-2xl font-extrabold leading-none ${winRate > 0 ? 'text-blue-600' : 'text-slate-900'}`}
                >
                  {winRate}%
                </p>
              </div>
            </div>
          </div>
        )}

        {renderContent()}
      </div>

      <ApplicationModal
        app={selectedApp}
        deletingId={deletingId}
        onClose={() => setSelectedApp(null)}
        onDelete={handleDelete}
      />
    </div>
  )
}
