import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface PinInputOgProps {
  /**
   * id for input fields.
   */
  id?: string
  /**
   * Class name for input fields.
   */
  className?: string
  /**
   * Class name for input fields container, `flex gap-2` by default
   */
  containerClassName?: string
  /**
   * Uncontrolled pin input default value.
   */
  defaultValue?: string
  /**
   * Controlled pin input value.
   */
  value?: string
  /**
   * Called when value changes
   */
  onChange?: (value: string) => void
  /**
   * Called when all input have valid value
   */
  onComplete?: (value: string) => void
  /**
   * The type of value pin input should allow, `alphanumeric` by default
   */
  type?: 'numeric' | 'alphanumeric'
  /**
   * Placeholder for input fields, `○` by default
   */
  placeholder?: string
  /**
   * Number of pin input fields, `4` by default
   */
  length?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 // 4 by default
  /**
   * `name` attribute for hidden input
   */
  name?: string
  /**
   * `form` attribute for hidden input
   */
  form?: string
  /**
   * If set, the input's value will be masked just like password input. This field is `false` by default
   */
  mask?: boolean
  /**
   * If set, the pin input component signals to its fields that they should
   * use `autocomplete="one-time-code"`. This field is `false` by default
   */
  otp?: boolean
  /**
   * If set, the input fields are disabled, `false` by default
   */
  disabled?: boolean
  /**
   * If set, the user cannot set the value, `false` by default
   */
  readOnly?: boolean
  /**
   * If set, the pin input receives focus on mount, `false` by default
   */
  autoFocus?: boolean
  /**
   * `aria-label` for the input fields
   */
  ariaLabel?: string
}

const PinInputOg = ({
  containerClassName,
  id,
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
}: PinInputOgProps) => {
  if (length < 1 || length > 12) {
    throw new Error('input length cannot be more than 12 or less than 1')
  }

  if ((value !== undefined && !onChange) || (value === undefined && onChange)) {
    throw new Error(
      'if one of value or onChange is specified, both props must be set.'
    )
  }

  const { pins, pinValue, refMap, ...handlers } = usePinInput({
    value,
    defaultValue,
    placeholder,
    type,
    length,
    readOnly,
  })

  /* call onChange func if pinValue changes */
  React.useEffect(() => {
    onChange && onChange(pinValue)
  }, [onChange, pinValue])

  /* call onComplete func if pinValue is valid and completed */
  React.useEffect(() => {
    if (onComplete && pinValue.length === length) {
      onComplete(pinValue)
    }
  }, [length, onComplete, pinValue])

  /* focus on first input field if autoFocus is set */
  React.useEffect(() => {
    if (!autoFocus) return
    const node = refMap?.get(0)
    if (node) {
      node.focus()
    }
  }, [autoFocus, refMap])

  return (
    <div className={cn('flex gap-2', containerClassName)}>
      {pins.map((pin, i) => (
        <PinInputField
          key={i}
          id={i === 0 ? id : undefined}
          defaultValue={pin}
          onChange={(e) => handlers.handleChange(e, i)}
          onFocus={(e) => handlers.handleFocus(e, i)}
          onBlur={() => handlers.handleBlur(i)}
          onKeyDown={(e) => handlers.handleKeyDown(e, i)}
          onPaste={handlers.handlePaste}
          placeholder={placeholder}
          className={className}
          type={type}
          mask={mask}
          autoComplete={otp ? 'one-time-code' : 'off'}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={ariaLabel}
          ref={(node) => {
            if (node) {
              refMap?.set(i, node)
            } else {
              refMap?.delete(i)
            }
          }}
        />
      ))}
      <input type='hidden' name={name} form={form} value={pinValue} />
    </div>
  )
}
PinInputOg.displayName = 'PinInputOg'

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

/* ========== usePinInput custom hook ========== */

interface UsePinInputProps {
  value: string | undefined
  defaultValue: string | undefined
  placeholder: string
  type: 'numeric' | 'alphanumeric'
  length: number
  readOnly: boolean
}

const usePinInput = ({
  value,
  defaultValue,
  placeholder,
  type,
  length,
  readOnly,
}: UsePinInputProps) => {
  const pinInputs = Array.from({ length }, (_, index) =>
    defaultValue ? defaultValue.charAt(index) : value ? value.charAt(index) : ''
  )
  const [pins, setPins] = React.useState<(string | number)[]>(pinInputs)
  const pinValue = pins.join('').trim()

  const itemsRef = React.useRef<Map<number, HTMLInputElement> | null>(null)

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map()
    }
    return itemsRef.current
  }

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

  function handleFocus(
    event: React.FocusEvent<HTMLInputElement>,
    index: number
  ) {
    event.target.select()
    focusInput(index)
  }

  function handleBlur(index: number) {
    const node = getNode(index)
    if (node) {
      node.placeholder = placeholder
    }
  }

  function updateInputField(val: string, index: number) {
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

  function validate(value: string) {
    const NUMERIC_REGEX = /^[0-9]+$/
    const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/i
    const regex = type === 'alphanumeric' ? ALPHA_NUMERIC_REGEX : NUMERIC_REGEX
    return regex.test(value)
  }

  const pastedVal = React.useRef<null | string>(null)
  function handleChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const inputValue = e.target.value
    const pastedValue = pastedVal.current
    const inputChar = pastedValue
      ? pastedValue.charAt(length - 1)
      : inputValue.slice(-1)

    if (validate(inputChar)) {
      updateInputField(inputChar, index)
      pastedVal.current = null
      if (inputValue.length > 0) {
        focusInput(index + 1)
      }
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const copyValue = event.clipboardData
      .getData('text/plain')
      .replace(/[\n\r\s]+/g, '')
    const copyArr = copyValue.split('').slice(0, length)

    const isValid = copyArr.every((c) => validate(c))

    if (!isValid) return

    for (let i = 0; i < length; i++) {
      if (i < copyArr.length) {
        updateInputField(copyArr[i], i)
      }
    }

    pastedVal.current = copyValue
    focusInput(copyArr.length < length ? copyArr.length : length - 1)
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    const { ctrlKey, key, shiftKey, metaKey } = event

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

      if (!canTypeSign || readOnly) {
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
      updateInputField('', index)
      if ((event.target as HTMLInputElement).value === '') {
        focusInput(index - 1)
      }
    }
  }

  return {
    pins,
    pinValue,
    refMap: getMap(),
    handleFocus,
    handleBlur,
    handleChange,
    handlePaste,
    handleKeyDown,
  }
}

export { PinInputOg }
