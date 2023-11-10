import { useEffect, useState } from 'react'

// A custom version of useState that can debounce itself
export function useDebouncedState(
  value: string,
  delay: number = 500
): [string, React.Dispatch<React.SetStateAction<string>>, string, boolean] {
  const [internalValue, setInternalValue] = useState(value),
    [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(internalValue), delay)
    return () => clearTimeout(handler)
  }, [internalValue, delay])

  return [
    internalValue,
    setInternalValue,
    debouncedValue,
    internalValue === debouncedValue,
  ]
}
