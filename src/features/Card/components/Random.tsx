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
    [cardInput = '', setCardInput, cardName = '', , setCardInputNow] =
      useDebouncedState(queryParams.cardName)

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
      <hr />
      {results.length > 1 && (
        <select onChange={({ target }) => setCardInputNow(target.value)}>
          <option disabled value={false}>
            Did you mean...
          </option>
          {results.map((r: string) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      )}
      <hr />
      <dl>
        <dt>Search Results</dt>
        {cards.map((card: ScryfallCard) => (
          <dd key={card.id} onClick={() => setQueryParams({ cardId: card.id })}>
            {card.name}
          </dd>
        ))}
      </dl>
      <br />
      {queryParams.cardId && <Card id={queryParams.cardId} />}
      {random && <Card id={random.id} />}
    </form>
  )
}

export default RandomCard
