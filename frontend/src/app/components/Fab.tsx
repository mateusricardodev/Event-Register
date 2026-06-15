import type { ComponentType } from 'react'

interface FabProps {
  icon: ComponentType<{ className?: string }>
  label: string
  onClick: () => void
}

export function Fab({ icon: Icon, label, onClick }: FabProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#14B8A6] text-white shadow-lg shadow-black/40 active:scale-95 transition-transform"
    >
      <Icon className="h-6 w-6" />
    </button>
  )
}
