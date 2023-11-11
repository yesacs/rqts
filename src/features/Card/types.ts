export type ScryfallCard = {
  id: string
  name: string
  image_uris?: {
    small: string
    normal: string
  }
  uri: string
}

export type ScryfallCatalog = {
  object: string
  uri: string
  total_values: number
  data: string[]
}

export type ScryfallSingleCardResponse = ScryfallCard

export type ScryfallMultiCardResponse = {
  data: ScryfallCard[]
}
