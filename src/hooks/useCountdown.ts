import { useState, useEffect } from 'react'

export function useCountdown(targetDateStr?: string) {
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!targetDateStr) return

    const targetTime = new Date(targetDateStr).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetTime - now

      if (distance <= 0) {
        clearInterval(interval)
        setTimeLeft({ minutes: 0, seconds: 0 })
        setIsExpired(true)
      } else {
        // Tính toán phút và giây còn lại
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ minutes, seconds })
        setIsExpired(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDateStr])

  return {
    minutes: timeLeft.minutes.toString().padStart(2, '0'),
    seconds: timeLeft.seconds.toString().padStart(2, '0'),
    isExpired
  }
}
