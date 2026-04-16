import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  X,
  Printer,
  Download,
  Clock,
  ChevronLeft,
  AlertCircle,
  PenTool,
  CheckCircle2,
  ShieldCheck,
  FileBadge
} from 'lucide-react'

export default function ContractAgreementPage() {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(86385)

  // Trạng thái ký tên (Đã xóa setFreelancerSigned để fix lỗi ESLint)
  const [contractorSigned, setContractorSigned] = useState(false)
  const [freelancerSigned] = useState(false)
  const [signDate, setSignDate] = useState('')

  useEffect(() => {
    if (timeLeft > 0 && !(contractorSigned && freelancerSigned)) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, contractorSigned, freelancerSigned])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSign = () => {
    setContractorSigned(true)
    setSignDate(new Date().toLocaleString('vi-VN'))
  }

  return (
    <div className="bg-slate-100 min-h-screen pb-28 font-body">
      {/* THANH ĐIỀU KHIỂN TRÊN CÙNG */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Quay lại
        </button>

        {/* Thanh tiến trình (Stepper) */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">1</div> Thỏa
            thuận
          </span>
          <div className="w-8 h-px bg-slate-300"></div>
          <span className="flex items-center gap-1.5 text-slate-700">
            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">2</div> Ký
            tên
          </span>
          <div className="w-8 h-px bg-slate-300"></div>
          <span className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">3</div>{' '}
            Admin duyệt
          </span>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex flex-col items-start sm:items-end bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3 h-3" /> Hết hạn ký sau
            </span>
            <span className="font-mono font-extrabold text-amber-700">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex gap-1">
            <button
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip-trigger"
              title="In hợp đồng"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip-trigger"
              title="Tải PDF"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* GIẤY HỢP ĐỒNG A4 (NÂNG CẤP UI) */}
      <div className="max-w-[850px] mx-auto mt-8 lg:mt-12 bg-white shadow-[0_0_40px_rgba(0,0,0,0.05)] rounded-sm p-8 sm:p-16 lg:p-24 font-serif leading-relaxed text-slate-800 relative border border-slate-200">
        {/* Hình mờ (Watermark) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
          <FileBadge className="w-96 h-96" />
        </div>

        {/* Tiêu ngữ */}
        <div className="text-center mb-12 relative z-10">
          <h2 className="font-bold text-lg lg:text-xl uppercase mb-1 tracking-wide">
            Cộng hòa xã hội chủ nghĩa Việt Nam
          </h2>
          <h3 className="font-bold text-base lg:text-lg underline decoration-slate-800 decoration-1 underline-offset-[6px]">
            Độc lập - Tự do - Hạnh phúc
          </h3>
        </div>

        <div className="text-center mb-14 relative z-10">
          <h1 className="font-extrabold text-2xl lg:text-3xl uppercase tracking-tight text-slate-900 mb-2">
            Hợp đồng Dịch vụ
          </h1>
          <p className="italic text-sm text-slate-500 font-sans">Mã số: 001/2026/HĐDV-FLVN</p>
        </div>

        {/* Thông tin các bên */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 relative z-10">
          <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
            <h4 className="font-bold uppercase border-b-2 border-slate-200 pb-2 mb-4 text-indigo-900 text-sm tracking-wider">
              Bên A (Bên Giao việc)
            </h4>
            <ul className="space-y-2 text-[15px]">
              <li>
                <strong className="text-slate-900">Tên đơn vị:</strong> Công ty TNHH Giải Pháp Số
              </li>
              <li>
                <strong className="text-slate-900">Đại diện:</strong> Ông Nguyễn Văn A
              </li>
              <li>
                <strong className="text-slate-900">Chức vụ:</strong> Giám đốc
              </li>
              <li>
                <strong className="text-slate-900">Địa chỉ:</strong> Quận Liên Chiểu, Đà Nẵng
              </li>
            </ul>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
            <h4 className="font-bold uppercase border-b-2 border-slate-200 pb-2 mb-4 text-emerald-900 text-sm tracking-wider">
              Bên B (Bên Nhận việc)
            </h4>
            <ul className="space-y-2 text-[15px]">
              <li>
                <strong className="text-slate-900">Họ và tên:</strong> Nguyễn Tấn Sang
              </li>
              <li>
                <strong className="text-slate-900">Chuyên môn:</strong> Software Engineer
              </li>
              <li>
                <strong className="text-slate-900">Số ĐT:</strong> 09** *** ***
              </li>
              <li>
                <strong className="text-slate-900">Địa chỉ:</strong> Hòa Minh, Liên Chiểu, Đà Nẵng
              </li>
            </ul>
          </div>
        </div>

        {/* Nội dung điều khoản */}
        <div className="space-y-6 text-justify text-[15px] relative z-10">
          <p className="mb-6 italic">
            Hôm nay, ngày ... tháng ... năm 2026. Hai bên thống nhất ký kết hợp đồng dịch vụ với các điều khoản sau đây:
          </p>

          <div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">Điều 1: Nội dung công việc</h4>
            <p className="pl-4 border-l-2 border-slate-200">
              Bên B cam kết thực hiện xây dựng hệ thống <strong>"Nền tảng E-commerce MERN Stack"</strong> theo đúng mô
              tả kỹ thuật và yêu cầu mà Bên A đã đăng tải trên hệ thống. Sản phẩm phải đảm bảo chạy ổn định, responsive
              trên mọi thiết bị và bàn giao đầy đủ Source Code.
            </p>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 my-8">
            <h4 className="font-bold text-lg text-indigo-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Điều 2: Giá trị và Thanh toán (Escrow)
            </h4>
            <div className="pl-7">
              <p className="mb-2">
                Tổng giá trị hợp đồng được chốt là: <strong className="text-lg text-indigo-700">20.000.000 ₫</strong>{' '}
                (Hai mươi triệu đồng chẵn).
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>
                  Bên A sẽ nạp 100% số tiền này vào hệ thống ví bảo lãnh (Escrow) ngay sau khi hợp đồng được Admin
                  duyệt.
                </li>
                <li>Hệ thống sẽ tự động giải ngân cho Bên B ngay sau khi Bên A xác nhận "Nghiệm thu thành công".</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">Điều 3: Thời gian thực hiện</h4>
            <p className="pl-4 border-l-2 border-slate-200">
              Thời gian dự kiến hoàn thành là <strong>60 ngày làm việc</strong> kể từ thời điểm hệ thống thông báo "Đã
              nhận tiền cọc". Mọi sự chậm trễ từ Bên B nếu không có lý do chính đáng sẽ bị xử lý theo quy định tranh
              chấp của nền tảng.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg text-red-700 mb-2">Điều 4: Hiệu lực hợp đồng</h4>
            <p className="pl-4 border-l-2 border-red-200 text-slate-700">
              Hợp đồng này có hiệu lực pháp lý kể từ khi đại diện hai bên nhấn nút ký tên điện tử. Nếu quá thời hạn 24
              giờ mà một trong hai bên chưa hoàn tất việc ký kết, hợp đồng sẽ bị hệ thống tự động hủy bỏ.
            </p>
          </div>
        </div>

        {/* KHU VỰC KÝ TÊN */}
        <div className="mt-20 grid grid-cols-2 gap-8 lg:gap-16 relative z-10">
          {/* Chữ ký Bên A */}
          <div className="flex flex-col items-center">
            <p className="font-bold uppercase mb-8 text-sm tracking-wider text-slate-600">Đại diện Bên A</p>

            <div className="w-full h-32 flex flex-col items-center justify-end border-b border-dashed border-slate-300 pb-2 relative">
              {contractorSigned ? (
                <div className="absolute bottom-4 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                  <div className="font-serif italic text-4xl text-indigo-800 opacity-90 select-none transform -rotate-6 tracking-widest drop-shadow-sm">
                    Nguyen Van A
                  </div>
                  <div className="absolute -right-8 -top-4 bg-white rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSign}
                  className="group absolute bottom-4 flex flex-col items-center gap-2 px-8 py-4 bg-white border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all"
                >
                  <PenTool className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                  <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-700 uppercase tracking-widest">
                    Ký tên điện tử
                  </span>
                </button>
              )}
            </div>
            {contractorSigned && (
              <p className="text-[11px] font-sans text-slate-400 mt-3 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                Ký lúc: {signDate}
              </p>
            )}
          </div>

          {/* Chữ ký Bên B */}
          <div className="flex flex-col items-center">
            <p className="font-bold uppercase mb-8 text-sm tracking-wider text-slate-600">Đại diện Bên B</p>

            <div className="w-full h-32 flex flex-col items-center justify-end border-b border-dashed border-slate-300 pb-2 relative">
              {freelancerSigned ? (
                <div className="absolute bottom-4 font-serif italic text-4xl text-emerald-800 opacity-90 select-none transform -rotate-3 tracking-widest drop-shadow-sm">
                  Tan Sang
                </div>
              ) : (
                <div className="absolute bottom-4 flex flex-col items-center gap-2 px-8 py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl opacity-60">
                  <Clock className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chờ đối tác ký</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* THANH HÀNH ĐỘNG CỐ ĐỊNH (STICKY BOTTOM) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] font-sans">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden lg:flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
            <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0" />
            <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-md">
              Xác nhận ký đồng nghĩa với việc bạn đồng ý với các điều khoản. Sau khi hai bên hoàn tất, hệ thống sẽ tự
              động tạo phòng chat.
            </p>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-6 py-3.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-danger hover:border-red-200 transition-colors flex items-center justify-center gap-2">
              <X className="w-5 h-5" /> Từ chối
            </button>
            <button
              disabled={!contractorSigned}
              className={`flex-1 lg:flex-none px-8 py-3.5 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${contractorSigned ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              <Check className="w-5 h-5" /> Hoàn tất Ký & Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
