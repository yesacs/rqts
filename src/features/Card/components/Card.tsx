import CardApi from '../api'
import { useEffect, useState } from 'react'

import { ScryfallCard } from '../types'
import './Card.scss'

// Dumb Card

interface CardProps {
  card: ScryfallCard
  children?: React.ReactNode
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}

export function Card({ card, children, onClick }: CardProps) {
  return (
    <div className="card">
      <a href={card.uri} onClick={onClick}>
        <div
          className="card-img"
          style={{ backgroundImage: `url(${card.image_uris?.normal})` }}
        />
        <em>{card.time}</em>
      </a>
      {children}
    </div>
  )
}

// Smart Card

interface ConnectedCardProps {
  id: string
}

export function ConnectedCard({ id }: ConnectedCardProps) {
  const { data: card } = CardApi.useId(id),
    save = CardApi.useSave(id),
    [newName, setNewName] = useState(''),
    [val, setVal] = useState<number>(0)

  useEffect(() => {
    setNewName(card?.name ?? '')
  }, [card?.name])

  return (
    card && (
      <Card
        card={card}
        onClick={e => {
          e.preventDefault()
          setVal(val + 1)
          console.log(val)
        }}
      >
        <>
          <input
            value={newName}
            onChange={({ target }) => {
              setNewName(String(target.value))
            }}
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
  )
}

export default ConnectedCard
