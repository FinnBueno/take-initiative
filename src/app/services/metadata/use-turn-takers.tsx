import { useState } from 'react'
import { useOBR } from '../use-obr-data'
import OBR, { Image, Item } from '@owlbear-rodeo/sdk'
import { getMetadata } from '../../../util/general'
import { CharacterMetadata } from '../../../util/metadata'

export const useTurnTakers = (props?: { onReceive?: (items: Image[]) => Image[]; onUnmount?: () => void }) => {
  const { onUnmount } = props ?? {}

  const [turnTakers, setTurnTakers] = useState<Image[]>([])
  useOBR<Item[]>({
    onChange: cb => OBR.scene.items.onChange(cb),
    get: () => OBR.scene.items.getItems(item => getMetadata<CharacterMetadata>(item)?.partOfCombat),
    run: newItems =>
      setTurnTakers(newItems.filter(item => getMetadata<CharacterMetadata>(item)?.partOfCombat) as Image[]),
    onUnmount: onUnmount,
    waitForScene: true,
  })
  return turnTakers
}
