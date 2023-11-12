import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'

import { firebaseConfig } from './firebaseConfig'

export const firebaseApp = initializeApp(firebaseConfig),
  db = getFirestore(firebaseApp)

export async function getCards() {
  const cardsCol = collection(db, 'Cards')
  const cardsDocs = await getDocs(cardsCol)
  console.log({ cardsCol, cardsDocs })
}
