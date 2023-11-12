import CardApi from '../api'
import { ScryfallCard } from '../types'

type CardProps = {
  card: ScryfallCard
}

export function Card({ card }: CardProps) {
  const saveCard = CardApi.useSave()

  return (
    <div>
      <a href={card?.uri}>
        <img src={card?.image_uris?.normal} height="300px" />
      </a>
      <button
        type="button"
        onClick={() =>
          saveCard.mutate({
            ...card,
            time: String(Date.now()),
          })
        }
      >
        Save
      </button>
    </div>
  )
}

export function ConnectedCard({ id }: { id: string }) {
  const { data: card } = CardApi.useId(id)
  return !!card && <Card card={card} />
}

export default ConnectedCard
