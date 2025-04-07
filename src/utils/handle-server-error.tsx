import { AxiosError } from 'axios'
import { PostgrestError } from '@supabase/supabase-js'
import postgrestErrorCodes from '@/utils/postgrestErrorCodes.json'
import { toast } from '@/hooks/use-toast'
import CodeBlock from '@/components/code-block'

export function handleServerError(error: unknown) {
  // eslint-disable-next-line no-console
  console.log(error)

  let errTitle = '알 수 없는 오류가 발생했습니다.'
  let errDescription = '나중에 다시 시도해주십시오.'

  if (error && typeof error === 'object' && 'message' in error) {
    errDescription = error.message as string
  }

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errTitle = 'Content not found.'
  }

  if (error instanceof AxiosError) {
    errTitle = error.response?.data.title
  }

  if (error instanceof PostgrestError) {
    errTitle = 'DB 트랜젝션 중 예외 발생'
    errDescription = error.message
    if (error.code in postgrestErrorCodes) {
      errTitle += `: ${postgrestErrorCodes[error.code as keyof typeof postgrestErrorCodes]}`
    }
  }

  toast({
    variant: 'destructive',
    title: errTitle,
    description: <CodeBlock>{errDescription}</CodeBlock>,
  })
}
