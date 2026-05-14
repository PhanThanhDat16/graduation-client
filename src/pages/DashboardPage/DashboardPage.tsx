import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Activity,
  Search,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ChevronRight
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

const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Chào buổi sáng'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

function StatSkeleton() {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
      </div>
      <div>
        <div className="h-8 w-24 bg-slate-200 rounded-lg mb-3" />
        <div className="h-4 w-32 bg-slate-100 rounded-md" />
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="divide-y divide-slate-50/50">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 animate-pulse flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-2/3 bg-slate-200 rounded-md" />
            <div className="h-4 w-1/3 bg-slate-100 rounded-md" />
          </div>
          <div className="w-28 h-10 bg-slate-100 rounded-xl shrink-0" />
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

  const buildStats = () => {
    if (!data) return []

    if (role === 'contractor') {
      return [
        {
          title: 'Dự án đang mở',
          value: String(data.stats.openProjects ?? 0),
          icon: Briefcase,
          color: 'text-blue-600',
          bg: 'bg-blue-50/80',
          shadow: 'shadow-blue-100/50'
        },
        {
          title: 'Hợp đồng đang chạy',
          value: String(data.stats.activeContracts),
          icon: Activity,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50/80',
          shadow: 'shadow-indigo-100/50'
        },
        {
          title: 'Tiền trong Escrow',
          value: formatMoney(data.stats.escrowAmount),
          icon: ShieldCheck,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50/80',
          shadow: 'shadow-emerald-100/50'
        },
        {
          title: 'Đã chi tiêu',
          value: formatMoney(data.stats.totalSpent ?? 0),
          icon: DollarSign,
          color: 'text-slate-600',
          bg: 'bg-slate-100/80',
          shadow: 'shadow-slate-200/50'
        }
      ]
    } else {
      return [
        {
          title: 'Đang ứng tuyển',
          value: String(data.stats.applications ?? 0),
          icon: FileText,
          color: 'text-amber-600',
          bg: 'bg-amber-50/80',
          shadow: 'shadow-amber-100/50'
        },
        {
          title: 'Hợp đồng đang làm',
          value: String(data.stats.activeContracts),
          icon: Clock,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50/80',
          shadow: 'shadow-indigo-100/50'
        },
        {
          title: 'Chờ giải ngân (Escrow)',
          value: formatMoney(data.stats.escrowAmount),
          icon: ShieldCheck,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50/80',
          shadow: 'shadow-emerald-100/50'
        },
        {
          title: 'Tổng thu nhập',
          value: formatMoney(data.stats.totalEarned ?? 0),
          icon: TrendingUp,
          color: 'text-slate-600',
          bg: 'bg-slate-100/80',
          shadow: 'shadow-slate-200/50'
        }
      ]
    }
  }

  const stats = buildStats()

  const buildActivityItems = () => {
    if (!data) return []
    // Đã thay đổi actionStyle để nút trông hiện đại và mềm mại hơn
    const baseActionStyle =
      'px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 shadow-sm shrink-0 flex items-center gap-1.5'

    if (role === 'contractor') {
      const items: any[] = []
      data.recentProjects?.forEach((project: any) => {
        items.push({
          id: project._id,
          title: project.title || 'Dự án không có tiêu đề',
          subtitle: project.status === 'open' ? 'Đang mở - Chờ báo giá' : 'Đang thực hiện',
          icon: Users,
          iconBg: 'bg-indigo-50',
          iconColor: 'text-indigo-600',
          actionLabel: 'Xem chi tiết',
          actionLink: `/projects/${project._id}`,
          actionStyle: `${baseActionStyle} bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200`
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
          actionLabel: contract.status === 'pending_approval' ? 'Nghiệm thu ngay' : 'Xem hợp đồng',
          actionLink: `/contracts/${contract._id}`,
          actionStyle:
            contract.status === 'pending_approval'
              ? `${baseActionStyle} bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-emerald-200`
              : `${baseActionStyle} bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600`
        })
      })
      return items
    } else {
      const items: any[] = []
      data.recentApplications?.forEach((app: any) => {
        const projectTitle = typeof app.projectId === 'object' ? app.projectId?.title : 'Dự án'
        items.push({
          id: app._id,
          title: projectTitle || 'Đơn ứng tuyển',
          subtitle: app.status === 'pending_freelancer_agreement' ? 'Cần xác nhận hợp đồng' : 'Đang chờ phản hồi',
          icon: FileText,
          iconBg: 'bg-amber-50',
          iconColor: 'text-amber-500',
          actionLabel: app.status === 'pending_freelancer_agreement' ? 'Xác nhận ngay' : 'Xem chi tiết',
          actionLink: `/contracts/${app._id}`,
          actionStyle:
            app.status === 'pending_freelancer_agreement'
              ? `${baseActionStyle} bg-amber-500 text-white hover:bg-amber-600 hover:shadow-amber-200`
              : `${baseActionStyle} bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600`
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
          actionStyle: `${baseActionStyle} bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600`
        })
      })
      return items
    }
  }

  const activityItems = buildActivityItems()

  if (error && !loading) {
    return (
      <div className="w-full max-w-7xl mx-auto animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-[32px] border border-red-100 shadow-sm mt-8">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[24px] flex items-center justify-center shadow-inner">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="font-extrabold text-2xl text-slate-900">Đã xảy ra lỗi</h2>
          <p className="text-slate-500 text-center max-w-md font-medium">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 px-8 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* HEADER: Hiện đại, Text Gradient */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pt-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 mb-2 tracking-tight">
            {loading ? (
              <span className="inline-block h-10 w-64 bg-slate-200 rounded-xl animate-pulse" />
            ) : (
              <>
                {getGreeting()}, {fullName}!
              </>
            )}
          </h1>
          <p className="text-base text-slate-500 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {role === 'contractor'
              ? 'Chào mừng trở lại. Cùng xem tiến độ các dự án của bạn hôm nay.'
              : 'Dưới đây là tổng quan công việc và thu nhập của bạn.'}
          </p>
        </div>

        {role === 'contractor' ? (
          <Link
            to="/post-project"
            className="group px-6 py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:bg-indigo-700 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Briefcase className="w-5 h-5" /> Đăng dự án mới
          </Link>
        ) : (
          <Link
            to="/projects"
            className="group px-6 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-lg shadow-slate-200 hover:shadow-xl hover:bg-slate-800 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Search className="w-5 h-5" /> Tìm việc mới ngay
          </Link>
        )}
      </div>

      {/* THỐNG KÊ (4 Ô): Bo góc tròn, hover scale icon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading
          ? [1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)
          : stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className={`bg-white border border-slate-100/50 rounded-[24px] p-6 shadow-sm hover:shadow-xl ${stat.shadow} transition-all duration-300 group cursor-default hover:-translate-y-1`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-3xl text-slate-900 mb-1.5 tracking-tight">{stat.value}</h3>
                    <p className="text-sm font-bold text-slate-500">{stat.title}</p>
                  </div>
                </div>
              )
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI: DANH SÁCH HOẠT ĐỘNG */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="px-8 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="font-extrabold text-xl text-slate-900 tracking-tight">
                {role === 'contractor' ? 'Dự án & Hợp đồng cần chú ý' : 'Đơn ứng tuyển & Hợp đồng'}
              </h2>
              <Link
                to={role === 'contractor' ? '/manage-projects' : '/contracts'}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <ListSkeleton />
            ) : activityItems.length === 0 ? (
              <div className="py-20 px-10 text-center bg-slate-50/30">
                <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-[24px] flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <Briefcase className="w-10 h-10" />
                </div>
                <p className="text-base font-bold text-slate-600 mb-2">Chưa có hoạt động nào</p>
                <p className="text-sm text-slate-500 font-medium">
                  {role === 'contractor'
                    ? 'Hãy bắt đầu bằng cách đăng dự án đầu tiên của bạn!'
                    : 'Bắt đầu hành trình bằng cách tìm việc và nộp ứng tuyển!'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {activityItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      className="p-6 sm:px-8 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group"
                    >
                      <div className="flex items-start gap-5">
                        <div
                          className={`w-14 h-14 ${item.iconBg} ${item.iconColor} rounded-[20px] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="pt-1">
                          <h4 className="font-extrabold text-[15px] text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-[13px] font-medium text-slate-500">{item.subtitle}</p>
                        </div>
                      </div>
                      <Link to={item.actionLink} className={item.actionStyle}>
                        {item.actionLabel}
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: WIDGETS TÀI CHÍNH VÀ THAO TÁC */}
        <div className="lg:col-span-1 space-y-8">
          {/* THẺ VÍ: Thiết kế Premium kiểu Credit Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" /> FreeWork Escrow
                </h3>
                <DollarSign className="w-6 h-6 text-slate-400 opacity-50" />
              </div>

              <div className="mb-8">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Số dư khả dụng</p>
                {loading ? (
                  <div className="h-10 w-40 bg-white/10 rounded-xl animate-pulse" />
                ) : (
                  <p className="font-heading font-black text-4xl tracking-tight">
                    {formatFullMoney(data?.walletBalance ?? 0)}
                  </p>
                )}
              </div>

              <Link
                to="/wallet"
                className="block w-full text-center py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl backdrop-blur-sm transition-colors text-sm border border-white/10"
              >
                Quản lý Ví tài chính
              </Link>
            </div>
          </div>

          {/* QUICK ACTIONS: Clean & Modern */}
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
            <h3 className="font-extrabold text-lg text-slate-900 mb-5">Thao tác nhanh</h3>
            <div className="space-y-3">
              {role === 'contractor' ? (
                <>
                  <Link
                    to="/post-project"
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-[18px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                      Đăng dự án mới
                    </span>
                  </Link>
                  <Link
                    to="/contracts"
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-[18px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                      Quản lý hợp đồng
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/projects"
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-[18px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Search className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                      Tìm việc làm mới
                    </span>
                  </Link>
                  <Link
                    to="/contracts"
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-[18px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                      Hợp đồng của tôi
                    </span>
                  </Link>
                </>
              )}
              <Link
                to="/messages"
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-[18px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  Tin nhắn & Liên hệ
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
