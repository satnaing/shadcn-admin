import { Button } from '@/components/custom/button'

export function Rate() {
  return (
    <>
      {Array.from(Array(5), (_, index) => (
        <Button type='button' className='bg-primary' onClick={() => {}}>
          {index + 1}
        </Button>
      ))}
    </>
  )
}
