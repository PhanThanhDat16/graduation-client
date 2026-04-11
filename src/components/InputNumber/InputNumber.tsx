import { forwardRef } from 'react'

export interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    className,
    errorMessage,
    classNameInput = 'p-2 w-full outline-none border text-sm border-gray-300 focus:border-gray-500 focus:shadow-sm',
    classNameError = ' text-red-500 min-h-[1.5rem] text-xs mt-1',
    onChange,
    // gán value là chuỗi rỗng tránh trường hợp truyền value vào là undefine
    value = '',
    ...rest
  },
  ref
) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} value={value} onChange={handleChange} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})
export default InputNumber
