'use client'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  Plus,
  Tag,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { useProjectStore } from '@/store/useProjectStore'
import type { IProject, IUpdateProjectBody, ProjectStatus } from '@/types/project'

// ─── Status Badge Helper ─────────────────────────────────────────────────────
const STATUS_CFG: Record<ProjectStatus, { label: string; bg: string; text: string; border: string }> = {
  open: { label: 'Đang tuyển', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  draft: { label: 'Nháp', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
  closed: { label: 'Đã đóng', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' }
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditProjectModal({
  project,
  onClose,
  onSave
}: {
  project: IProject
  onClose: () => void
  onSave: (id: string, body: IUpdateProjectBody) => Promise<void>
}) {
  const { loading } = useProjectStore()
  const [form, setForm] = useState<IUpdateProjectBody & { budgetMinStr: string; budgetMaxStr: string }>({
    title: project.title,
    description: project.description,
    category: project.category,
    skills: [...project.skills],
    budgetMin: project.budgetMin,
    budgetMax: project.budgetMax,
    status: project.status,
    budgetMinStr: String(project.budgetMin),
    budgetMaxStr: String(project.budgetMax)
  })
  const [skillInput, setSkillInput] = useState('')

  const handleAddSkill = (s: string) => {
    if (s && !form.skills?.includes(s)) {
      setForm((p) => ({ ...p, skills: [...(p.skills || []), s] }))
      setSkillInput('')
    }
  }

  const handleSubmit = async () => {
    await onSave(project._id, {
      title: form.title,
      description: form.description,
      category: form.category,
      skills: form.skills,
      budgetMin: Number(form.budgetMinStr),
      budgetMax: Number(form.budgetMaxStr),
      status: form.status
    })
    onClose()
  }

  const CATEGORIES = ['Lập trình Web', 'Mobile App', 'UI/UX Design', 'Marketing', 'Viết lách & Dịch thuật', 'Data / AI']

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-lg text-slate-900">Chỉnh sửa dự án</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Tên dự án</label>
            <input
              value={form.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Danh mục</label>
            <select
              value={form.category || ''}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Mô tả</label>
            <textarea
              rows={5}
              value={form.description || ''}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Ngân sách tối thiểu (₫)</label>
              <input
                type="number"
                value={form.budgetMinStr}
                onChange={(e) => setForm((p) => ({ ...p, budgetMinStr: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Ngân sách tối đa (₫)</label>
              <input
                type="number"
                value={form.budgetMaxStr}
                onChange={(e) => setForm((p) => ({ ...p, budgetMaxStr: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Trạng thái</label>
            <div className="flex gap-3">
              {(['open', 'draft', 'closed'] as ProjectStatus[]).map((s) => (
                <label
                  key={s}
                  className={`flex-1 border rounded-xl p-3 cursor-pointer text-center text-sm font-semibold transition-all ${form.status === s ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  <input
                    type="radio"
                    name="edit-status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => setForm((p) => ({ ...p, status: s }))}
                    className="sr-only"
                  />
                  {STATUS_CFG[s].label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Kỹ năng</label>
            <div className="flex gap-2 mb-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(skillInput))}
                placeholder="Thêm kỹ năng..."
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="bg-slate-800 text-white px-4 rounded-xl font-bold text-sm hover:bg-slate-700"
              >
                Thêm
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills?.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg"
                >
                  {s}
                  <button
                    onClick={() => setForm((p) => ({ ...p, skills: (p.skills || []).filter((x) => x !== s) }))}
                    className="hover:text-red-500 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 text-sm"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 text-sm flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({
  projectTitle,
  onClose,
  onConfirm
}: {
  projectTitle: string
  onClose: () => void
  onConfirm: () => void
}) {
  const { loading } = useProjectStore()
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="font-bold text-xl text-slate-900 mb-2">Xác nhận xóa dự án</h3>
        <p className="text-sm text-slate-500 mb-6">
          Bạn có chắc chắn muốn xóa <strong>"{projectTitle}"</strong>? Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 text-sm"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Xóa dự án
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManageProjectsPage() {
  const { myProjects, myProjectsLoading, fetchMyProjects, updateProject, deleteProject } = useProjectStore()

  const [activeTab, setActiveTab] = useState('all')
  const [editingProject, setEditingProject] = useState<IProject | null>(null)
  const [deletingProject, setDeletingProject] = useState<IProject | null>(null)

  useEffect(() => {
    fetchMyProjects()
  }, [fetchMyProjects])

  const formatMoney = (amount: number) => amount.toLocaleString('vi-VN')

  const timeAgo = (iso: string) => {
    const diff = new Date().getTime() - new Date(iso).getTime()

    const m = Math.floor(diff / 60000)
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)

    if (m < 60) return `${m} phút trước`
    if (h < 24) return `${h} giờ trước`
    return `${d} ngày trước`
  }

  const counts = {
    all: myProjects.length,
    open: myProjects.filter((p) => p.status === 'open').length,
    draft: myProjects.filter((p) => p.status === 'draft').length,
    closed: myProjects.filter((p) => p.status === 'closed').length
  }

  const filtered = myProjects.filter((p) => activeTab === 'all' || p.status === activeTab)

  const handleSave = async (id: string, body: IUpdateProjectBody) => {
    await updateProject(id, body)
  }

  const handleDelete = async () => {
    if (!deletingProject) return
    const ok = await deleteProject(deletingProject._id)
    if (ok) setDeletingProject(null)
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (myProjectsLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Đang tải dự án của bạn...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] font-body">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-slate-900 mb-1">Dự án của tôi</h1>
            <p className="text-sm text-slate-500">Quản lý và theo dõi tất cả dự án bạn đã đăng.</p>
          </div>
          <Link
            to="/post-project"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Đăng dự án mới
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-200/50 p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
          {(
            [
              { key: 'all', label: `Tất cả (${counts.all})` },
              { key: 'open', label: `Đang mở (${counts.open})` },
              { key: 'draft', label: `Nháp (${counts.draft})` },
              { key: 'closed', label: `Đã đóng (${counts.closed})` }
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-bold mb-1">Không có dự án nào</p>
            <p className="text-slate-500 text-sm mb-6">Bắt đầu bằng cách đăng dự án đầu tiên của bạn</p>
            <Link
              to="/post-project"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Đăng dự án mới
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((project) => {
              const cfg = STATUS_CFG[project.status]
              return (
                <div
                  key={project._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    {/* Info */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Link
                          to={`/projects/${project._id}`}
                          className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors"
                        >
                          {project.title}
                        </Link>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          {cfg.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                          <Tag className="w-3 h-3" /> {project.category}
                        </span>
                        {project.skills.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                        {project.skills.length > 4 && (
                          <span className="text-[11px] text-slate-400">+{project.skills.length - 4} khác</span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          {formatMoney(project.budgetMin)} – {formatMoney(project.budgetMax)} ₫
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> Cập nhật {timeAgo(project.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" /> {project.likes} lượt quan tâm
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="w-full lg:w-auto flex flex-col gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-5 lg:pt-0 lg:pl-6 lg:min-w-[160px]">
                      <Link
                        to={`/projects/${project._id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> Xem dự án
                      </Link>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex justify-center items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" /> Sửa
                        </button>
                        <button
                          onClick={() => setDeletingProject(project)}
                          className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex justify-center items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      {editingProject && (
        <EditProjectModal project={editingProject} onClose={() => setEditingProject(null)} onSave={handleSave} />
      )}
      {deletingProject && (
        <DeleteConfirmModal
          projectTitle={deletingProject.title}
          onClose={() => setDeletingProject(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
