import { useForm, SubmitHandler } from 'react-hook-form'
import { useDebouncedState, useQueryParams } from '@/hooks/util'
import Card from './Card'

import CardApi from '../api'
import { ScryfallCard } from '../types'

interface ICardInput {
  cardName: string
  phoneNumber: string
  email: string
}

export function RandomCard() {
  const [queryParams, setQueryParams] = useQueryParams(),
    [cardInput = '', setCardInput, cardName = ''] = useDebouncedState(
      queryParams.cardName
    )

  const { data: random } = CardApi.useRandom(cardName),
    { data: cards = [] } = CardApi.useSearch(cardName),
    { data: results = [] } = CardApi.useAutocomplete(cardName)

  const { register, handleSubmit } = useForm<ICardInput>(),
    onSubmit: SubmitHandler<ICardInput> = data => {
      setQueryParams({ cardName: String(cardInput) })
      console.log(data)
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4>RANDOM CARD!!!</h4>
      <input
        {...register('cardName', { required: true })}
        value={String(cardInput)}
        onChange={e => setCardInput(e.target.value)}
      />
      <button type="submit">Add to URL</button>
      <br />
      <ul>
        {results.map((r: string) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <ul>
        {cards.map((card: ScryfallCard) => (
          <li key={card.id} onClick={() => setQueryParams({ cardId: card.id })}>
            {card.name}
          </li>
        ))}
      </ul>
      <br />
      {queryParams.cardId && <Card id={queryParams.cardId} />}
      {random && <Card id={random.id} />}
    </form>
  )
}

export default RandomCard
