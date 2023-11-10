import { useQuery } from '@tanstack/react-query'

export const get = (url: string) => async () => {
  const resp = await fetch(url)
  return await resp.json()
}

export type Card = {
  id: string
  name: string
}

export type ScryfallSingleCardResponse = Card

export type ScryfallMultiCardResponse = {
  data: Card[]
}

const SCRY_URL: string = 'https://api.scryfall.com'

const multiCardResponseToNames = ({ data }: ScryfallMultiCardResponse) =>
  data.map((d: Card) => d.name)

export default {
  useRandom: (searchStr: string) =>
    useQuery({
      queryKey: ['random', searchStr],
      queryFn: get(`${SCRY_URL}/cards/random?q=${searchStr}`),
    }),
  useSearch: (searchStr: string) =>
    useQuery({
      queryKey: ['search', searchStr],
      queryFn: get(`${SCRY_URL}/cards/search?q=${searchStr}`),
      select: multiCardResponseToNames,
    }),
}
