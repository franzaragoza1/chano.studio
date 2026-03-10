'use client'

import { useEffect, useRef } from 'react'

export default function Watermark() {
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    const onScroll = () => {
      const offset = window.scrollY * 0.12
      el.style.transform = `translate(-50%, calc(-50% + ${offset}px))`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="watermark" aria-hidden="true">
      <div className="watermark-inner" ref={innerRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logotipo_chano2background.png" alt="" />
      </div>
    </div>
  )
}
