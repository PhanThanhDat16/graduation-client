import { Link } from 'react-router-dom'
import { Building2, Target, ShieldCheck, Zap, Users, Globe, Award, Briefcase } from 'lucide-react'
import HeroSection from '@/components/HeroSection/HeroSection'

const STATS = [
  { label: 'Freelancer tài năng', value: '10,000+', icon: <Users className="text-blue-500 w-6 h-6" /> },
  { label: 'Dự án hoàn thành', value: '50,000+', icon: <Briefcase className="text-indigo-500 w-6 h-6" /> },
  { label: 'Quốc gia & Vùng lãnh thổ', value: '15+', icon: <Globe className="text-emerald-500 w-6 h-6" /> },
  { label: 'Tỷ lệ hài lòng', value: '99.8%', icon: <Award className="text-amber-500 w-6 h-6" /> }
]

const CORE_VALUES = [
  {
    title: 'Minh bạch & An toàn',
    description:
      'Bảo vệ cả Freelancer và Khách hàng với hệ thống thanh toán tạm giữ (Escrow Wallet). Không còn nỗi lo bùng tiền hay chậm thanh toán.',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
    color: 'bg-emerald-50 border-emerald-100'
  },
  {
    title: 'Chất lượng hàng đầu',
    description:
      'Hệ thống xác thực danh tính và đánh giá khách quan giúp sàng lọc ra những chuyên gia giỏi nhất cho từng dự án.',
    icon: <Target className="w-8 h-8 text-blue-500" />,
    color: 'bg-blue-50 border-blue-100'
  },
  {
    title: 'Kết nối siêu tốc',
    description:
      'Thuật toán gợi ý thông minh giúp doanh nghiệp tìm thấy nhân tài phù hợp chỉ trong vài giờ thay vì vài tuần.',
    icon: <Zap className="w-8 h-8 text-amber-500" />,
    color: 'bg-amber-50 border-amber-100'
  }
]

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24">
      {/* ── HERO SECTION ĐỒNG BỘ ── */}
      <HeroSection
        icon={<Building2 size={32} className="text-blue-400" />}
        title="Câu chuyện về"
        highlightWord="FreeWork"
        subtitle="Chúng tôi xây dựng nền tảng này với niềm tin rằng: Bất kỳ ai, ở bất kỳ đâu cũng xứng đáng có cơ hội làm việc và phát triển sự nghiệp không giới hạn."
      />

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-20">
        {/* 1. KHỐI THỐNG KÊ (STATS GRID) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/40 text-center flex flex-col items-center justify-center transition-transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 2. CÂU CHUYỆN SỨ MỆNH (MISSION STORY) */}
        <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 leading-tight">
              Sứ mệnh tái định nghĩa <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                tương lai công việc
              </span>
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              FreeWork ra đời từ một ý tưởng đơn giản: Làm thế nào để loại bỏ hoàn toàn các rào cản địa lý và rủi ro
              thanh toán trong ngành việc làm tự do?
            </p>
            <p className="text-slate-600 leading-relaxed text-lg">
              Chúng tôi không chỉ là một nền tảng tìm việc. Chúng tôi là một <strong>hệ sinh thái an toàn</strong>, nơi
              sự tin tưởng được mã hóa bằng công nghệ Ví Escrow, và năng lực được đánh giá bằng những kết quả minh bạch
              nhất.
            </p>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-3xl transform rotate-3 scale-105 -z-10" />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
              alt="Team working together"
              className="rounded-3xl shadow-xl object-cover h-[300px] sm:h-[400px] w-full"
            />
          </div>
        </div>

        {/* 3. GIÁ TRỊ CỐT LÕI (CORE VALUES) */}
        <div>
          <div className="text-center mb-12">
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mb-4">Giá trị cốt lõi</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Những nguyên tắc định hình cách chúng tôi xây dựng và vận hành FreeWork mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CORE_VALUES.map((value, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl p-8 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${value.color}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-white/50 shadow-sm flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. CALL TO ACTION KẾT THÚC */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          {/* Elements trang trí */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white mb-6 leading-tight">
              Sẵn sàng bắt đầu hành trình <br className="hidden sm:block" /> cùng FreeWork?
            </h2>
            <p className="text-indigo-200 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
              Tham gia cùng hàng ngàn chuyên gia và doanh nghiệp đang kiến tạo tương lai của ngành việc làm tự do.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-2xl hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl"
              >
                Đăng ký miễn phí
              </Link>
              <Link
                to="/projects"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Khám phá dự án
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
