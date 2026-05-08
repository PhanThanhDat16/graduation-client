import { forwardRef } from 'react'
import { formatNumberMoney, parseNumberMoney } from '@/utils/fomatters'

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  onChange?: (value: string) => void
  value?: string | number
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInputInner(
  {
    className,
    errorMessage,
    classNameInput = 'p-2 w-full outline-none border text-sm border-gray-300 focus:border-gray-500 focus:shadow-sm',
    classNameError = 'text-red-500 min-h-[1.5rem] text-xs mt-1',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const raw = parseNumberMoney(event.target.value)
      onChange(raw)
    }
  }

  return (
    <div className={className}>
      <input
        type="text"
        className={classNameInput}
        {...rest}
        value={formatNumberMoney(value)}
        onChange={handleChange}
        ref={ref}
      />
      {errorMessage && <div className={classNameError}>{errorMessage}</div>}
    </div>
  )
})

export default CurrencyInput
