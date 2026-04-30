import type { ContractorInfo } from '@/types/project'
import { CheckCircle2, Star, MapPin } from 'lucide-react'

interface contractorIdInfoProps {
  contractorId: ContractorInfo
}

// Hàm hỗ trợ lấy 2 chữ cái đầu nếu không có Avatar
function getInitials(fullName: string) {
  if (!fullName) return '?'
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function contractorIdInfo({ contractorId }: contractorIdInfoProps) {
  console.log(contractorId)

  // --- TRẠNG THÁI LOADING (Sửa lại cho đẹp khớp với layout cũ) ---
  if (contractorId === undefined) {
    return (
      <div className="flex items-center gap-3 animate-pulse w-full">
        <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0"></div>
        <div className="flex flex-col gap-2">
          <div className="w-32 h-3 bg-slate-200 rounded"></div>
          <div className="w-48 h-3 bg-slate-100 rounded"></div>
        </div>
      </div>
    )
  }

  // --- TRẠNG THÁI LỖI HOẶC KHÔNG CÓ DỮ LIỆU ---
  if (contractorId === null) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-extrabold text-sm shrink-0">
          ?
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-400">Người dùng ẩn danh</h4>
        </div>
      </div>
    )
  }

  // Xử lý dữ liệu Null để không bị bể Layout
  const ratingAvg = contractorId.ratingAvg || 0
  const address = contractorId.address || 'Đang cập nhật'

  return (
    <div className="flex items-center gap-3">
      {/* KHUNG AVATAR */}
      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary font-extrabold text-sm shrink-0 overflow-hidden">
        {contractorId.avatar ? (
          <img src={contractorId.avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          getInitials(contractorId.fullName)
        )}
      </div>

      {/* KHUNG THÔNG TIN */}
      <div>
        <h4 className="text-sm font-bold text-text-main line-clamp-1">{contractorId.fullName}</h4>

        <div className="flex items-center flex-wrap gap-x-2 mt-1 text-xs">
          {/* Tích xanh xác thực */}
          {contractorId.isVerified && (
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
              <CheckCircle2 className="w-3 h-3" /> Đã xác thực
            </span>
          )}

          {/* Đánh giá (Xử lý thông minh nếu null) */}
          <span className="flex items-center gap-1 text-amber-700 font-bold">
            <Star className="w-3 h-3 fill-accent text-accent" />
            {ratingAvg > 0 ? `${ratingAvg.toFixed(1)} (${contractorId.ratingCount || 0})` : 'Chưa có ĐG'}
          </span>

          {/* Địa chỉ */}
          <span className="flex items-center gap-1 text-text-sub font-medium line-clamp-1">
            <MapPin className="w-3 h-3" /> {address}
          </span>
        </div>
      </div>
    </div>
  )
}
