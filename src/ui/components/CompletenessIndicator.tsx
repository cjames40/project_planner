import { getCompletenessColor } from '@/domain/completeness/score'

const dotColors: Record<string, string> = {
  gray: 'bg-zinc-500',
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
}

interface CompletenessIndicatorProps {
  score: number
}

export function CompletenessIndicator({ score }: CompletenessIndicatorProps) {
  const color = getCompletenessColor(score)
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${dotColors[color]}`}
      title={`Completeness: ${score}%`}
    />
  )
}
