import { useEffect, useState } from 'react'
import OBR, { Image, Item, StopInteraction } from '@owlbear-rodeo/sdk'
import { buildSceneMetadata, getMetadata, removeListFromInitiative } from '../../../util/general'
import { CharacterMetadata } from '../../../util/metadata'
import styled from 'styled-components'
import { Button } from '../../components/atoms/button'
import { useGMData } from '../../services/gm-data/hook'
import { useRoomMetadata } from '../../services/metadata/use-room'
import { ConfigureNamedUnits } from './named'
import { PlayerInitiativeView } from './player-view'
import { useOBR } from '../../services/use-obr-data'

let interactions: { [id: string]: StopInteraction } = {}

export const StartingPage = () => {
  const [turnTakers, setTurnTakers] = useState<Image[]>([])

  const updateTurnTakers = (newItems: Item[]) => {
    console.log('Update turn takers')
    const filterdItems = newItems.filter(item => getMetadata<CharacterMetadata>(item)?.partOfCombat)
    setTurnTakers(filterdItems as Image[])
  }

  const clearInteractions = () => {
    Object.values(interactions).forEach(stop => stop())
    interactions = {}
  }

  useOBR<Item[]>({
    onChange: cb => OBR.scene.items.onChange(cb),
    get: () => OBR.scene.items.getItems(),
    run: updateTurnTakers,
    onUnmount: clearInteractions,
    waitForScene: true,
  })

  const clear = () => {
    removeListFromInitiative(turnTakers)
    OBR.scene.setMetadata(buildSceneMetadata({ state: 'INACTIVE' }))
  }

  const turnTakerClicked = (item: Item) => {
    if (interactions[item.id]) {
      interactions[item.id]()
      delete interactions[item.id]
    } else {
      clearInteractions()
      OBR.interaction
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

  const { isGM } = useGMData()

  const roomSettings = useRoomMetadata()

  console.log('TurnTakers!!', turnTakers)

  if (!isGM) {
    if (roomSettings.preventPlayersFromEnteringOwnInitiative) {
      return <Wrapper>Entering initiatives...</Wrapper>
    } else {
      return (
        <Wrapper>
          <PlayerInitiativeView namedTurnTakers={namedTurnTakers} />
        </Wrapper>
      )
    }
  }

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
