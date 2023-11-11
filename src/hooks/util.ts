import { useEffect, useState } from 'react'
import { SetURLSearchParams, useSearchParams } from 'react-router-dom'

// A custom version of useState that can debounce itself
type StateValue = unknown | undefined

export function useDebouncedState(
  value?: StateValue,
  delay: number = 500
): [StateValue, React.Dispatch<React.SetStateAction<StateValue>>, StateValue, boolean] {
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

type MappedQueryParam = {
  [key: string]: string,
}

export function useQueryParams(namespace?: string): [MappedQueryParam, SetURLSearchParams] {
  const [rawSearchParams, setQueryParams] = useSearchParams(),
    queryParams: MappedQueryParam = {}

  rawSearchParams.forEach((value, name) => {
    if (!namespace || name.includes(namespace))
      queryParams[name] = value
  })

  console.log(rawSearchParams, queryParams)

  return [queryParams, setQueryParams]

}
