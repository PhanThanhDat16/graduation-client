import { Filter } from 'lucide-react'
import { createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import InputNumber from '@/components/InputNumber'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, type Schema } from '@/utils/rules'
import { omitBy, isUndefined } from 'lodash'
import { type QueryConfig } from '@/hooks/useProjectQueryConfig'

const POPULAR_SKILLS = ['ReactJS', 'NodeJS', 'Figma', 'Python', 'SEO', 'Flutter', 'Vue.js', 'TypeScript']
const CATEGORIES = [
  { label: 'Tất cả', value: '' },
  { label: 'Lập trình Web', value: 'web' },
  { label: 'Mobile App', value: 'mobile' },
  { label: 'UI/UX Design', value: 'uiux' },
  { label: 'Data / AI', value: 'data' }
]

interface FilterSidebarProps {
  queryConfig: QueryConfig
}

export default function FilterSidebar({ queryConfig }: FilterSidebarProps) {
  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors }
  } = useForm<Schema>({
    defaultValues: {
      budgetMax: queryConfig.budgetMax || '',
      budgetMin: queryConfig.budgetMin || ''
    },
    resolver: yupResolver(schema),
    shouldFocusError: false
  })

  const navigate = useNavigate()
  const location = useLocation()

  // --- HÀM CỐT LÕI: ĐẨY MỌI THAY ĐỔI LÊN URL ---
  const handleFilterChange = (key: string, value: string | undefined) => {
    // Tạo config mới, nếu value bị xóa (undefined), hàm omitBy phía dưới sẽ tự động gỡ nó khỏi URL
    const newConfig = { ...queryConfig, [key]: value, page: '1' }

    // Lọc bỏ các key có giá trị undefined
    const cleanedConfig = omitBy(newConfig, isUndefined)

    navigate({
      pathname: location.pathname,
      search: createSearchParams(cleanedConfig).toString()
    })
  }

  // Xóa toàn bộ bộ lọc, trở về trang /projects mặc định
  const handleReset = () => {
    navigate(location.pathname)
    reset() // Xóa cả dữ liệu đang nhập dở trong Form Ngân sách
  }

  // TÌM KIẾM THEO KỸ NĂNG (Single-select để khớp với Backend LIKE %keyword%)
  const handleSkillToggle = (skill: string) => {
    const isActive = queryConfig.keyword === skill
    handleFilterChange('keyword', isActive ? undefined : skill)
  }

  // FORM SUBMIT NGÂN SÁCH
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams(
        omitBy(
          {
            ...queryConfig,
            budgetMin: data.budgetMin ? String(data.budgetMin) : undefined,
            budgetMax: data.budgetMax ? String(data.budgetMax) : undefined,
            page: '1'
          },
          isUndefined
        ) as Record<string, string>
      ).toString()
    })
  })

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-gray-50/50">
        <span className="font-bold text-sm text-text-main flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-sub" /> Bộ lọc
        </span>
        <button onClick={handleReset} className="text-xs font-bold text-danger hover:underline">
          Xóa tất cả
        </button>
      </div>

      {/* --- CATEGORY FILTER --- */}
      <div className="px-5 py-5 border-b border-border">
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Danh mục</div>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isActive = (queryConfig.category || '') === cat.value
            return (
              <label
                key={cat.value}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="category"
                  checked={isActive}
                  onChange={() => handleFilterChange('category', cat.value || undefined)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className={`text-sm ${isActive ? 'text-primary font-bold' : 'text-text-sub font-medium'}`}>
                  {cat.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* --- NGÂN SÁCH FILTER --- */}
      <div className="px-5 py-5 border-b border-border">
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Ngân sách (VND)</div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="budgetMin"
              render={({ field }) => {
                return (
                  <InputNumber
                    type="text"
                    placeholder="₫ TỪ"
                    className="grow"
                    classNameError="hidden" // Tạm ẩn lỗi đơn để gộp chung
                    classNameInput="p-2 w-full outline-none border text-sm border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('budgetMax')
                    }}
                  />
                )
              }}
            />
            <div className="shrink-0 text-text-muted font-bold">-</div>
            <Controller
              control={control}
              name="budgetMax"
              render={({ field }) => {
                return (
                  <InputNumber
                    type="text"
                    placeholder="₫ ĐẾN"
                    className="grow"
                    classNameError="hidden"
                    classNameInput="p-2 w-full outline-none border text-sm border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('budgetMin')
                    }}
                  />
                )
              }}
            />
          </div>

          {/* Cảnh báo lỗi khoảng giá */}
          {(errors.budgetMin || errors.budgetMax) && (
            <div className="text-xs font-medium text-danger text-center">Vui lòng nhập khoảng giá hợp lệ</div>
          )}

          {/* NÚT ÁP DỤNG */}
          <button
            type="submit"
            className="w-full py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-wider"
          >
            Áp dụng
          </button>
        </form>
      </div>

      {/* --- KỸ NĂNG FILTER --- */}
      <div className="px-5 py-5">
        <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Kỹ năng phổ biến</div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SKILLS.map((skill) => {
            const active = queryConfig.keyword === skill
            return (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${active ? 'bg-indigo-50 border-primary/30 text-primary' : 'bg-white border-border text-text-sub hover:border-gray-300'}`}
              >
                {skill}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
