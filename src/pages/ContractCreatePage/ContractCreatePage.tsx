import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowLeft, FileSignature, ShieldCheck, AlertCircle, Briefcase, CheckCircle2 } from 'lucide-react'
import { applicationService } from '@/apis/applicationService'
import { contractService } from '@/apis/contractService'
import { projectService } from '@/apis/projectService'
import { chatService } from '@/apis/chatService'
import { formatBudget } from '@/utils/fomatters'
import Input from '@/components/Input/Input'
import { contractSchema, type ContractSchema } from '@/utils/rules'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/store/useAuthStore'

const PLATFORM_FEE_PERCENTAGE = 0.05

export default function ContractCreatePage() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: appDataRes, isLoading: isAppLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationService.getApplicationById(applicationId as string),
    enabled: !!applicationId
  })

  const appData = appDataRes?.data?.data
  const proposedBudget = appData?.proposedBudget || 0
  const adminFee = proposedBudget * PLATFORM_FEE_PERCENTAGE
  const totalAmount = proposedBudget + adminFee

  const fData = appData?.freelancerId as any
  const fName = typeof fData === 'object' ? fData?.fullName || 'Ứng viên' : 'Ứng viên'

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContractSchema>({
    resolver: yupResolver(contractSchema),
    defaultValues: { contractorTerms: '', deadline: '', agreeToTerms: false }
  })
  console.log(appData)

  // --- GOM TẤT CẢ LOGIC VÀO 1 MUTATION DUY NHẤT ---
  const createContractMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (!appData || !user?._id) throw new Error('Dữ liệu không hợp lệ')
      //Tạo hợp đồng
      const res = await contractService.createContract(payload)
      const newContractId = res.data?.data?._id
      // Cập nhật Application -> 'accepted'
      await applicationService.updateApplicationStatus(applicationId as string, 'accepted')
      // Cập nhật Project -> 'progress'
      const projectId = appData.projectId._id as string
      await projectService.updateProject(projectId, { status: 'progress' })
      return newContractId
    },
    onSuccess: (newContractId) => {
      // Cập nhật lại UI các trang
      queryClient.invalidateQueries({ queryKey: ['project-applications'] })
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] })
      queryClient.invalidateQueries({ queryKey: ['my-projects'] })
      // TẠO BOX CHAT

      //t thêm 3 cái as string cho hết lỗi type, còn cái dưới nớ truyền thiếu nên nó báo lỗi hay ren á
      chatService
        .createGroup({ type: 'contractChat', memberIds: [appData?.freelancerId._id as string, user?._id as string] })
        .then((group) => {
          // Gửi tin nhắn hệ thống vào group chat mới tạo
          chatService.sendMessage(group._id, {
            content: 'Chào bạn! Chúng ta đã tạo một hợp đồng mới.',
            userId: user?._id as string
          })
        })
        .catch((err) => console.error('Lỗi tạo chat:', err))
      // 3. Hiển thị thông báo & Chuyển trang
      toast.success('Khởi tạo hợp đồng thành công! Dự án đã chuyển sang Đang thực hiện.')

      if (newContractId) {
        navigate(`/contracts/${newContractId}`, { replace: true })
      } else {
        navigate(`/contracts`, { replace: true })
      }
    },

    // ── BƯỚC 3: XỬ LÝ KHI THẤT BẠI ──
    onError: () => {
      toast.error('Có lỗi xảy ra khi xử lý hệ thống. Vui lòng thử lại.')
    }
  })

  const onSubmit = (formData: ContractSchema) => {
    if (!appData) return
    const payload = {
      projectId: appData.projectId._id,
      applicationId: appData._id,
      freelancerId: (appData.freelancerId as any)._id,
      contractorTerms: formData.contractorTerms,
      deadline: new Date(formData.deadline).toISOString(),
      totalAmount: proposedBudget,
      adminFee: adminFee,
      freelancerDeposit: 0
    }
    createContractMutation.mutate(payload)
  }

  if (isAppLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Đang chuẩn bị hợp đồng...</p>
      </div>
    )
  }

  if (!appData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy báo giá</h2>
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl mt-4">
          Quay lại
        </button>
      </div>
    )
  }

  if (appData.status === 'accepted') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Hợp đồng đã được tạo!</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          Bạn đã khởi tạo hợp đồng cho báo giá này rồi. Vui lòng kiểm tra trong danh sách hợp đồng của bạn.
        </p>
        <button
          onClick={() => navigate('/contracts')}
          className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl"
        >
          Đến danh sách Hợp đồng
        </button>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen font-body pb-24 text-slate-800">
      <div className="bg-white border-b border-slate-200 sticky top-[64px] z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Bước 1/2: Khởi tạo</p>
            <h1 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-indigo-600" /> Tạo Hợp Đồng & Ký Quỹ
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM NHẬP LIỆU */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="contract-form">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" /> Thông tin cơ bản
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Dự án</p>
                  <p className="font-bold text-slate-900 truncate">
                    {typeof appData.projectId === 'object' ? appData.projectId.title : 'Dự án đang chọn'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Freelancer</p>
                  <p className="font-bold text-slate-900">{fName}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Chi tiết thoả thuận</h2>
              <div className="space-y-4">
                {/* Textarea: Không dùng Component Input vì nó là textarea */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Yêu cầu nghiệm thu / Điều khoản của bạn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="VD: Yêu cầu Freelancer bàn giao đầy đủ source code, tài liệu hướng dẫn..."
                    className={`w-full bg-slate-50 border rounded-xl p-4 text-sm text-slate-900 focus:bg-white focus:ring-1 outline-none resize-none transition-all ${
                      errors.contractorTerms
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 focus:ring-indigo-600 focus:border-indigo-600'
                    }`}
                    {...register('contractorTerms')}
                  />
                  {errors.contractorTerms && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.contractorTerms.message}</p>
                  )}
                </div>

                {/* SỬ DỤNG COMPONENT INPUT CỦA BẠN CHUẨN XÁC NHẤT */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Ngày dự kiến hoàn thành (Deadline) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    name="deadline"
                    register={register}
                    errorMessage={errors.deadline?.message}
                    classNameInput={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:ring-1 outline-none transition-all ${
                      errors.deadline
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 focus:ring-indigo-600 focus:border-indigo-600'
                    }`}
                    classNameError="text-red-500 text-xs mt-1.5 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <ShieldCheck className="w-32 h-32" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-indigo-600" /> Xác nhận Hợp đồng
              </h2>

              <div className="relative z-10">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                    {...register('agreeToTerms')}
                  />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    Tôi đồng ý khởi tạo hợp đồng này. Tôi đã đọc, hiểu và chấp thuận với{' '}
                    <span className="font-bold text-indigo-600">Điều khoản dịch vụ</span> và
                    <span className="font-bold text-indigo-600"> Chính sách Escrow</span> của FreelanceVN.
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.agreeToTerms.message}</p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* BILL THANH TOÁN */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg sticky top-[100px] overflow-hidden">
            <div className="bg-slate-900 p-6 text-white text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tổng giá trị hợp đồng</p>
              <h3 className="text-3xl font-black">{formatBudget(proposedBudget)} ₫</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Báo giá của Freelancer</span>
                <span className="font-bold text-slate-900">{formatBudget(proposedBudget)} ₫</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  Phí nền tảng ({PLATFORM_FEE_PERCENTAGE * 100}%)
                </span>
                <span className="font-bold text-slate-900">{formatBudget(adminFee)} ₫</span>
              </div>

              <div className="h-px bg-slate-100 my-2 w-full border-t border-dashed border-slate-300"></div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="block text-sm font-bold text-slate-900">Tổng cần thanh toán</span>
                  <span className="text-xs text-slate-500">Bao gồm VAT</span>
                </div>
                <span className="text-xl font-black text-emerald-600">{formatBudget(totalAmount)} ₫</span>
              </div>

              <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-emerald-800 leading-relaxed">
                  Khoản tiền này sẽ được giữ an toàn trên ví Escrow. Bạn chưa phải thanh toán ngay lúc này.
                </p>
              </div>

              <button
                type="submit"
                form="contract-form"
                disabled={createContractMutation.isPending}
                className="w-full mt-6 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {createContractMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Lưu & Gửi Hợp Đồng</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
