interface BadgeProps {
  label: string
  color?: 'red' | 'amber' | 'green' | 'blue' | 'gray' | 'purple'
}

const colorClasses: Record<string, string> = {
  red: 'bg-red-900/50 text-red-300 border-red-700',
  amber: 'bg-amber-900/50 text-amber-300 border-amber-700',
  green: 'bg-green-900/50 text-green-300 border-green-700',
  blue: 'bg-blue-900/50 text-blue-300 border-blue-700',
  gray: 'bg-zinc-800 text-zinc-400 border-zinc-600',
  purple: 'bg-purple-900/50 text-purple-300 border-purple-700',
}

export function Badge({ label, color = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${colorClasses[color]}`}>
      {label}
    </span>
  )
}
