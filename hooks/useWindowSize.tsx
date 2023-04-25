import { useEffect, useState } from 'react'

export default function useWindowSize() {
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}
