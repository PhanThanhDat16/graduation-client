import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, DollarSign, FileText, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'

// Mock data dự án đang ứng tuyển (Thực tế sẽ lấy từ API dựa vào useParams)
const PROJECT_INFO = {
  id: 'p1',
  title: 'Phát triển nền tảng E-commerce bằng MERN Stack',
  client: 'Công ty TNHH Giải Pháp Số',
  budget: '15.000.000 - 25.000.000 ₫',
  skills: ['ReactJS', 'NodeJS', 'MongoDB']
}

export default function SubmitProposalPage() {
  const navigate = useNavigate()
  // const { id } = useParams()

  // States cho Form
  const [bidAmount, setBidAmount] = useState<number | ''>('')
  const [estimatedTime, setEstimatedTime] = useState('1 tháng')
  const [coverLetter, setCoverLetter] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Logic tính phí sàn (Giả sử nền tảng thu phí 10%)
  const platformFeeRate = 0.1
  const platformFee = typeof bidAmount === 'number' ? bidAmount * platformFeeRate : 0
  const receiveAmount = typeof bidAmount === 'number' ? bidAmount - platformFee : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Giả lập delay gửi API
    setTimeout(() => {
      setIsSubmitting(false)
      // Gửi xong thì đá thẳng Freelancer vào trang "Quản lý Báo giá" của họ trong Dashboard
      navigate('/my-proposals')
    }, 1500)
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-body">
      {/* HEADER TỐI GIẢN */}
      <div className="bg-white border-b border-slate-200 sticky top-[64px] z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Gửi báo giá cho dự án</p>
            <h1 className="font-bold text-lg text-slate-900 truncate max-w-md sm:max-w-xl">{PROJECT_INFO.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* KHỐI 1: TÓM TẮT DỰ ÁN */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" /> Thông tin Ngân sách
                </h3>
                <p className="text-sm text-indigo-700 mb-3">
                  Khách hàng dự kiến chi trả trong khoảng <strong>{PROJECT_INFO.budget}</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_INFO.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-white/60 text-indigo-700 text-xs font-bold rounded border border-indigo-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-indigo-100 shrink-0 h-fit flex items-center gap-3 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Khách hàng</p>
                  <p className="font-bold text-slate-900">{PROJECT_INFO.client}</p>
                </div>
              </div>
            </div>
          </div>

          {/* KHỐI 2: ĐỊNH GIÁ & THỜI GIAN */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-indigo-600" /> Điều khoản & Chi phí
            </h2>

            <div className="space-y-6 max-w-2xl">
              {/* Nhập giá */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 mb-1">Mức giá đề xuất</h4>
                  <p className="text-sm text-slate-500">Tổng số tiền khách hàng sẽ phải trả cho bạn.</p>
                </div>
                <div className="w-full sm:w-64 relative">
                  <input
                    type="number"
                    required
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value) || '')}
                    placeholder="VD: 20000000"
                    className="w-full pl-4 pr-12 py-3 bg-white border-2 border-slate-200 rounded-xl text-right font-bold text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all shadow-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₫</span>
                </div>
              </div>

              {/* Phí sàn */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                    Phí nền tảng (10%) <AlertCircle className="w-4 h-4 text-slate-400" />
                  </h4>
                  <p className="text-sm text-slate-500">Phí duy trì hệ thống và bảo lãnh hợp đồng.</p>
                </div>
                <div className="w-full sm:w-64 text-right px-4">
                  <span className="font-bold text-red-500">- {platformFee.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>

              {/* Thực nhận */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex-1">
                  <h4 className="font-bold text-emerald-600 mb-1">Thực nhận (Estimated)</h4>
                  <p className="text-sm text-slate-500">Số tiền bạn sẽ nhận về ví sau khi trừ phí.</p>
                </div>
                <div className="w-full sm:w-64 text-right px-4">
                  <span className="font-extrabold text-2xl text-emerald-600">
                    {receiveAmount.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>

              {/* Thời gian */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 mb-1">Thời gian dự kiến</h4>
                  <p className="text-sm text-slate-500">Bao lâu thì bạn hoàn thành dự án này?</p>
                </div>
                <div className="w-full sm:w-64">
                  <select
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-indigo-600 outline-none transition-all cursor-pointer shadow-sm"
                  >
                    <option value="Dưới 1 tuần">Dưới 1 tuần</option>
                    <option value="1 - 2 tuần">1 - 2 tuần</option>
                    <option value="1 tháng">1 tháng</option>
                    <option value="2 - 3 tháng">2 - 3 tháng</option>
                    <option value="Hơn 3 tháng">Hơn 3 tháng</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* KHỐI 3: THƯ CHÀO HÀNG (COVER LETTER) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-bold text-xl text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" /> Thư chào hàng (Cover Letter)
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Giới thiệu bản thân và giải thích tại sao bạn là người phù hợp nhất cho dự án này.
            </p>

            <textarea
              required
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Chào bạn, tôi đã đọc kỹ yêu cầu dự án và nhận thấy kinh nghiệm của mình cực kỳ phù hợp vì..."
              className="w-full h-48 p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all resize-none shadow-inner"
            ></textarea>
          </div>

          {/* NÚT SUBMIT CHỐT ĐƠN */}
          <div className="flex items-center gap-4 justify-end border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !bidAmount || !coverLetter}
              className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang gửi...
                </span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Gửi Báo Giá Ngay
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
