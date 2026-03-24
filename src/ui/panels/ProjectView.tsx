import { useCallback, useRef, useEffect } from 'react'
import { PlanPanel } from './plan/PlanPanel'
import { ChatPanel } from './chat/ChatPanel'
import { useUIStore } from '@/stores'

export function ProjectView() {
  const { splitRatio, setSplitRatio } = useUIStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const handleMouseDown = useCallback(() => {
    dragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const ratio = (e.clientX - rect.left) / rect.width
      setSplitRatio(ratio)
    }

    const handleMouseUp = () => {
      dragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [setSplitRatio])

  return (
    <div ref={containerRef} className="flex h-full">
      <div style={{ width: `${splitRatio * 100}%` }} className="h-full overflow-hidden">
        <PlanPanel />
      </div>

      <div
        onMouseDown={handleMouseDown}
        className="flex w-1.5 cursor-col-resize items-center justify-center bg-zinc-800 hover:bg-zinc-700"
      >
        <div className="h-8 w-0.5 rounded bg-zinc-600" />
      </div>

      <div style={{ width: `${(1 - splitRatio) * 100}%` }} className="h-full overflow-hidden">
        <ChatPanel />
      </div>
    </div>
  )
}
