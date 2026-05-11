import { createSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'

const CATEGORIES = ['Lập trình Web', 'Mobile App', 'UI/UX Design', 'Marketing', 'Data / AI']
const SKILLS = ['ReactJS', 'NodeJS', 'Figma', 'Python', 'SEO', 'Flutter', 'TypeScript']

export default function FreelancerFilterSidebar({ queryConfig }: { queryConfig: any }) {
  const navigate = useNavigate()
  const location = useLocation()

  const updateQuery = (newParams: any) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ ...queryConfig, ...newParams, page: '1' }).toString()
    })
  }

  const handleClearAll = () => {
    navigate({ pathname: location.pathname })
  }

  const currentSkills = queryConfig.skills ? queryConfig.skills.split(',') : []
  const handleToggleSkill = (skill: string) => {
    let newSkills = [...currentSkills]
    if (newSkills.includes(skill)) newSkills = newSkills.filter((s) => s !== skill)
    else newSkills.push(skill)
    updateQuery({ skills: newSkills.length > 0 ? newSkills.join(',') : undefined })
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-5 sticky top-24 shadow-sm">
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-border">
        <h2 className="font-bold text-base text-text-main flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-text-sub" /> Bộ Lọc
        </h2>
        <button
          onClick={handleClearAll}
          className="text-xs font-semibold text-text-muted hover:text-danger transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      {/* ── Danh mục ── */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm text-text-main mb-3">Lĩnh vực chuyên môn</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              checked={!queryConfig.category}
              onChange={() => updateQuery({ category: undefined })}
              className="w-4 h-4 text-primary bg-page border-border focus:ring-primary"
            />
            <span
              className={`text-sm ${!queryConfig.category ? 'font-bold text-primary' : 'text-text-sub font-medium'}`}
            >
              Tất cả
            </span>
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                checked={queryConfig.category === cat}
                onChange={() => updateQuery({ category: cat })}
                className="w-4 h-4 text-primary bg-page border-border focus:ring-primary"
              />
              <span
                className={`text-sm ${queryConfig.category === cat ? 'font-bold text-primary' : 'text-text-sub hover:text-text-main font-medium'}`}
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ĐÃ XÓA PHẦN BỘ LỌC GIÁ THEO GIỜ Ở ĐÂY */}

      {/* ── Kỹ năng ── */}
      <div className="border-t border-border pt-6">
        <h3 className="font-semibold text-sm text-text-main mb-3">Kỹ năng phổ biến</h3>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => {
            const isChecked = currentSkills.includes(skill)
            return (
              <label key={skill} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={isChecked}
                  onChange={() => handleToggleSkill(skill)}
                />
                <span
                  className={`inline-block px-3 py-1.5 border text-xs font-bold rounded-lg transition-all ${isChecked ? 'bg-indigo-50 border-primary/30 text-primary' : 'bg-page border-border text-text-sub hover:border-gray-300'}`}
                >
                  {skill}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
