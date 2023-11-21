import { useDeferredValue, useEffect, useState } from 'react'
import { SetURLSearchParams, useSearchParams } from 'react-router-dom'
import qs from 'qs'

// A custom version of useState that can debounce itself
export function useDebouncedState<S>(
  value?: S,
  delay = 500
): [
  S,
  React.Dispatch<React.SetStateAction<S>>,
  S,
  boolean,
  React.Dispatch<React.SetStateAction<S>>,
] {
  const [internalValue, setInternalValue] = useState(value),
    [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(internalValue)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [internalValue, delay])

  return [
    internalValue,
    setInternalValue,
    debouncedValue,
    internalValue === debouncedValue,
    setDebouncedValue,
  ]
}

// a wrapper around useDeferredValue and useState
export function useDeferredState<S>(
  value: S
): [S, React.Dispatch<React.SetStateAction<S>>, S] {
  const [internalValue, setInternalValue] = useState(value),
    deferredValue = useDeferredValue(internalValue)

  return [internalValue, setInternalValue, deferredValue]
}

// a wrapper around the React-Router useSearchParams hook that returns the query params mapped and filtered by a given namespace TODO
export function useQueryParams(): [
  qs.ParsedQs,
  SetURLSearchParams,
  URLSearchParams,
] {
  const [rawSearchParams, setQueryParams] = useSearchParams(),
    parsedParams = qs.parse(rawSearchParams.toString())

  return [parsedParams, setQueryParams, rawSearchParams]
}
