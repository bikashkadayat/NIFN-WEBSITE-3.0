import { format } from 'date-fns'

interface LastUpdatedProps {
  date: string
}

export function LastUpdated({ date }: LastUpdatedProps) {
  const formatted = format(new Date(date), 'MMMM d, yyyy')
  return (
    <p className="text-sm text-gray-400 mt-12 pt-6 border-t border-gray-100">
      Last updated: {formatted}
    </p>
  )
}
