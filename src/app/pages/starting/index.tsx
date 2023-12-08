import OBR, { Image, StopInteraction } from '@owlbear-rodeo/sdk'
import { buildSceneMetadata, getMetadata, removeListFromInitiative } from '../../../util/general'
import { CharacterMetadata } from '../../../util/metadata'
import styled from 'styled-components'
import { Button } from '../../components/atoms/button'
import { useGMData } from '../../services/gm-data/hook'
import { useRoomMetadata } from '../../services/metadata/use-room'
import { ConfigureNamedUnits } from './named/named-unit-list'
import { PlayerInitiativeView } from './player-view'
import { SelectUnnamedStrategy } from './unnamed/select-unnamed-strategy'
import { useTurnTakers } from '../../services/metadata/use-turn-takers'

let interactions: { [id: string]: StopInteraction } = {}

export const StartingPage = () => {
  // const [turnTakers, setTurnTakers] = useState<Image[]>([])

  const updateTurnTakers = (newItems: Image[]) =>
    newItems.filter(item => getMetadata<CharacterMetadata>(item)?.partOfCombat)

  const clearInteractions = () => {
    Object.values(interactions).forEach(stop => stop())
    interactions = {}
  }

  // useOBR<Item[]>({
  //   onChange: cb => OBR.scene.items.onChange(cb),
  //   get: () => OBR.scene.items.getItems(),
  //   run: updateTurnTakers,
  //   onUnmount: clearInteractions,
  //   waitForScene: true,
  // })

  const turnTakers = useTurnTakers({ onUnmount: clearInteractions })

  const clear = () => {
    removeListFromInitiative(turnTakers)
    OBR.scene.setMetadata(buildSceneMetadata({ state: 'INACTIVE' }))
  }

  const start = () => {
    OBR.scene.setMetadata(buildSceneMetadata({ state: 'RUNNING' }))
  }

  // const turnTakerClicked = (item: Item) => {
  //   if (interactions[item.id]) {
  //     interactions[item.id]()
  //     delete interactions[item.id]
  //   } else {
  //     clearInteractions()
  //     OBR.interaction
  //       .startItemInteraction(item)
  //       .then(interactionManager => (interactions = { ...interactions, [item.id]: interactionManager[1] }))
  //   }
  // }

  const [namedTurnTakers, unnamedTurnTakers] = turnTakers.reduce<[Image[], Image[]]>(
    (total, next) => {
      total[next.text.plainText ? 0 : 1].push(next)
      return total
    },
    [[], []]
  )

  const { isGM } = useGMData()

  const roomSettings = useRoomMetadata()

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
      <SelectUnnamedStrategy units={unnamedTurnTakers} />
      <ButtonContainer>
        <Button onClick={clear}>Cancel</Button>
        <Button primary onClick={start}>
          Start
        </Button>
      </ButtonContainer>
    </Wrapper>
  )
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 12px 8px 12px;
`

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`
