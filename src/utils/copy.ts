import { useCallback, useState } from 'react'

export function useCopyToast() {
  const [visible, setVisible] = useState(false)

  const trigger = useCallback(() => {
    setVisible(true)
    setTimeout(() => setVisible(false), 2000)
  }, [])

  return { visible, trigger }
}
