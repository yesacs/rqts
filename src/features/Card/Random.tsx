import { useDebouncedState } from '../../hooks'
import CardApi from './cardApi'

export function RandomCard() {
  const [cardInput, setCardInput, query] = useDebouncedState('sol ring'),
    { data: card } = CardApi.useSearch(query)

  console.log('!!!!!! random card is', card)

  return (
    <div>
      RANDOM CARD!!!
      <input value={cardInput} onChange={e => setCardInput(e.target.value)} />
    </div>
  )
}

export default RandomCard
