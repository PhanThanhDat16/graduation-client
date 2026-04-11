import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, AlignLeft, Tags, DollarSign, ArrowLeft, CheckCircle2, AlertCircle, X } from 'lucide-react'

const CATEGORIES = ['Lập trình Web', 'Mobile App', 'UI/UX Design', 'Marketing', 'Viết lách & Dịch thuật', 'Data / AI']
const SUGGESTED_SKILLS = ['ReactJS', 'NodeJS', 'Figma', 'SEO', 'Content Writing', 'Python', 'Flutter', 'MongoDB']

export default function PostProjectPage() {
  // State quản lý Form khớp với Database Schema bảng `projects`
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    skills: [] as string[],
    budget_min: '',
    budget_max: ''
  })

  const [skillInput, setSkillInput] = useState('')

  // Xử lý thêm kỹ năng
  const handleAddSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
      setSkillInput('')
    }
  }

  // Xử lý xóa kỹ năng
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Dữ liệu gửi lên API POST /projects:', formData)
    // TODO: Gọi API tạo project ở đây
  }

  return (
    <div className="bg-page min-h-screen font-body pb-24">
      {/* ── HEADER TRANG CƠ BẢN ── */}
      <div className="bg-white border-b border-border py-6 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 -ml-2 text-text-sub hover:text-primary hover:bg-page rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-heading font-extrabold text-xl text-text-main">Đăng dự án mới</h1>
          </div>
          <div className="text-sm font-bold text-text-muted hidden sm:block">Bước 1 / 1</div>
        </div>
      </div>

      {/* ── NỘI DUNG FORM ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* KHỐI 1: THÔNG TIN CƠ BẢN */}
          <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-text-main">Thông tin cơ bản</h2>
                <p className="text-xs text-text-sub">Tên dự án và phân loại công việc</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">
                  Tên dự án <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thiết kế lại website công ty thương mại điện tử..."
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-main mb-2">
                  Danh mục công việc <span className="text-danger">*</span>
                </label>
                <select
                  required
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm cursor-pointer"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="" disabled>
                    Chọn danh mục phù hợp nhất
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* KHỐI 2: MÔ TẢ CHI TIẾT */}
          <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-accent flex items-center justify-center">
                <AlignLeft className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-text-main">Mô tả chi tiết</h2>
                <p className="text-xs text-text-sub">Cung cấp đầy đủ thông tin để freelancer hiểu rõ yêu cầu</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-main mb-2">
                Chi tiết dự án <span className="text-danger">*</span>
              </label>
              <textarea
                required
                rows={6}
                placeholder="- Mục tiêu của dự án là gì?&#10;- Các tính năng cụ thể cần có?&#10;- Yêu cầu về thời gian hoàn thành?"
                className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none leading-relaxed"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <p className="text-xs text-text-muted mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Viết càng chi tiết, bạn càng nhận được báo giá chính xác.
              </p>
            </div>
          </div>

          {/* KHỐI 3: KỸ NĂNG */}
          <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Tags className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-text-main">Kỹ năng yêu cầu</h2>
                <p className="text-xs text-text-sub">Các công cụ, ngôn ngữ hoặc chuyên môn cần thiết</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-main mb-2">Tìm và thêm kỹ năng</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Nhập kỹ năng (VD: Figma)..."
                  className="flex-1 bg-white border border-border rounded-xl px-4 py-3 text-sm text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(skillInput))}
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(skillInput)}
                  className="bg-page border border-border text-text-main px-6 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  Thêm
                </button>
              </div>

              {/* Box hiển thị kỹ năng đã chọn */}
              <div className="min-h-[60px] p-4 bg-page border border-border rounded-xl flex flex-wrap gap-2 mb-4">
                {formData.skills.length === 0 ? (
                  <span className="text-sm text-text-muted flex items-center gap-2 m-auto">
                    Chưa có kỹ năng nào được thêm.
                  </span>
                ) : (
                  formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm animate-in zoom-in-95 duration-200"
                    >
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-300">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Gợi ý */}
              <div>
                <p className="text-xs font-bold text-text-muted mb-2">Gợi ý kỹ năng phổ biến:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      disabled={formData.skills.includes(skill)}
                      className="px-3 py-1.5 border border-border rounded-lg text-xs font-bold text-text-sub hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KHỐI 4: NGÂN SÁCH */}
          <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-text-main">Ngân sách dự kiến (VND)</h2>
                <p className="text-xs text-text-sub">Khoảng giá bạn sẵn sàng chi trả cho dự án này</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">
                  Ngân sách tối thiểu <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="VD: 5000000"
                    className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                    value={formData.budget_min}
                    onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-muted">₫</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-main mb-2">
                  Ngân sách tối đa <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="VD: 15000000"
                    className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                    value={formData.budget_max}
                    onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-muted">₫</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-primary mb-1">Thanh toán an toàn qua Escrow</p>
                <p className="text-xs text-primary/80 leading-relaxed">
                  Tiền của bạn sẽ được giữ an toàn trên hệ thống và chỉ được giải ngân cho freelancer khi bạn đã nghiệm
                  thu và hoàn toàn hài lòng với kết quả công việc.
                </p>
              </div>
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
            <Link
              to="/projects"
              className="px-6 py-3.5 bg-white border border-border text-text-main font-bold rounded-xl hover:bg-page transition-colors text-center"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Briefcase className="w-5 h-5" /> Đăng Dự Án Ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
