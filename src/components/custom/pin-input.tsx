import * as React from 'react'
/**

- remove placeholder when focus ✅
- has <input type="hidden" value="" />
- pastable
- typing must focus on next input
- back button must focus on prev input

Types: alphanumeric or number 
Alphanumeric => type="text" inputmode="text" 
Number => type="tel" inputmode="numeric"
autocomplete="one-time-code"
placeholder="○"
mask
length=4
 */

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/**
interface PinInputProps {
  type?: 'numeric' | 'alphanumeric' // default numeric
  mask?: boolean // default false 
  defaultValue?: string // default ''
  value?: string 
  onChange?: (value: string) => void
  onComplete?: ((value: string) => void)
  otp?: boolean // default false
  placeholder?: string // default '○'
  variant?: "outline" | "flushed" | "filled" | "unstyled"
  ariaLabel?: string 
  disabled?: boolean
  error?: boolean // If set, adds error styles and aria-invalid attribute to all inputs
  gap?: string
  length?: number // 4 by default
}
 */

interface PinInputProps {
  className?: string
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  type?: 'numeric' | 'alphanumeric' // default alphanumeric
  placeholder?: string // default '○'
  length?: number // 4 by default
  name?: string
  form?: string
  mask?: boolean // false by default
  otp?: boolean // false by default
  disabled?: boolean // false by default
  readOnly?: boolean // false by default
  autoFocus?: boolean // false by default
  ariaLabel?: string
}

const PinInput = ({
  className,
  type = 'alphanumeric',
  placeholder = '○',
  length = 4,
  name,
  form,
  defaultValue,
  value,
  onChange,
  onComplete,
  mask = false,
  otp = false,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  ariaLabel,
}: PinInputProps) => {
  const itemsRef = React.useRef<Map<number, HTMLInputElement> | null>(null)

  if (length > 12) {
    throw new Error('input length cannot be more than 12')
  }

  if ((value !== undefined && !onChange) || (value === undefined && onChange)) {
    throw new Error(
      'if one of value or onChange is specified, both props must be set.'
    )
  }

  const pinInputs = Array.from({ length }, (_, index) =>
    defaultValue ? defaultValue.charAt(index) : value ? value.charAt(index) : ''
  )

  const [pins, setPins] = React.useState<(string | number)[]>(pinInputs)
  const pinValue = pins.join('').trim()

  React.useEffect(() => {
    onChange && onChange(pinValue)
  }, [onChange, pinValue])

  React.useEffect(() => {
    if (onComplete && pinValue.length === length) {
      onComplete(pinValue)
    }
  }, [length, onComplete, pinValue])

  React.useEffect(() => {
    if (!autoFocus) return
    const map = getMap()
    const node = map?.get(0)
    if (node) {
      node.focus()
    }
  }, [autoFocus])

  function getNode(index: number) {
    const map = getMap()
    const node = map?.get(index)
    return node
  }

  function focusInput(itemId: number) {
    const node = getNode(itemId)
    if (node) {
      node.focus()
      node.placeholder = ''
    }
  }

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map()
    }
    return itemsRef.current
  }

  const handleFocus = (
    event: React.FocusEvent<HTMLInputElement>,
    index: number
  ) => {
    event.target.select()
    focusInput(index)
  }

  const handleBlur = (index: number) => {
    const node = getNode(index)
    if (node) {
      node.placeholder = placeholder
    }
  }

  const setInputField = (val: string, index: number) => {
    const node = getNode(index)

    if (node) {
      node.value = val
    }

    setPins((prev) =>
      prev.map((p, i) => {
        if (i === index) {
          return val
        } else {
          return p
        }
      })
    )
  }

  const pastedVal = React.useRef<null | string>(null)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const inputValue = e.target.value
    const pastedValue = pastedVal.current
    const inputChar = pastedValue
      ? pastedValue.charAt(length - 1)
      : inputValue.slice(-1)

    if (validate(inputChar)) {
      setInputField(inputChar, index)
      pastedVal.current = null
      if (inputValue.length > 0) {
        focusInput(index + 1)
      }
    }
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const { ctrlKey, key, shiftKey, metaKey } = event
    // const inputValue = (target as HTMLInputElement).value

    if (type === 'numeric') {
      const canTypeSign =
        key === 'Backspace' ||
        key === 'Tab' ||
        key === 'Control' ||
        key === 'Delete' ||
        (ctrlKey && key === 'v') ||
        (metaKey && key === 'v')
          ? true
          : !Number.isNaN(Number(key))

      if (!canTypeSign) {
        event.preventDefault()
      }
    }

    if (key === 'ArrowLeft' || (shiftKey && key === 'Tab')) {
      event.preventDefault()
      focusInput(index - 1)
    } else if (key === 'ArrowRight' || key === 'Tab' || key === ' ') {
      event.preventDefault()
      focusInput(index + 1)
    } else if (key === 'Delete') {
      event.preventDefault()
    } else if (key === 'Backspace') {
      event.preventDefault()
      setInputField('', index)
      if ((event.target as HTMLInputElement).value === '') {
        focusInput(index - 1)
      } else {
        // focusInputField('prev', index)
        // focusInput(index - +1)
      }
    }
    // else if (metaKey && key === 'v') {
    //   // console.log('inputValue', inputValue)
    //   // setInputField(inputValue.slice(-1), index)
    // }
    // else if (ctrlKey && key === 'v') {
    //   for (let index = 0; index < INPUT_LENGTH; index++) {
    //     setInputField('f', index)
    //   }
    // }
    // else if (inputValue.length > 0) {
    //   //  && key === _value[index]
    //   // event.preventDefault()
    //   // focusInputField('next', index)
    //   focusInput(index + 1)
    // }
  }

  function validate(value: string) {
    const NUMERIC_REGEX = /^[0-9]+$/
    const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/i
    const regex = type === 'alphanumeric' ? ALPHA_NUMERIC_REGEX : NUMERIC_REGEX
    return regex.test(value)
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const copyValue = event.clipboardData
      .getData('text/plain')
      .replace(/[\n\r\s]+/g, '')
    const copyArr = copyValue.split('').slice(0, length)

    const isValid = copyArr.every((c) => validate(c))

    if (!isValid) return

    for (let i = 0; i < length; i++) {
      if (i < copyArr.length) {
        setInputField(copyArr[i], i)
      }
    }

    pastedVal.current = copyValue
    focusInput(length - 1)
  }

  return (
    <div className='flex gap-2'>
      {pins.map((pin, i) => (
        <PinInputField
          key={i}
          defaultValue={pin}
          onChange={(e) => handleChange(e, i)}
          onFocus={(e) => handleFocus(e, i)}
          onBlur={() => handleBlur(i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          placeholder={placeholder}
          className={className}
          type={type}
          mask={mask}
          autoComplete={otp ? 'one-time-code' : 'off'}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={ariaLabel}
          ref={(node) => {
            const map = getMap()
            if (node) {
              map?.set(i, node)
            } else {
              map?.delete(i)
            }
          }}
        />
      ))}
      <input type='hidden' name={name} form={form} value={pinValue} />
    </div>
  )
}
PinInput.displayName = 'PinInput'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: boolean
}

const PinInputField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, mask, ...props }, ref) => {
    const inputType = mask ? 'password' : type === 'numeric' ? 'tel' : 'text'
    return (
      <Input
        ref={ref}
        type={inputType}
        inputMode={type === 'numeric' ? 'numeric' : 'text'}
        className={cn('size-10 text-center', className)}
        {...props}
      />
    )
  }
)

export { PinInput }
