import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  rule?: RegisterOptions
  errorMessage?: string
  register?: UseFormRegister<any>
  classNameInput?: string
  classNameError?: string
}

export default function Input({
  className,
  name,
  rule,
  errorMessage,
  classNameInput = 'p-2 w-full outline-none border text-sm border-gray-300 focus:border-gray-500 focus:shadow-sm',
  classNameError = 'text-red-500 min-h-[1.5rem] text-xs mt-1',
  register,
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rule) : null
  return (
    <div className={className}>
      <input className={classNameInput} {...registerResult} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
