import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Activity,
  Search,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { dashboardService, type PersonalDashboardResponse } from '@/apis/dashboardService'
import { useAuthStore } from '@/store/useAuthStore'

const formatMoney = (amount: number): string => {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M ₫`
  }
  return amount.toLocaleString('vi-VN') + ' ₫'
}

const formatFullMoney = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + ' ₫'
}

// Greeting helper based on time of day
const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Chào buổi sáng'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

// Loading skeleton component
function StatSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-200 rounded-xl" />
      </div>
      <div>
        <div className="h-7 w-20 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-28 bg-slate-100 rounded" />
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {[1, 2].map((i) => (
        <div key={i} className="p-6 animate-pulse flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
            <div className="h-3 w-1/2 bg-slate-100 rounded" />
          </div>
          <div className="w-24 h-8 bg-slate-200 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [data, setData] = useState<PersonalDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await dashboardService.getPersonalDashboard()
      setData(res.data.data)
    } catch (err: any) {
      console.error('Dashboard fetch error:', err)
      setError(err.response?.data?.message || 'Không thể tải dữ liệu dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const role = data?.role || user?.role || 'freelancer'
  const fullName = data?.fullName || user?.fullName || 'Bạn'

  // Build stats cards based on role & data
  const buildStats = () => {
    if (!data) return []

    if (role === 'contractor') {
      return [
        {
          title: 'Dự án đang mở',
          value: String(data.stats.openProjects ?? 0),
          icon: Briefcase,
          color: 'text-blue-600',
          bg: 'bg-blue-50'
        },
        {
          title: 'Hợp đồng đang chạy',
          value: String(data.stats.activeContracts),
          icon: Activity,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50'
        },
        {
          title: 'Tiền trong Escrow',
          value: formatMoney(data.stats.escrowAmount),
          icon: ShieldCheck,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50'
        },
        {
          title: 'Đã chi tiêu',
          value: formatMoney(data.stats.totalSpent ?? 0),
          icon: DollarSign,
          color: 'text-slate-600',
          bg: 'bg-slate-100'
        }
      ]
    } else {
      return [
        {
          title: 'Đang ứng tuyển',
          value: String(data.stats.applications ?? 0),
          icon: FileText,
          color: 'text-amber-600',
          bg: 'bg-amber-50'
        },
        {
          title: 'Hợp đồng đang làm',
          value: String(data.stats.activeContracts),
          icon: Clock,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50'
        },
        {
          title: 'Chờ giải ngân (Escrow)',
          value: formatMoney(data.stats.escrowAmount),
          icon: ShieldCheck,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50'
        },
        {
          title: 'Tổng thu nhập',
          value: formatMoney(data.stats.totalEarned ?? 0),
          icon: TrendingUp,
          color: 'text-slate-600',
          bg: 'bg-slate-100'
        }
      ]
    }
  }

  const stats = buildStats()

  // Build recent activity list items
  const buildActivityItems = () => {
    if (!data) return []

    if (role === 'contractor') {
      // Combine recentProjects and recentContracts
      const items: Array<{
        id: string
        title: string
        subtitle: string
        icon: typeof Briefcase
        iconBg: string
        iconColor: string
        actionLabel: string
        actionLink: string
        actionStyle: string
      }> = []

      data.recentProjects?.forEach((project: any) => {
        items.push({
          id: project._id,
          title: project.title || 'Dự án không có tiêu đề',
          subtitle: project.status === 'open' ? 'Đang mở - Chờ ứng viên nộp báo giá' : 'Đang thực hiện',
          icon: Users,
          iconBg: 'bg-indigo-50',
          iconColor: 'text-indigo-600',
          actionLabel: 'Xem chi tiết',
          actionLink: `/projects/${project._id}`,
          actionStyle: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
        })
      })

      data.recentContracts?.forEach((contract: any) => {
        const projectTitle = typeof contract.projectId === 'object' ? contract.projectId?.title : 'Hợp đồng'
        items.push({
          id: contract._id,
          title: projectTitle || 'Hợp đồng',
          subtitle:
            contract.status === 'pending_approval'
              ? 'Đang chờ nghiệm thu'
              : `Deadline: ${contract.deadline ? new Date(contract.deadline).toLocaleDateString('vi-VN') : 'Chưa xác định'}`,
          icon: CheckCircle2,
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          actionLabel: contract.status === 'pending_approval' ? 'Nghiệm thu' : 'Xem hợp đồng',
          actionLink: `/contracts/${contract._id}`,
          actionStyle:
            contract.status === 'pending_approval'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
        })
      })

      return items
    } else {
      // Freelancer: combine recentApplications and recentContracts
      const items: Array<{
        id: string
        title: string
        subtitle: string
        icon: typeof Briefcase
        iconBg: string
        iconColor: string
        actionLabel: string
        actionLink: string
        actionStyle: string
      }> = []

      data.recentApplications?.forEach((app: any) => {
        const projectTitle = typeof app.projectId === 'object' ? app.projectId?.title : 'Dự án'
        items.push({
          id: app._id,
          title: projectTitle || 'Đơn ứng tuyển',
          subtitle:
            app.status === 'pending_freelancer_agreement'
              ? 'Chờ bạn xác nhận hợp đồng'
              : 'Đang chờ phản hồi từ khách hàng',
          icon: FileText,
          iconBg: 'bg-amber-50',
          iconColor: 'text-amber-600',
          actionLabel: app.status === 'pending_freelancer_agreement' ? 'Xác nhận' : 'Xem chi tiết',
          actionLink: `/contracts/${app._id}`,
          actionStyle:
            app.status === 'pending_freelancer_agreement'
              ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
        })
      })

      data.recentContracts?.forEach((contract: any) => {
        const projectTitle = typeof contract.projectId === 'object' ? contract.projectId?.title : 'Hợp đồng'
        items.push({
          id: contract._id,
          title: projectTitle || 'Hợp đồng',
          subtitle: `Deadline: ${contract.deadline ? new Date(contract.deadline).toLocaleDateString('vi-VN') : 'Chưa xác định'}`,
          icon: Clock,
          iconBg: 'bg-indigo-50',
          iconColor: 'text-indigo-600',
          actionLabel: 'Xem hợp đồng',
          actionLink: `/contracts/${contract._id}`,
          actionStyle: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
        })
      })

      return items
    }
  }

  const activityItems = buildActivityItems()

  // ─── Error state ──────────────────────────────────────────────
  if (error && !loading) {
    return (
      <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-bold text-lg text-slate-900">Đã xảy ra lỗi</h2>
          <p className="text-sm text-slate-500 text-center max-w-md">{error}</p>
          <button
            onClick={fetchDashboard}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-slate-900 mb-1">
            {loading ? (
              <span className="inline-block h-7 w-72 bg-slate-200 rounded animate-pulse" />
            ) : (
              <>
                {getGreeting()}, {fullName}! 👋
              </>
            )}
          </h1>
          <p className="text-sm text-slate-500">
            {role === 'contractor'
              ? 'Cùng xem tiến độ các dự án bạn đang thuê nhé.'
              : 'Dưới đây là tổng quan công việc và thu nhập của bạn.'}
          </p>
        </div>

        {/* Nút Call To Action tùy theo Role */}
        {role === 'contractor' ? (
          <Link
            to="/post-project"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" /> Đăng dự án mới
          </Link>
        ) : (
          <Link
            to="/projects"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Tìm việc làm
          </Link>
        )}
      </div>

      {/* KHỐI THỐNG KÊ (4 Ô) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading
          ? [1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)
          : stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-2xl text-slate-900 mb-1">{stat.value}</h3>
                    <p className="text-sm font-bold text-slate-500">{stat.title}</p>
                  </div>
                </div>
              )
            })}
      </div>

      {/* KHU VỰC CHIA 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI: DANH SÁCH HOẠT ĐỘNG (Chiếm 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-900">
                {role === 'contractor' ? 'Dự án & Hợp đồng cần chú ý' : 'Đơn ứng tuyển & Hợp đồng'}
              </h2>
              <Link
                to={role === 'contractor' ? '/manage-projects' : '/contracts'}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <ListSkeleton />
            ) : activityItems.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-slate-500 mb-1">Chưa có hoạt động nào</p>
                <p className="text-xs text-slate-400">
                  {role === 'contractor'
                    ? 'Hãy bắt đầu bằng cách đăng dự án mới!'
                    : 'Hãy bắt đầu tìm việc và nộp ứng tuyển!'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activityItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 ${item.iconBg} ${item.iconColor} rounded-xl flex items-center justify-center shrink-0`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1 hover:text-indigo-600 cursor-pointer transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-sm text-slate-500">{item.subtitle}</p>
                        </div>
                      </div>
                      <Link
                        to={item.actionLink}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shrink-0 ${item.actionStyle}`}
                      >
                        {item.actionLabel}
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: WIDGETS BỔ TRỢ (Chiếm 1/3) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Box Việc làm đề xuất (Chỉ Freelancer mới thấy) */}
          {role === 'freelancer' && (
            <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-2xl p-6 text-white shadow-md">
              <h3 className="font-bold text-lg mb-2">Gợi ý việc làm cho bạn</h3>
              <p className="text-indigo-200 text-sm mb-6">Khám phá các dự án mới phù hợp với kỹ năng của bạn.</p>

              <Link
                to="/projects"
                className="block w-full py-2.5 bg-white text-indigo-700 text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-50 transition-colors text-center"
              >
                <Search className="w-4 h-4 inline-block mr-1 -mt-0.5" />
                Tìm kiếm dự án
              </Link>
            </div>
          )}

          {/* Box Nạp/Rút Tiền Nhanh */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" /> Thao tác tài chính
            </h3>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Số dư khả dụng</p>
                {loading ? (
                  <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
                ) : (
                  <p className="font-extrabold text-slate-900 text-xl">{formatFullMoney(data?.walletBalance ?? 0)}</p>
                )}
              </div>
            </div>
            <Link
              to="/wallet"
              className="block w-full text-center py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors text-sm"
            >
              Đi tới Ví Escrow
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" /> Thao tác nhanh
            </h3>
            <div className="space-y-2">
              {role === 'contractor' ? (
                <>
                  <Link
                    to="/post-project"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                      Đăng dự án mới
                    </span>
                  </Link>
                  <Link
                    to="/contracts"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                      Quản lý hợp đồng
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/projects"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <Search className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                      Tìm kiếm dự án
                    </span>
                  </Link>
                  <Link
                    to="/contracts"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                      Hợp đồng của tôi
                    </span>
                  </Link>
                </>
              )}
              <Link
                to="/messages"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  Tin nhắn
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
