import { useState } from 'react'
import { useOBR } from '../use-obr-data'
import OBR, { Image, Item } from '@owlbear-rodeo/sdk'
import { getMetadata } from '../../../util/general'
import { CharacterMetadata } from '../../../util/metadata'

const filter = (item: Item) => getMetadata<CharacterMetadata>(item)?.partOfCombat

export const useTurnTakers = (props?: { onReceive?: (items: Image[]) => Image[]; onUnmount?: () => void }) => {
  const { onUnmount } = props ?? {}

  const [turnTakers, setTurnTakers] = useState<Image[]>([])
  useOBR<Item[]>({
    onChange: cb => OBR.scene.items.onChange(cb),
    get: () => OBR.scene.items.getItems(filter),
    run: newItems => setTurnTakers(newItems.filter(filter) as Image[]),
    onUnmount: onUnmount,
    waitForScene: true,
  })
  return turnTakers
}
