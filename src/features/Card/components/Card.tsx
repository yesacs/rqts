import CardApi from '../api'
import { useEffect, useState } from 'react'

import { ScryfallCard } from '../types'
import './Card.scss'

// Dumb Card

interface CardProps {
  card: ScryfallCard
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onSave?: (e: React.MouseEvent<HTMLElement>) => void
  buttonLabel?: string
}

export function Card({
  card,
  children,
  onClick,
  onChange,
  onSave,
  buttonLabel,
}: CardProps) {
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
      <input value={card.name} onChange={onChange} />
      <button type="button" onClick={onSave}>
        {buttonLabel}
      </button>
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
    [newName, setNewName] = useState<string>(''),
    [val, setVal] = useState<number>(0),
    onSave = () => {
      card &&
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
    }

  useEffect(() => {
    setNewName(card?.name ?? '')
  }, [card?.name])

  return (
    card && (
      <Card
        card={{ ...card, name: newName }}
        onSave={onSave}
        buttonLabel={save.isSuccess ? 'Saved!' : 'Save'}
        onClick={e => {
          e.preventDefault()
          setVal(val + 1)
          console.log(val)
        }}
        onChange={({ target }) => {
          setNewName(String(target.value))
        }}
      />
    )
  )
}

export default ConnectedCard
