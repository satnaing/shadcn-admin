import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import LongText from '@/components/long-text'

export const getUserComponent = (name: string, value: string): React.ReactNode => {
  switch (name) {
    case 'join_at':
      return <Badge variant="outline">{value}</Badge>

    case 'user_status': {
      const isEmployed = value === '현장 실습'

      return (
        <Badge
          variant={isEmployed ? "default" : "destructive"}
          className={cn(
            "font-medium",
            isEmployed
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          )}
        >
          {isEmployed ? "현장 실습" : "미취업"}
        </Badge>
      )
    }

    default:
      return <LongText className='max-w-36'>{String(value)}</LongText>
  }
}