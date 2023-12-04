import { useEffect, useState } from 'react'
import ORB, { Image, Item, StopInteraction } from '@owlbear-rodeo/sdk'
import { buildSceneMetadata, getMetadata, removeCharacterFromInitiative } from '../../../util/general'
import { CharacterMetadata } from '../../../util/metadata'
import { ConfigureNamedUnits } from './named'
import styled from 'styled-components'
import { Button } from '../../components/atoms/button'

let interactions: { [id: string]: StopInteraction } = {}

export const StartingPage = () => {
  const [turnTakers, setTurnTakers] = useState<Image[]>([])

  const updateTurnTakers = () => {
    ORB.scene.items
      .getItems(item => getMetadata<CharacterMetadata>(item)?.partOfCombat)
      .then(items => setTurnTakers(items as Image[]))
  }

  useEffect(() => {
    const endOnChange = ORB.scene.items.onChange(updateTurnTakers)
    updateTurnTakers()
    return () => {
      clearInteractions()
      endOnChange()
    }
  }, [])

  const clear = () => {
    ORB.scene.items.updateItems(
      i => !!i,
      (items: Item[]) => items.forEach(removeCharacterFromInitiative)
    )
    ORB.scene.setMetadata(buildSceneMetadata({ state: 'INACTIVE' }))
    ORB.scene.getMetadata().then(console.log)
  }

  const clearInteractions = () => {
    Object.values(interactions).forEach(stop => stop())
    interactions = {}
  }

  const turnTakerClicked = (item: Item) => {
    if (interactions[item.id]) {
      interactions[item.id]()
      delete interactions[item.id]
    } else {
      clearInteractions()
      ORB.interaction
        .startItemInteraction(item)
        .then(interactionManager => (interactions = { ...interactions, [item.id]: interactionManager[1] }))
    }
  }

  const noNameCounter: { [key: string]: number } = {}
  const increaseNoNameCounter = (key: string) => {
    const newNumber = (noNameCounter[key] ?? 0) + 1
    noNameCounter[key] = newNumber
    return newNumber
  }

  const [namedTurnTakers, unnamedTurnTakers] = turnTakers.reduce<[Image[], Image[]]>(
    (total, next) => {
      total[next.text.plainText ? 0 : 1].push(next)
      return total
    },
    [[], []]
  )

  return (
    <Wrapper>
      <ConfigureNamedUnits units={namedTurnTakers} />
      <p>Unnamed Turn takers:</p>
      <ol>
        {unnamedTurnTakers.map(item => (
          <li key={item.id} onClick={() => turnTakerClicked(item)}>
            {item.text.plainText || `${item.name} (${increaseNoNameCounter(item.name)})`}
          </li>
        ))}
      </ol>
      <Button onClick={clear}>Clear</Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`
