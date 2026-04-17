import { CheckCircle2Icon, XCircleIcon } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function PaymentResultPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const orderId = params.get('orderId') || ''
  const resultCode = params.get('resultCode') || ''
  const message = params.get('message') || ''
  const amount = Number(params.get('amount') || 0)
  const method_payment = params.get('method_payment') || ''
  const author_payment = params.get('author_payment') || ''
  const email = params.get('email') || ''

  const isSuccess = resultCode === '0' || resultCode === '00'
  const type = isSuccess ? 'success' : 'fail'

  const title_payment = method_payment === 'momo' ? 'Thanh toán qua MoMo' : 'Thanh toán qua ZaloPay'

  const logo =
    method_payment === 'momo'
      ? 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-300x300.png'
      : 'https://i.pinimg.com/736x/f9/5e/a2/f95ea23c297af3170d9d75173bed9d7e.jpg'

  const now = new Date().toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f2] p-8">
      <div className="bg-white rounded-[20px] border border-[#e8e6e0] p-10 w-full max-w-[440px]">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-[10px] bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
            <img src={logo} className="w-[26px] h-[26px] object-contain" />
          </div>
          <span className="text-[15px] text-gray-400 font-medium">{method_payment} Payment</span>
        </div>

        {/* Icon */}
        <div className="w-[80px] h-[80px] mx-auto mb-6">
          {isSuccess ? <CheckCircle2Icon size={80} color="#3B6D11" /> : <XCircleIcon size={80} color="#A32D2D" />}
        </div>

        {/* Title */}
        <div
          className={`text-[22px] font-semibold text-center mb-2 ${isSuccess ? 'text-[#3B6D11]' : 'text-[#A32D2D]'}`}
        >
          {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
        </div>

        {/* Subtitle */}
        <div className="text-sm text-gray-400 text-center mb-8 leading-6">
          {isSuccess ? (
            <>
              Giao dịch của bạn đã được xử lý thành công.
              <br />
              Cảm ơn bạn đã sử dụng dịch vụ {title_payment}
            </>
          ) : (
            <>
              Giao dịch không thể hoàn tất.
              <br />
              Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </>
          )}
        </div>

        <hr className="border-t border-[#f0ede8] my-6" />

        {/* Section */}
        <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Chi tiết giao dịch</div>

        {/* Rows */}
        <Row label="Mã đơn hàng" value={orderId || '—'} />
        <Row label="Người thanh toán" value={author_payment} />
        <Row label="Email" value={email} />
        <Row label="Số tiền" value={amount.toLocaleString('vi-VN')} />

        <Row label="Mã kết quả" value={<Badge text={resultCode} success={isSuccess} />} />

        <Row label="Trạng thái" value={<Badge text={type} success={isSuccess} />} />

        <Row label="Thông báo" value={message || '—'} />
        <Row label="Thời gian" value={now} />

        {/* Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-6 py-3 rounded-xl bg-[#AE2070] text-white font-semibold hover:opacity-85 transition"
        >
          {isSuccess ? 'Tiếp tục nạp tiền' : 'Thử lại thanh toán'}
        </button>
      </div>
    </div>
  )
}

// Row component
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#f5f4f2] last:border-none">
      <span className="text-[13px] text-gray-400">{label}</span>
      <span className="text-[13px] font-medium text-black text-right max-w-[60%]">{value}</span>
    </div>
  )
}

// Badge component
function Badge({ text, success }: { text: string; success: boolean }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        success ? 'bg-[#EAF3DE] text-[#3B6D11]' : 'bg-[#FCEBEB] text-[#A32D2D]'
      }`}
    >
      {text}
    </span>
  )
}
