import { Mail, Phone, MapPin, ArrowRight, MessageCircle } from 'lucide-react'
import HeroSection from '@/components/HeroSection/HeroSection'

const CONTACT_METHODS = [
  {
    icon: <Mail className="w-8 h-8 text-white" />,
    title: 'Gửi Email',
    description: 'Ưu tiên cho các vấn đề hợp tác, báo cáo hoặc cần đính kèm hình ảnh/tài liệu.',
    value: 'nguyentansang181224@gmail.com',
    actionText: 'Soạn email ngay',
    actionLink: 'mailto:nguyentansang181224@gmail.com',
    color: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-indigo-500/30'
  },
  {
    icon: <Phone className="w-8 h-8 text-white" />,
    title: 'Gọi Hotline',
    description: 'Dành cho các vấn đề khẩn cấp về tài khoản và giao dịch cần xử lý ngay lập tức.',
    value: '+84 763 730 362',
    actionText: 'Gọi điện ngay',
    actionLink: 'tel:+84763730362',
    color: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-emerald-500/30'
  },
  {
    icon: <MapPin className="w-8 h-8 text-white" />,
    title: 'Trụ sở chính',
    description: 'Trung tâm hỗ trợ trực tiếp và không gian làm việc của đội ngũ phát triển FreeWork.',
    value: 'Đại học Duy Tân, Đà Nẵng',
    actionText: 'Chỉ đường Google Maps',
    actionLink: 'https://maps.google.com/?q=Đại+học+Duy+Tân,+Đà+Nẵng',
    color: 'from-rose-400 to-red-500',
    shadow: 'shadow-rose-500/30'
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen pb-32 bg-slate-50 font-body">
      {/* ── HERO SECTION ── */}
      <HeroSection
        icon={<MessageCircle size={32} className="text-blue-400" />}
        title="Sẵn sàng"
        highlightWord="hỗ trợ bạn"
        subtitle="Chúng tôi đề cao sự kết nối trực tiếp. Chọn phương thức phù hợp nhất, FreeWork luôn ở đây lắng nghe và giải quyết vấn đề của bạn ngay lập tức."
      />

      {/* ── MAIN CONTENT (BENTO GRID STYLE) ── */}
      <div className="relative z-20 max-w-6xl px-4 mx-auto -mt-10 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {CONTACT_METHODS.map((method, index) => (
            <a
              key={index}
              href={method.actionLink}
              target={method.title === 'Trụ sở chính' ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="group bg-white rounded-[2rem] p-8 sm:p-10 flex flex-col items-center text-center border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hiệu ứng nền chìm (Blob) */}
              <div
                className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 blur-2xl ${method.color}`}
              />

              {/* Icon Container */}
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-8 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${method.color} ${method.shadow}`}
              >
                {method.icon}
              </div>

              {/* Text Info */}
              <h3 className="mb-3 text-2xl font-black font-heading text-slate-900">{method.title}</h3>
              <p className="flex-1 mb-8 text-sm leading-relaxed text-slate-500">{method.description}</p>

              {/* Dữ liệu liên hệ chính (Email/Phone) */}
              <div className="w-full p-4 mb-6 transition-colors border bg-slate-50 rounded-xl border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                <span className="block w-full min-w-0 overflow-hidden text-base font-bold truncate text-slate-800 sm:text-lg group-hover:text-indigo-700">
                  {method.value}
                </span>
              </div>

              {/* Call To Action Text */}
              <div className="flex items-center gap-2 mt-auto text-sm font-bold transition-colors text-slate-400 group-hover:text-indigo-600">
                {method.actionText}
                <ArrowRight size={16} className="transition-transform transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>

        {/* ── CÂU HỎI THƯỜNG GẶP (FAQ SNIPPET) ── */}
        <div className="mt-20 bg-slate-900 rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="mb-4 text-2xl font-black text-white font-heading sm:text-3xl">Bạn cần giải đáp nhanh?</h3>
            <p className="mb-8 text-base text-slate-400">
              Trước khi liên hệ, hãy thử xem qua Trung tâm Hỗ trợ của chúng tôi. 80% các thắc mắc về Ví Escrow, đăng dự
              án và rút tiền đều đã được giải đáp chi tiết tại đây.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
