import { useForm, SubmitHandler } from 'react-hook-form'
import { useDebouncedState } from '@/hooks'
import CardApi from '../api'

interface ICardInput {
  cardName: string
  phoneNumber: string
  email: string
}

export function RandomCard() {
  const PATTERN = {
    phone: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
  }

  const [cardInput, setCardInput, query] = useDebouncedState('sol ring'),
    { data: cards } = CardApi.useSearch(query),
    { data: random } = CardApi.useRandom(query),
    { data: autocomplete = [] } = CardApi.useAutocomplete(query)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICardInput>()
  const onSubmit: SubmitHandler<ICardInput> = data => console.log(data)

  console.log('!!!!!! results are in!', { cards, random, errors, autocomplete })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4>RANDOM CARD!!!</h4>
      <input
        {...register('cardName', { required: true })}
        value={cardInput}
        onChange={e => setCardInput(e.target.value)}
      />
      <input
        {...register('email', {
          value: true,
        })}
      />
      <input
        {...register('phoneNumber', { required: true, pattern: PATTERN.phone })}
      />
      <button type="submit">GO</button>
      <br />
      <ul>
        {autocomplete.map(a => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <br />
      {random && (
        <a href={random?.uri}>
          <img src={random?.image_uris?.normal} />
        </a>
      )}
    </form>
  )
}

export default RandomCard
