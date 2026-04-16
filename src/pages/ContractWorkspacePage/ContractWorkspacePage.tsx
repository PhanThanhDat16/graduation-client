import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  DollarSign,
  Paperclip,
  Send,
  MoreVertical,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Download,
  UploadCloud,
  AlertCircle,
  History,
  ExternalLink
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

// --- MOCK DATA CHI TIẾT HỢP ĐỒNG ---
const CONTRACT_DETAIL = {
  id: 'CT-98241',
  project_title: 'Phát triển nền tảng E-commerce bằng MERN Stack',
  status: 'active', // active | pending_escrow | completed | dispute
  total_amount: 20000000,
  escrow_status: 'secured', // secured | pending | released
  start_date: '10/04/2026',
  deadline: '10/06/2026',
  progress: 45,
  client: {
    id: 'u1',
    name: 'Công ty TNHH Giải Pháp Số',
    avatar: 'https://ui-avatars.com/api/?name=Giai+Phap&background=0D9488&color=fff'
  },
  freelancer: {
    id: 'f1',
    name: 'Nguyễn Tấn Sang',
    avatar: 'https://ui-avatars.com/api/?name=Tan+Sang&background=1B2A6B&color=fff'
  },
  files: [
    { id: 'f1', name: 'Yeu_cau_chi_tiet.pdf', size: '2.4 MB', uploader: 'Client', time: '10/04/2026' },
    { id: 'f2', name: 'Database_Design_V1.png', size: '1.1 MB', uploader: 'Freelancer', time: '12/04/2026' }
  ],
  timeline: [
    { id: 1, event: 'Hợp đồng được ký kết', time: '10/04/2026 09:00', type: 'system' },
    { id: 2, event: 'Khách hàng đã nạp tiền bảo lãnh Escrow', time: '10/04/2026 10:30', type: 'finance' },
    { id: 3, event: 'Freelancer đã bắt đầu dự án', time: '10/04/2026 11:00', type: 'status' }
  ]
}

export default function ContractWorkspacePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('chat') // chat | deliverables | timeline
  const [message, setMessage] = useState('')

  const { user } = useAuthStore()

  // Tạm mock role (Nếu chưa có, mặc định là freelancer)
  const userRole = user?.role || 'freelancer'

  const contract = CONTRACT_DETAIL
  const partner = userRole === 'contractor' ? contract.freelancer : contract.client
  const formatMoney = (amount: number) => amount.toLocaleString('vi-VN')

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] font-body">
      {/* ── HEADER THANH TRẠNG THÁI ── */}
      <div className="bg-white border-b border-slate-200 sticky top-[64px] z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                    Mã HĐ: {contract.id}
                  </span>
                  {contract.status === 'active' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                      ● Đang thực hiện
                    </span>
                  )}
                </div>
                <h1 className="font-bold text-lg text-slate-900 leading-tight">{contract.project_title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              {userRole === 'contractor' ? (
                <>
                  <button className="flex-1 lg:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                    Yêu cầu sửa đổi
                  </button>
                  <button className="flex-1 lg:flex-none px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Nghiệm thu & Trả tiền
                  </button>
                </>
              ) : (
                <>
                  <button className="flex-1 lg:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <History className="w-4 h-4" /> Báo cáo tiến độ
                  </button>
                  <button className="flex-1 lg:flex-none px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all flex items-center justify-center gap-2">
                    <UploadCloud className="w-4 h-4" /> Nộp sản phẩm
                  </button>
                </>
              )}
              <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200">
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* ==========================================
              CỘT TRÁI: KHU VỰC LÀM VIỆC CHÍNH (8 CỘT)
          ========================================== */}
          <div className="xl:col-span-8 space-y-6">
            {/* TABS ĐIỀU HƯỚNG */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'chat' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <MessageSquare className="w-4 h-4" /> Trao đổi công việc
                </button>
                <button
                  onClick={() => setActiveTab('deliverables')}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'deliverables' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <FileText className="w-4 h-4" /> Sản phẩm bàn giao
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'timeline' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <History className="w-4 h-4" /> Lịch sử hoạt động
                </button>
              </div>

              {/* NỘI DUNG TAB */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-6 mb-4">
                      {/* Tin nhắn mẫu */}
                      <div className="flex items-start gap-3">
                        <img src={partner.avatar} className="w-8 h-8 rounded-full" />
                        <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                          <p className="text-sm text-slate-800 font-medium">
                            Chào Sang, tôi đã nạp tiền Escrow rồi nhé. Bạn có thể bắt đầu triển khai phần giao diện giúp
                            tôi.
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">10:30 AM</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                          <p className="text-sm text-white font-medium">
                            Dạ vâng anh, em đã nhận được thông báo. Em sẽ gửi bản Database Design sớm cho anh duyệt ạ.
                          </p>
                          <span className="text-[10px] text-indigo-200 mt-1 block text-right">11:00 AM</span>
                        </div>
                      </div>
                    </div>
                    {/* Input Chat */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-end gap-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                      <button className="p-2 text-slate-400 hover:text-indigo-600">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập nội dung trao đổi..."
                        className="flex-1 bg-transparent border-none outline-none text-sm py-2 resize-none max-h-32"
                        rows={1}
                      />
                      <button
                        className={`p-2.5 rounded-xl transition-all ${message.trim() ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-400'}`}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'deliverables' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-slate-900">Danh sách tệp tin đã nộp</h3>
                      <button className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
                        <UploadCloud className="w-4 h-4" /> Tải lên sản phẩm mới
                      </button>
                    </div>
                    {contract.files.map((file) => (
                      <div
                        key={file.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between group hover:bg-white hover:border-indigo-200 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{file.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {file.size} • Tải lên bởi {file.uploader} • {file.time}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {contract.timeline.map((item) => (
                      <div key={item.id} className="relative pl-10">
                        <div
                          className={`absolute left-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${item.type === 'system' ? 'bg-slate-400 text-white' : item.type === 'finance' ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'}`}
                        >
                          {item.type === 'finance' ? <DollarSign className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.event}</p>
                          <p className="text-xs text-slate-400 font-medium">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Thông báo nhắc nhở quan trọng */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-900 mb-1">Mẹo làm việc an toàn:</p>
                <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside font-medium opacity-80">
                  <li>Luôn trao đổi và nộp sản phẩm ngay tại phòng làm việc này để được bảo vệ.</li>
                  <li>Tiền của bạn đang được giữ an toàn trên hệ thống (Escrow).</li>
                  <li>Nếu có tranh chấp, vui lòng sử dụng tính năng "Báo cáo" để Admin hỗ trợ.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ==========================================
              CỘT PHẢI: THÔNG TIN HỢP ĐỒNG (4 CỘT)
          ========================================== */}
          <div className="xl:col-span-4 space-y-6">
            {/* Box: Tài chính & Bảo lãnh */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-600" /> Tài chính & Escrow
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Giá trị hợp đồng:</span>
                  <span className="text-lg font-extrabold text-slate-900">{formatMoney(contract.total_amount)} ₫</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Trạng thái bảo lãnh:</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5" /> Đã nạp đủ cọc
                  </span>
                </div>
              </div>
              <div className="h-px bg-slate-100 mb-6"></div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Ngày bắt đầu
                    </p>
                    <p className="text-sm font-bold text-slate-700">{contract.start_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Hạn bàn giao (Deadline)
                    </p>
                    <p className="text-sm font-bold text-red-600">{contract.deadline}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box: Đối tác làm việc */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
                Về {userRole === 'contractor' ? 'Freelancer' : 'Khách hàng'}
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <img src={partner.avatar} className="w-14 h-14 rounded-full border border-slate-200 shadow-sm" />
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{partner.name}</h3>
                  <Link
                    to={`/profile`}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    Xem hồ sơ chi tiết <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              <button className="w-full py-2.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors uppercase tracking-widest">
                Đánh giá đối tác
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
