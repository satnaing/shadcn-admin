import { toast } from 'sonner'

export function showSubmittedData(
  title: string = 'You submitted the following values:'
) {
  toast.message(title, {
    description: (
      // w-[340px]
      <pre className='mt-2 w-full overflow-x-auto rounded-md bg-slate-950 p-4'>
        <code className='text-white'>Done :)</code>
      </pre>
    ),
  })
}
