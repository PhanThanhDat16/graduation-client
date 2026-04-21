import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, AlignLeft, Tags, DollarSign, ArrowLeft, CheckCircle2, X, Loader2 } from 'lucide-react'
import { useProjectStore } from '@/store/useProjectStore'
import type { ICreateProjectBody, ProjectStatus } from '@/types/project'

const CATEGORIES = ['Lập trình Web', 'Mobile App', 'UI/UX Design', 'Marketing', 'Viết lách & Dịch thuật', 'Data / AI']

const SUGGESTED_SKILLS = ['ReactJS', 'NodeJS', 'Figma', 'SEO', 'Content Writing', 'Python', 'Flutter', 'MongoDB']

export default function PostProjectPage() {
  const navigate = useNavigate()
  const { createProject, loading } = useProjectStore()

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    skills: [] as string[],
    budgetMin: '',
    budgetMax: '',
    status: 'open' as ProjectStatus
  })
  const [skillInput, setSkillInput] = useState('')

  const handleAddSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skillToRemove) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const body: ICreateProjectBody = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      skills: formData.skills,
      budgetMin: Number(formData.budgetMin),
      budgetMax: Number(formData.budgetMax),
      status: formData.status
    }

    const created = await createProject(body)
    if (created) {
      navigate('/manage-projects')
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-200 py-4 sticky top-[64px] z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Khởi tạo công việc
              </p>
              <h1 className="font-heading font-extrabold text-xl text-slate-900 leading-none">Đăng dự án mới</h1>
            </div>
          </div>
          <div className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg hidden sm:block border border-slate-200">
            Bước 1 / 1
          </div>
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-800 rounded-2xl p-6 text-white shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg mb-1">Mô tả rõ ràng, tìm người dễ dàng!</h2>
            <p className="text-indigo-100 text-sm">
              Các dự án có mô tả chi tiết và kỹ năng rõ ràng thường nhận được báo giá chất lượng hơn 70%.
            </p>
          </div>
          <Briefcase className="w-12 h-12 text-white/20 shrink-0 hidden sm:block" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* KHỐI 1: THÔNG TIN CƠ BẢN */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Thông tin cơ bản</h2>
                <p className="text-xs text-slate-500">Tên dự án và phân loại công việc</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Tên dự án <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thiết kế lại website công ty thương mại điện tử..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all shadow-sm font-medium"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Danh mục công việc <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all shadow-sm cursor-pointer font-medium"
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

              {/* Trạng thái đăng */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Trạng thái đăng tuyển</label>
                <div className="flex gap-4">
                  {(
                    [
                      { value: 'open', label: '🟢 Mở tuyển ngay', desc: 'Freelancer có thể gửi báo giá ngay' },
                      { value: 'draft', label: '⚪ Lưu nháp', desc: 'Chưa công khai, bạn có thể chỉnh sửa sau' }
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${formData.status === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={opt.value}
                        checked={formData.status === opt.value}
                        onChange={() => setFormData({ ...formData, status: opt.value })}
                        className="sr-only"
                      />
                      <p className="text-sm font-bold text-slate-800 mb-1">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KHỐI 2: MÔ TẢ CHI TIẾT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlignLeft className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Mô tả chi tiết</h2>
                <p className="text-xs text-slate-500">Cung cấp đầy đủ thông tin để freelancer hiểu rõ yêu cầu</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Chi tiết dự án <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={8}
                placeholder={
                  '- Mục tiêu của dự án là gì?\n- Các tính năng cụ thể cần có?\n- Yêu cầu về thời gian hoàn thành?'
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all shadow-inner resize-none leading-relaxed"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-2 text-right">{formData.description.length} ký tự</p>
            </div>
          </div>

          {/* KHỐI 3: KỸ NĂNG */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Tags className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Kỹ năng yêu cầu</h2>
                <p className="text-xs text-slate-500">Các công cụ, ngôn ngữ hoặc chuyên môn cần thiết</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Tìm và thêm kỹ năng</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Nhập kỹ năng (VD: Figma)..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all shadow-sm"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(skillInput))}
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(skillInput)}
                  className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Thêm
                </button>
              </div>

              <div className="min-h-[64px] p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-2 mb-4">
                {formData.skills.length === 0 ? (
                  <span className="text-sm font-medium text-slate-400 flex items-center gap-2 m-auto italic">
                    Chưa có kỹ năng nào được chọn.
                  </span>
                ) : (
                  formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-500 hover:bg-white rounded-full transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Gợi ý kỹ năng phổ biến:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      disabled={formData.skills.includes(skill)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KHỐI 4: NGÂN SÁCH */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">Ngân sách dự kiến (VND)</h2>
                <p className="text-xs text-slate-500">Khoảng giá bạn sẵn sàng chi trả cho dự án này</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Ngân sách tối thiểu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="VD: 5000000"
                    min={0}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 font-bold focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all shadow-sm"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₫</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Ngân sách tối đa <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="VD: 15000000"
                    min={0}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 font-bold focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all shadow-sm"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₫</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-indigo-900 mb-1">Thanh toán an toàn qua Escrow</p>
                <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                  Tiền của bạn sẽ được giữ an toàn trên hệ thống và chỉ được giải ngân cho freelancer khi bạn đã nghiệm
                  thu và hoàn toàn hài lòng với kết quả công việc.
                </p>
              </div>
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-center"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Đang đăng...
                </>
              ) : (
                <>
                  <Briefcase className="w-5 h-5" /> Đăng Dự Án Ngay
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
