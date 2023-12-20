import OBR, { StopInteraction } from '@owlbear-rodeo/sdk'
import {
  addNicknamesToTokens,
  buildSceneMetadata,
  getMetadata,
  removeListFromInitiative,
  setInitiativeForList,
} from '../../../util/general'
import { CharacterMetadata, UnnamedCharacterStrategy } from '../../../util/metadata'
import styled from 'styled-components'
import { Button } from '../../components/atoms/button'
import { useGMData } from '../../services/gm-data/hook'
import { useRoomMetadata } from '../../services/metadata/use-room'
import { ConfigureNamedUnits } from './named/named-unit-list'
import { PlayerInitiativeView } from './player-view'
import { SelectUnnamedStrategy } from './unnamed/select-unnamed-strategy'
import { useTurnTakers } from '../../services/metadata/use-turn-takers'
import { useState } from 'react'
import { Error } from '../../components/molecules/error'
import { useScene } from '../../services/metadata/use-scene'
import { seperateNamedAndUnnamed } from '../../../util/tools'

let interactions: { [id: string]: StopInteraction } = {}

const clearInteractions = () => {
  Object.values(interactions).forEach(stop => stop())
  interactions = {}
}

export const StartingPage = () => {
  const turnTakers = useTurnTakers({ onUnmount: clearInteractions })

  const { isGM } = useGMData()

  const {
    room: { preventPlayersFromEnteringOwnInitiative, addIdentifiersToUnnamedTokens, hideTokensOnInitiativeInput },
  } = useRoomMetadata()

  const { metadata: sceneData, updateUnnamedCharacterStrategy } = useScene()
  const { unnamedCharacterStrategy } = sceneData

  const clear = () => {
    removeListFromInitiative(turnTakers)
    OBR.scene.setMetadata(buildSceneMetadata({ state: 'INACTIVE' }, sceneData))
  }

  const [userIsSureToContinue, setUserIsSureToContinue] = useState(false)
  const assureEveryoneHasPermission = () =>
    userIsSureToContinue ||
    turnTakers.filter(tt => getMetadata<CharacterMetadata>(tt)?.initiative === undefined).length === 0

  const [namedTurnTakers, unnamedTurnTakers] = seperateNamedAndUnnamed(turnTakers)

  const start = () => {
    if (assureEveryoneHasPermission()) {
      if (addIdentifiersToUnnamedTokens) {
        addNicknamesToTokens(unnamedTurnTakers, namedTurnTakers).then(() =>
          OBR.scene.setMetadata(buildSceneMetadata({ state: 'RUNNING' }, sceneData))
        )
      } else {
        OBR.scene.setMetadata(buildSceneMetadata({ state: 'RUNNING' }, sceneData))
      }
    } else {
      setUserIsSureToContinue(true)
      setTimeout(() => setUserIsSureToContinue(false), 5000)
    }
  }

  if (!isGM) {
    if (preventPlayersFromEnteringOwnInitiative) {
      return <Wrapper>Entering initiatives...</Wrapper>
    } else {
      return (
        <Wrapper>
          <PlayerInitiativeView namedTurnTakers={namedTurnTakers} />
        </Wrapper>
      )
    }
  }

  const onUpdateUnnamedCharacterStrategy = (strategy: UnnamedCharacterStrategy) => {
    updateUnnamedCharacterStrategy(strategy)
    setInitiativeForList(unnamedTurnTakers, undefined)
  }

  return (
    <Wrapper>
      <ConfigureNamedUnits
        units={namedTurnTakers}
        preventPlayersFromEnteringOwnInitiative={!!preventPlayersFromEnteringOwnInitiative}
        hideTokensOnInitiativeInput={!!hideTokensOnInitiativeInput}
      />
      <SelectUnnamedStrategy
        units={unnamedTurnTakers}
        currentStrategy={unnamedCharacterStrategy}
        updateStrategy={onUpdateUnnamedCharacterStrategy}
      />
      <Error
        visible={userIsSureToContinue}
        text='Not all characters have an initiative set, are you sure you want to continue?'
      />
      <ButtonContainer>
        <Button onClick={clear}>Cancel</Button>
        <Button $primary onClick={start}>
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
