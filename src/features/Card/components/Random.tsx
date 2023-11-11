import { useForm, SubmitHandler } from 'react-hook-form'
import { useDebouncedState, useQueryParams } from '@/hooks/util'

import CardApi from '../api'

interface ICardInput {
  cardName: string
  phoneNumber: string
  email: string
}

export function RandomCard() {
  const
    [{ cardNameFromUri = '' }, setQueryParams] = useQueryParams(),
    [cardInput = '', setCardInput, cardName = ''] = useDebouncedState(cardNameFromUri)

  const
    { data: random } = CardApi.useRandom(cardName),
    { data: cards = [] } = CardApi.useSearch(cardName),
    { data: cardsAlso = [] } = CardApi.useSearchAlso(cardName),
    { data: autocomplete = [] } = CardApi.useAutocomplete(cardName)

  const
    {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<ICardInput>(),
    onSubmit: SubmitHandler<ICardInput> = data => {
      setQueryParams({ cardName: String(cardInput) })
      console.log(data)
    }

  console.info({
    cardName,
    cards,
    cardsAlso,
    random,
    errors,
    autocomplete,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4>RANDOM CARD!!!</h4>
      <input
        {...register('cardName', { required: true })}
        value={cardInput || ''}
        onChange={e => setCardInput(e.target.value)}
      />
      <button type="submit">Add to URL</button>
      <br />
      <ul>
        {autocomplete.map(a => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <br />
      {random && (
        <a href={random?.uri}>
          <img src={random?.image_uris?.normal} height="300px" />
        </a>
      )}
    </form>
  )
}

export default RandomCard
