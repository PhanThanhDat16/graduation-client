import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, AlignLeft, Tags, DollarSign, CheckCircle2, X } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// IMPORT SCHEMA TỪ FILE CỦA BẠN
import { projectSchema, type ProjectSchema } from '@/utils/rules'
// IMPORT COMPONENT INPUT CỦA BẠN
import Input from '@/components/Input/Input'

const CATEGORIES = ['Lập trình Web', 'Mobile App', 'UI/UX Design', 'Marketing', 'Viết lách & Dịch thuật', 'Data / AI']
const SUGGESTED_SKILLS = ['ReactJS', 'NodeJS', 'Figma', 'SEO', 'Content Writing', 'Python', 'Flutter', 'MongoDB']

interface ProjectFormProps {
  initialData?: Partial<ProjectSchema> // Data truyền vào từ màn Edit
  onSubmit: (data: ProjectSchema) => void
  isSubmitting: boolean
  submitText?: string
}

export default function ProjectForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitText = 'Đăng Dự Án Ngay'
}: ProjectFormProps) {
  const navigate = useNavigate()
  const [skillInput, setSkillInput] = useState('')
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<ProjectSchema>({
    resolver: yupResolver(projectSchema),
    defaultValues: initialData || {
      title: '',
      category: '',
      description: '',
      skills: [],
      budgetMin: '',
      budgetMax: ''
    }
  })

  const currentSkills =
    useWatch({
      control,
      name: 'skills'
    }) || []

  // Xử lý thêm kỹ năng
  const handleAddSkill = (skill: string) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !(currentSkills as string[]).includes(trimmedSkill)) {
      setValue('skills', [...(currentSkills as string[]), trimmedSkill], { shouldValidate: true })
      setSkillInput('')
    }
  }

  // Xử lý xóa kỹ năng
  const handleRemoveSkill = (skillToRemove: string) => {
    setValue(
      'skills',
      (currentSkills as string[]).filter((s) => s !== skillToRemove),
      { shouldValidate: true }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ── THÔNG TIN CƠ BẢN ── */}
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
            {/* COMPONENT INPUT */}
            <Input
              type="text"
              name="title"
              register={register}
              errorMessage={errors.title?.message}
              placeholder="VD: Thiết kế lại website công ty thương mại điện tử..."
              classNameInput={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-1 outline-none transition-all font-medium ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-indigo-600 focus:border-indigo-600'
              }`}
              classNameError="text-red-500 text-xs mt-1.5 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Danh mục công việc <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-1 outline-none transition-all cursor-pointer font-medium ${
                errors.category
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-indigo-600 focus:border-indigo-600'
              }`}
              {...register('category')}
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
            {errors.category && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.category.message}</p>}
          </div>
        </div>
      </div>

      {/* ── MÔ TẢ CHI TIẾT ── */}
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
            rows={8}
            placeholder="- Mục tiêu của dự án là gì?&#10;- Các tính năng cụ thể cần có?&#10;- Yêu cầu về thời gian hoàn thành?"
            className={`w-full bg-slate-50 border rounded-xl p-5 text-sm text-slate-900 focus:bg-white focus:ring-1 outline-none transition-all resize-none leading-relaxed ${
              errors.description
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-200 focus:ring-indigo-600 focus:border-indigo-600'
            }`}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* ── KỸ NĂNG ── */}
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
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Tìm và thêm kỹ năng <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-4">
            {/* Input thường cho thẻ Search (Không dùng register vì đây là un-controlled local state) */}
            <input
              type="text"
              placeholder="Nhập kỹ năng (VD: Figma)..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSkill(skillInput)
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleAddSkill(skillInput)}
              className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Thêm
            </button>
          </div>

          <div
            className={`min-h-[64px] p-4 bg-slate-50 border rounded-xl flex flex-wrap gap-2 mb-2 ${errors.skills ? 'border-red-500' : 'border-slate-200'}`}
          >
            {currentSkills.length === 0 ? (
              <span className="text-sm font-medium text-slate-400 flex items-center gap-2 m-auto italic">
                Chưa có kỹ năng nào được chọn.
              </span>
            ) : (
              (currentSkills as string[]).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 animate-in zoom-in-95 duration-200"
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
          {errors.skills && (
            <p className="text-red-500 text-xs mt-1.5 mb-4 font-medium">{errors.skills.message as string}</p>
          )}

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gợi ý kỹ năng phổ biến:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  disabled={(currentSkills as string[]).includes(skill)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── NGÂN SÁCH ── */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div className="relative">
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Ngân sách tối thiểu <span className="text-red-500">*</span>
            </label>
            <span className="absolute left-4 top-[38px] font-bold text-slate-400 z-10">₫</span>
            {/* COMPONENT INPUT */}
            <Input
              type="number"
              name="budgetMin"
              register={register}
              errorMessage={errors.budgetMin?.message}
              placeholder="VD: 5000000"
              classNameInput={`w-full bg-white border rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 font-bold focus:ring-1 outline-none transition-all ${
                errors.budgetMin
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-indigo-600 focus:border-indigo-600'
              }`}
              classNameError="text-red-500 text-xs mt-1.5 font-medium"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Ngân sách tối đa <span className="text-red-500">*</span>
            </label>
            <span className="absolute left-4 top-[38px] font-bold text-slate-400 z-10">₫</span>
            {/* COMPONENT INPUT */}
            <Input
              type="number"
              name="budgetMax"
              register={register}
              errorMessage={errors.budgetMax?.message}
              placeholder="VD: 15000000"
              classNameInput={`w-full bg-white border rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 font-bold focus:ring-1 outline-none transition-all ${
                errors.budgetMax
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-200 focus:ring-indigo-600 focus:border-indigo-600'
              }`}
              classNameError="text-red-500 text-xs mt-1.5 font-medium"
            />
          </div>
        </div>

        <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-indigo-900 mb-1">Thanh toán an toàn qua Escrow</p>
            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
              Tiền của bạn sẽ được giữ an toàn trên hệ thống và chỉ được giải ngân cho freelancer khi bạn đã nghiệm thu
              và hài lòng.
            </p>
          </div>
        </div>
      </div>

      {/* ── ACTION BUTTONS ── */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-10 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Đang
              xử lý...
            </>
          ) : (
            <>
              <Briefcase className="w-5 h-5" /> {submitText}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
