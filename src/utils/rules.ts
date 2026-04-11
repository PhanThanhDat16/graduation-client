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
  confirm_password: yup
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

export type AuthSchema = yup.InferType<typeof authSchema>
