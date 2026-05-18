import { ShieldAlert, X } from 'lucide-react'

interface SignatureConfirmModalProps {
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function SignatureConfirmModal({ isOpen, isLoading, onClose, onConfirm }: SignatureConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-indigo-50 p-6 flex flex-col items-center text-center border-b border-indigo-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 ring-4 ring-white shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Xác nhận Ký số Điện tử</h3>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-slate-600 text-[15px] leading-relaxed">
            Hành động này mang <strong>giá trị pháp lý ràng buộc</strong> tương đương với chữ ký tay truyền thống.
            <br className="mb-2" />
            Bạn có chắc chắn muốn ký và chấp thuận các điều khoản của hợp đồng này?
          </p>
        </div>

        {/* Footer / Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Tôi đồng ý Ký kết'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
