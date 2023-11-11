import { useQuery } from '@tanstack/react-query'

import {
  ScryfallCard,
  ScryfallMultiCardResponse,
  ScryfallCatalog,
} from './types'

export const get = (req: RequestInfo | string) => async () => {
  const resp = await fetch(req)
  return await resp.json()
}
const SCRY_URL: string = 'https://api.scryfall.com/cards/'

const multiCardResponseToNames = ({ data }: ScryfallMultiCardResponse) =>
  data.map((d: ScryfallCard) => d.name)

export const CardApi = {
  useRandom: (searchStr: string) =>
    useQuery({
      queryKey: ['random', searchStr],
      enabled: !!searchStr,
      queryFn: get(`${SCRY_URL}random?q=${searchStr}`),
      select: (c: ScryfallCard) => c,
    }),
  useSearch: (searchStr: string) =>
    useQuery({
      queryKey: ['search', searchStr],
      enabled: !!searchStr,
      staleTime: 1000 * 60 * 10,
      queryFn: get(`${SCRY_URL}search?q=${searchStr}`),
      select: multiCardResponseToNames,
    }),
  useAutocomplete: (searchStr: string, limit: number = 10) =>
    useQuery({
      queryKey: ['autocomplete', searchStr],
      enabled: !!searchStr,
      queryFn: get(`${SCRY_URL}autocomplete?q=${searchStr}`),
      select: (results: ScryfallCatalog) =>
        results.data.slice(0, Math.min(limit, results.total_values - 1)),
    }),
}

export default CardApi
