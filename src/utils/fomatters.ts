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
  return num.toLocaleString('vi-VN')
}

export const formatNumberMoney = (value: string | number) => {
  const number = String(value).replace(/\D/g, '')
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const parseNumberMoney = (value: string | number) => {
  return String(value).replace(/\D/g, '')
}

export const isHot = (project: any) => {
  if (!project.createdAt) return false
  const hoursSincePosted = (Date.now() - new Date(project.createdAt).getTime()) / 3600000
  return (project.likes || 0) >= 10 && hoursSincePosted <= 48
}
