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
    <div className="bg-slate-50 min-h-screen font-body pb-32">
      {/* ── HERO SECTION ── */}
      <HeroSection
        icon={<MessageCircle size={32} className="text-blue-400" />}
        title="Sẵn sàng"
        highlightWord="hỗ trợ bạn"
        subtitle="Chúng tôi đề cao sự kết nối trực tiếp. Chọn phương thức phù hợp nhất, FreeWork luôn ở đây lắng nghe và giải quyết vấn đề của bạn ngay lập tức."
      />

      {/* ── MAIN CONTENT (BENTO GRID STYLE) ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
              <h3 className="font-heading font-black text-2xl text-slate-900 mb-3">{method.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">{method.description}</p>

              {/* Dữ liệu liên hệ chính (Email/Phone) */}
              <div className="bg-slate-50 w-full py-4 rounded-xl border border-slate-100 mb-6 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                <span className="font-bold text-slate-800 text-base sm:text-lg group-hover:text-indigo-700 transition-colors">
                  {method.value}
                </span>
              </div>

              {/* Call To Action Text */}
              <div className="flex items-center gap-2 font-bold text-sm text-slate-400 group-hover:text-indigo-600 transition-colors mt-auto">
                {method.actionText}
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>

        {/* ── CÂU HỎI THƯỜNG GẶP (FAQ SNIPPET) ── */}
        <div className="mt-20 bg-slate-900 rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white mb-4">Bạn cần giải đáp nhanh?</h3>
            <p className="text-slate-400 text-base mb-8">
              Trước khi liên hệ, hãy thử xem qua Trung tâm Hỗ trợ của chúng tôi. 80% các thắc mắc về Ví Escrow, đăng dự
              án và rút tiền đều đã được giải đáp chi tiết tại đây.
            </p>
            <a
              href="/faq"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm"
            >
              Xem câu hỏi thường gặp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
