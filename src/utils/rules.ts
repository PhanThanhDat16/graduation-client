import * as yup from 'yup'

const today = new Date()
const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
const maxAgeDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
export const authSchema = yup.object({
  email: yup
    .string()
    .required('Email là bẳt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài phải từ 5 - 160 ký tự')
    .max(160, 'Độ dài phải từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Password là bẳt buộc')
    .min(5, 'Độ dài phải từ 8 ký tự')
    .matches(/[a-z]/, 'Phải có chữ thường')
    .matches(/[A-Z]/, 'Phải có chữ in hoa')
    .matches(/[0-9]/, 'Phải có số')
    .matches(/[^a-zA-Z0-9]/, 'Phải có ký tự đặc biệt')
    .max(160, 'Độ dài tối đa 50 ký tự'),
  confirmPassword: yup
    .string()
    .required('Nhập lại password là bẳt buộc')
    .oneOf([yup.ref('password')], 'Nhập lại password không khớp'),
  fullName: yup.string().required('Họ tên và bắt buộc').default('').max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/, 'SĐT phải 10-11 số'),
  address: yup.string().default('').max(160, 'Độ dài tối đa là 160 ký tự'),
  birthday: yup
    .date()
    .typeError('Vui lòng chọn ngày sinh')
    // .default(new Date(1990, 1, 1))
    .required('Vui lòng chọn ngày sinh')
    .max(minAgeDate, 'Bạn phải đủ ít nhất 18 tuổi')
    .min(maxAgeDate, 'Ngày sinh quá xa, vui lòng kiểm tra lại'),
  gender: yup.string().required('Giới tính là bắt buộc').oneOf(['female', 'male', 'other'], 'Giới tính không hợp lệ'),
  role: yup.string().required('Vui lòng chọn Rule').oneOf(['freelancer', 'contractor'], 'Role không hợp lệ'),
  avatar: yup.string().default('').max(1000, 'Độ dài tối đa là 1000 ký tự')
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { budgetMin, budgetMax } = this.parent
  if (budgetMin === '' || budgetMax === '') {
    return true
  }
  return Number(budgetMax) >= Number(budgetMin)
}
export const schema = yup.object({
  budgetMin: yup.string().default('').test({
    name: 'price-not-allowed',
    message: 'Giá cả không phù hợp',
    test: testPriceMinMax
  }),
  budgetMax: yup.string().default('').test({
    name: 'price-not-allowed',
    message: 'Giá cả không phù hợp',
    test: testPriceMinMax
  })
})
export const proposalSchema = yup.object({
  proposedBudget: yup
    .number()
    .typeError('Vui lòng nhập số tiền hợp lệ')
    .required('Bắt buộc nhập giá')
    .min(1000, 'Giá tối thiểu từ 100,000đ'),
  duration: yup.string().required('Vui lòng chọn thời gian dự kiến'),
  proposal: yup
    .string()
    .required('Vui lòng viết thư chào giá')
    .min(100, 'Thư chào giá nên chi tiết một chút (ít nhất 100 ký tự)')
    .max(5000, 'Tối đa 5000 ký tự')
})
export const projectSchema = yup.object({
  title: yup.string().required('Vui lòng nhập tên dự án').min(10, 'Tên dự án phải có ít nhất 10 ký tự'),
  category: yup.string().required('Vui lòng chọn danh mục công việc'),
  description: yup.string().required('Vui lòng nhập mô tả dự án').min(50, 'Mô tả phải có ít nhất 50 ký tự'),
  skills: yup
    .array()
    .of(yup.string().required())
    .required('Vui lòng chọn kỹ năng')
    .min(1, 'Vui lòng chọn ít nhất 1 kỹ năng'),
  budgetMin: yup.string().required('Bắt buộc nhập giá tối thiểu').test({
    name: 'price-not-allowed',
    message: 'Ngân sách tối thiểu không hợp lệ',
    test: testPriceMinMax
  }),
  budgetMax: yup.string().required('Bắt buộc nhập giá tối đa').test({
    name: 'price-not-allowed',
    message: 'Ngân sách tối đa phải lớn hơn hoặc bằng tối thiểu',
    test: testPriceMinMax
  })
})
export const contractSchema = yup
  .object({
    contractorTerms: yup
      .string()
      .required('Vui lòng nhập điều khoản hợp đồng')
      .min(50, 'Điều khoản cần chi tiết hơn (ít nhất 50 ký tự)'),
    deadline: yup.string().required('Vui lòng chọn ngày nghiệm thu dự kiến'),
    agreeToTerms: yup
      .boolean()
      .required('Bạn phải đồng ý với chính sách của hệ thống')
      .oneOf([true], 'Bạn phải đồng ý với chính sách của hệ thống')
  })
  .required()

export const profileSchema = yup
  .object({
    fullName: yup.string().required('Họ tên và bắt buộc').default('').max(160, 'Độ dài tối đa là 160 ký tự'),
    phone: yup
      .string()
      .required('Số điện thoại là bắt buộc')
      .matches(/^[0-9]{10,11}$/, 'SĐT phải 10-11 số'),
    address: yup.string().default('').max(160, 'Độ dài tối đa là 160 ký tự'),
    birthday: yup
      .date()
      .typeError('Vui lòng chọn ngày sinh')
      // .default(new Date(1990, 1, 1))
      .required('Vui lòng chọn ngày sinh')
      .max(minAgeDate, 'Bạn phải đủ ít nhất 18 tuổi')
      .min(maxAgeDate, 'Ngày sinh quá xa, vui lòng kiểm tra lại'),
    gender: yup.string().required('Giới tính là bắt buộc').oneOf(['female', 'male', 'other'], 'Giới tính không hợp lệ'),
    avatar: yup.string().default('').max(1000, 'Độ dài tối đa là 1000 ký tự'),
    description: yup.string().max(500, 'Giới thiệu không vượt quá 500 ký tự').optional()
  })
  .required()

export type AuthSchema = yup.InferType<typeof authSchema>
export type Schema = yup.InferType<typeof schema>
export type ProposalSchema = yup.InferType<typeof proposalSchema>
export type ProjectSchema = yup.InferType<typeof projectSchema>
export type ContractSchema = yup.InferType<typeof contractSchema>
export type ProfileSchema = yup.InferType<typeof profileSchema>
