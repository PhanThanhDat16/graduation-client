import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2Icon, AlertCircle } from 'lucide-react'

import { useAuthStore } from '@/store/useAuthStore'
import { userService } from '@/apis/userService'
import { projectService } from '@/apis/projectService'
import { reviewService } from '@/apis/reviewService'

import ProfileHeader from './components/ProfileHeader'
import ProfileInfo from './components/ProfileInfo'
import ProfileProjects from './components/ProfileProjects'
import ProfileReviews from './components/ProfileReviews'
import EditProfileModal from './components/EditProfileModal'

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showEditModal, setShowEditModal] = useState(false)

  const { user: authUser, loading: authLoading, fetchMe, uploadAvatar, updating } = useAuthStore()

  useEffect(() => {
    if (!authUser && !authLoading) fetchMe()
  }, [authUser, authLoading, fetchMe])

  const isOwner = !id || id === authUser?._id
  const targetProfileId = id || authUser?._id

  // 1. Fetch thông tin Profile
  const {
    data: profileRes,
    isLoading: isProfileLoading,
    isError
  } = useQuery({
    queryKey: ['userProfile', targetProfileId],
    queryFn: () => userService.getUserById(targetProfileId as string),
    enabled: !!targetProfileId,
    staleTime: 1000 * 60 * 5
  })

  const profileData = profileRes?.data?.data

  const displayProfile = useMemo(() => {
    if (!profileData) return null
    if (isOwner && authUser) {
      return { ...profileData, avatar: authUser.avatar, fullName: authUser.fullName }
    }
    return profileData
  }, [profileData, isOwner, authUser])
  // 2. Fetch danh sách Dự án (Chỉ gọi khi Profile này là Khách hàng)
  const { data: projectsRes, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects', 'contractor', profileData?._id],
    queryFn: () => projectService.getProjects({ contractorId: profileData?._id }),
    enabled: !!profileData?._id && profileData.role === 'contractor',
    staleTime: 1000 * 60 * 5
  })

  // 3. Fetch danh sách Đánh giá MÀ HỌ NHẬN ĐƯỢC
  const { data: reviewsRes, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['reviews', 'received', profileData?._id],
    // Sửa `true` thành `'received'` ở đây nè:
    queryFn: () => reviewService.getReviewsByUserId(profileData!._id, 'received'),
    enabled: !!profileData?._id,
    staleTime: 1000 * 60 * 5
  })

  const projects = projectsRes?.data?.data || []
  const reviews = reviewsRes?.data?.data?.received || []

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1 * 1024 * 1024) {
      console.error('Kích thước ảnh tối đa là 1MB (Quy định từ hệ thống)')
      return
    }

    await uploadAvatar(file)
    queryClient.invalidateQueries({ queryKey: ['userProfile', targetProfileId] })
    queryClient.invalidateQueries({ queryKey: ['projects'] })
  }

  if (authLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2Icon className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (isError || !displayProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-4">
        <AlertCircle className="w-12 h-12 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-700">Không tìm thấy hồ sơ</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
        >
          Về trang chủ
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans pb-20">
      <ProfileHeader
        profile={displayProfile}
        isOwner={isOwner}
        updating={updating}
        onAvatarChange={handleAvatarChange}
        onEditClick={() => setShowEditModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <ProfileInfo profile={displayProfile} />

        {/* Chỉ hiện danh sách dự án nếu người này là Khách hàng (Contractor) */}
        {displayProfile?.role === 'contractor' && <ProfileProjects projects={projects} loading={isLoadingProjects} />}

        {/* Luôn hiện danh sách đánh giá (Vì ai cũng có thể được đánh giá) */}
        <ProfileReviews reviews={reviews} loading={isLoadingReviews} />
      </div>
      {showEditModal && <EditProfileModal profile={displayProfile} onClose={() => setShowEditModal(false)} />}
    </div>
  )
}
