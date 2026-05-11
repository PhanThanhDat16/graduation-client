import { ReactNode } from 'react'

interface HeroSectionProps {
  title: string
  highlightWord?: string
  subtitle?: string
  icon?: ReactNode
  children?: ReactNode
}

export default function HeroSection({ title, highlightWord, subtitle, icon, children }: HeroSectionProps) {
  return (
    // Padding ép mỏng tối đa: pt-8, pb-12
    <div className="bg-slate-900 pt-8 pb-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[50%] -right-[10%] w-[60%] h-[150%] bg-gradient-to-b from-blue-500/20 to-transparent rotate-12 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[100%] bg-gradient-to-b from-indigo-500/20 to-transparent -rotate-12 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* ĐÃ GỘP: Xếp Icon và Title nằm ngang để tiết kiệm cực nhiều chiều cao */}
        <div className="flex justify-center items-center gap-3 mb-2">
          {icon && (
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10 shadow-sm shrink-0">
              {icon}
            </div>
          )}
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            {title}{' '}
            {highlightWord && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                {highlightWord}
              </span>
            )}
          </h1>
        </div>

        {/* Subtitle nhỏ gọn, ép margin sát lên */}
        {subtitle && <p className="text-slate-400 text-sm max-w-xl mx-auto mb-5">{subtitle}</p>}

        {/* Cắm SearchBar vào đây */}
        {children && <div className="max-w-2xl mx-auto">{children}</div>}
      </div>
    </div>
  )
}
