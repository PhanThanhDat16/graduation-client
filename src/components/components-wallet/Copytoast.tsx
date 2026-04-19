import { CheckCheck } from 'lucide-react'

export default function CopyToast({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(12px)',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
        transition: 'opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.5,0.64,1)',
        zIndex: 9999
      }}
    >
      <div className="flex items-center gap-2 bg-slate-900 text-slate-100 px-4 py-3 rounded-xl text-[12px] font-medium shadow-lg">
        <CheckCheck size={15} style={{ color: '#a5b4fc' }} />
        Đã sao chép vào bộ nhớ tạm
      </div>
    </div>
  )
}
