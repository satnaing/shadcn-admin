import { useRef, useState } from 'react'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

interface SearchInputProps extends React.ComponentPropsWithRef<typeof Input> {
  onSearch: (text: string) => void
}
export const SearchInput = ({
  className,
  onSearch,
  ...rest
}: SearchInputProps) => {
  const isImeOn = useRef(false) // IME = Input Method Editor, e.g. Japanese keyboard
  const [prevText, setPrevText] = useState('')

  const handleChange = (text: string) => {
    if (prevText === text) return
    if (text === '') {
      // onCompositionEnd may not be called in Chrome when clearing text
      isImeOn.current = false
    } else if (isImeOn.current) {
      return
    }
    setPrevText(text)
    onSearch(text)
  }

  return (
    <Input
      type="search"
      autoFocus
      onChange={(event) => {
        const value = event.currentTarget.value
        handleChange(value)
      }}
      onCompositionStart={() => {
        isImeOn.current = true
      }}
      onCompositionEnd={(e) => {
        isImeOn.current = false
        handleChange((e.target as HTMLInputElement).value)
      }}
      className={cn('h-8 w-[150px] lg:w-[250px]')}
      {...rest}
    />
  )
}
