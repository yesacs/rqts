import CardApi from '../api'
import { useEffect, useState } from 'react'

import { ScryfallCard } from '../types'
import './Card.scss'

type CardProps = {
  card: ScryfallCard
  children?: React.ReactNode
}

export function Card({ card, children }: CardProps) {
  return (
    card && (
      <div className="card">
        <a href={card?.uri}>
          <div
            className="card-img"
            style={{ backgroundImage: `url(${card?.image_uris?.normal})` }}
          />
          <em>{card?.time}</em>
        </a>
        {children}
      </div>
    )
  )
}

type ConnectedCardProps = {
  id: string
}

export function ConnectedCard({ id }: ConnectedCardProps) {
  const { data: card } = CardApi.useId(id),
    save = CardApi.useSave(id),
    [newName, setNewName] = useState('')

  useEffect(() => setNewName(card?.name || ''), [card?.name])

  return (
    <Card card={card}>
      <>
        <input
          value={newName}
          onChange={({ target }) => setNewName(String(target.value))}
        />
        <button
          type="button"
          onClick={() => {
            save.mutate(
              {
                ...card,
                name: newName,
                time: String(Date.now()),
              },
              {
                onSuccess: () => setTimeout(save.reset, 2500),
              }
            )
          }}
        >
          {save.isSuccess ? 'Saved!' : 'Save'}
        </button>
      </>
    </Card>
  )
}

export default ConnectedCard
