import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  ScryfallCard,
  ScryfallMultiCardResponse,
  ScryfallCatalog,
} from './types'

export const get = (req: RequestInfo | string) => async () => {
  const resp = await fetch(req)
  return resp.json()
}

type SearchStr = string

const SCRY_URL = 'https://api.scryfall.com/cards/'

// f
// actory pattern for keys makes reuse/refactoring a litte smoother, but it
// feels like there may be a better way to generate this
const keys = {
  all: ['card'],
  id: (id: SearchStr) => [...keys.all, id],
  random: (searchString: SearchStr) => [...keys.all, 'random', searchString],
  search: (searchString: SearchStr) => [...keys.all, 'search', searchString],
  autoComplete: (searchString: SearchStr) => [
    ...keys.all,
    'autoComplete',
    searchString,
  ],
}

const multiCardResponse =
  (limit: number) =>
  ({ data }: ScryfallMultiCardResponse) =>
    data.slice(0, Math.min(limit, data.length))

const multiCardResponseToIds = ({ data }: ScryfallMultiCardResponse) =>
  data.map((d: ScryfallCard) => d.id)

// This object contains the main endpoint definitions and query behaviord for
// Card related things
export const CardApi = {
  useId: (id: string) =>
    useQuery({
      queryKey: keys.id(id),
      enabled: !!id,
      queryFn: get(`${SCRY_URL}${id}`),
      select: (c: ScryfallCard) => c, // Selector here help TS with return type inference
    }),
  useRandom: (searchStr: SearchStr) =>
    useQuery({
      queryKey: keys.random(searchStr),
      enabled: !!searchStr,
      queryFn: get(`${SCRY_URL}random?q=${searchStr}`),
      select: (c: ScryfallCard) => c,
    }),
  useSearch: (searchStr: SearchStr) =>
    useQuery({
      queryKey: keys.search(searchStr),
      enabled: !!searchStr,
      queryFn: get(`${SCRY_URL}search?q=${searchStr}`),
      select: multiCardResponse(10),
    }),
  // since useSearchAlso has the same key as useSearch, it will just freeload
  // that data instead of making a new request
  useSearchAlso: (searchStr: SearchStr) =>
    useQuery({
      queryKey: keys.search(searchStr),
      enabled: !!searchStr,
      queryFn: get(`${SCRY_URL}search?q=${searchStr}`),
      select: multiCardResponseToIds,
    }),
  useAutocomplete: (searchStr: SearchStr, limit = 10) =>
    useQuery({
      queryKey: keys.autoComplete(searchStr),
      enabled: !!searchStr,
      queryFn: get(`${SCRY_URL}autocomplete?q=${searchStr}`),
      select: (results: ScryfallCatalog) =>
        results.data.slice(0, Math.min(limit, results.total_values)),
    }),
  useSave: (id: string) => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationKey: keys.id(id),
      mutationFn: async (card: ScryfallCard) => {
        await get(`${SCRY_URL}${id}`)() // just to have a promise in here

        localStorage.setItem(card.id, JSON.stringify(card))

        return card
      },
      onSuccess: async card =>
        await queryClient.setQueryData(keys.id(card.id), card),
    })
  },
}

export default CardApi
