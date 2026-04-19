import { Link } from 'react-router-dom'
import { Heart, Clock, DollarSign } from 'lucide-react'
import ContractorInfo from '@/components/ContractorInfo/ContractorInfo'
import { formatBudget, isHot, timeAgo } from '@/utils/fomatters'

// Note: Replace with your actual User type if available
const CURRENT_USER = { _id: 'user_me_123' }

interface ProjectCardProps {
  project: any // Consider replacing 'any' with your Project interface (e.g., Project)
  onToggleLike: (projectId: string) => void
}

export default function ProjectCard({ project, onToggleLike }: ProjectCardProps) {
  const isLiked = project.listLike?.includes(CURRENT_USER._id)
  const hot = isHot(project)

  return (
    <div className="bg-white border border-border rounded-2xl p-6 relative flex flex-col shadow-sm group hover:shadow-md transition-shadow">
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${hot ? 'bg-accent' : 'bg-transparent group-hover:bg-primary'}`}
      ></div>

      <div className="flex justify-between items-start mb-4 gap-4">
        <ContractorInfo contractorId={project.contractorId} />
        <div className="flex gap-2">
          {hot && <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold">🔥 Nổi bật</span>}
          <button
            onClick={() => onToggleLike(project._id)}
            className="p-2 border rounded-xl hover:bg-page transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-text-muted'}`} />
          </button>
        </div>
      </div>

      <Link to={`/projects/${project._id}`} className="mb-3 block">
        <h2 className="font-extrabold text-lg text-primary line-clamp-1 hover:text-accent transition-colors">
          {project.title}
        </h2>
      </Link>

      <div className="flex flex-wrap gap-2 mb-3">
        {project.skills?.map((skill: string) => (
          <span key={skill} className="px-3 py-1 bg-page border text-[11px] font-bold rounded-full text-text-sub">
            {skill}
          </span>
        ))}
      </div>

      <p className="text-sm text-text-sub line-clamp-2 flex-grow mb-6">{project.description}</p>

      <div className="h-px bg-border mb-4"></div>

      <div className="flex justify-between items-center gap-4 mt-auto">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex gap-1.5 items-center font-bold text-emerald-600 text-sm">
            <DollarSign className="w-4 h-4" />
            {formatBudget(project.budgetMin)} {project.budgetMax ? `- ${formatBudget(project.budgetMax)}` : ''} ₫
          </div>
          <div className="flex gap-1.5 items-center text-xs text-text-sub font-medium">
            <Clock className="w-4 h-4" /> {timeAgo(project.createdAt)}
          </div>
        </div>
        <Link
          to={`/projects/${project._id}`}
          className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shrink-0"
        >
          Gửi Báo Giá
        </Link>
      </div>
    </div>
  )
}