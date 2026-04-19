export const timeAgo = (isoString: string) => {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}

export const formatBudget = (num: number | undefined) => {
  if (!num) return 'Thỏa thuận'
  if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return num.toLocaleString('vi-VN')
}

export const isHot = (project: any) => {
  if (!project.createdAt) return false
  const hoursSincePosted = (Date.now() - new Date(project.createdAt).getTime()) / 3600000
  return (project.likes || 0) >= 10 && hoursSincePosted <= 48
}
