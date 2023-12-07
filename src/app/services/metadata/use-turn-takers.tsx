import { useState } from 'react'
import { useOBR } from '../use-obr-data'
import OBR, { Image, Item } from '@owlbear-rodeo/sdk'

export const useTurnTakers = (onReceive: (items: Image[]) => Image[] = items => items, onUnmount?: () => void) => {
  const [turnTakers, setTurnTakers] = useState<Image[]>([])
  useOBR<Item[]>({
    onChange: cb => OBR.scene.items.onChange(cb),
    get: () => OBR.scene.items.getItems(),
    run: newItems => setTurnTakers(onReceive(newItems as Image[])),
    onUnmount: onUnmount,
    waitForScene: true,
  })
  return turnTakers
}
