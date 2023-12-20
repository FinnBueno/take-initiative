import styled from 'styled-components'
import { useTurnTakers } from '../../services/metadata/use-turn-takers'
import { buildSceneMetadata, getMetadata, removeUnnamedLabels } from '../../../util/general'
import { CharacterMetadata, UnnamedCharacterStrategy } from '../../../util/metadata'
import { HandwritingTitle, Title } from '../../components/atoms/typography'
import OBR, { Image, Item } from '@owlbear-rodeo/sdk'
import { Button } from '../../components/atoms/button'
import { useScene } from '../../services/metadata/use-scene'
import { groupUnits, seperateNamedAndUnnamed } from '../../../util/tools'
import { createRef, useMemo, useState } from 'react'
import { InitiativeEntry, InitiativeRow } from './initiative-row'
import { useRoomMetadata } from '../../services/metadata/use-room'
import { useGMData } from '../../services/gm-data/hook'

const generateInitiativeList = (
  units: Image[],
  strategy: UnnamedCharacterStrategy,
  gmIDs: string[]
): Map<number, InitiativeEntry[]> => {
  const [named, unnamed] = seperateNamedAndUnnamed(units)
  const result = new Map<number, InitiativeEntry[]>()

  const setAtInitiative = (entry: Omit<InitiativeEntry, 'initiative'>, unit: Item) => {
    const md = getMetadata<CharacterMetadata>(unit)
    const initiative = md.initiative ?? 0
    const othersAtInitiative = result.get(initiative) ?? []
    result.set(initiative, [...othersAtInitiative, { ...entry, initiative }])
  }

  named.forEach(unit => {
    const isPlayer = !gmIDs.find(dmID => dmID === unit.createdUserId)
    return setAtInitiative(
      {
        name: unit.text.plainText,
        id: unit.id,
        units: [unit],
        isPlayer,
      },
      unit
    )
  })

  switch (strategy) {
    case 'INDIVIDUAL': {
      const countTypes = new Map<string, number>()
      unnamed.forEach(unit => {
        const indexOfType = countTypes.get(unit.name) ?? 0
        countTypes.set(unit.name, indexOfType + 1)
        return setAtInitiative(
          {
            name: `${unit.name} (${indexOfType + 1})`,
            id: unit.id,
            units: [unit],
            isPlayer: false,
          },
          unit
        )
      })
      break
    }
    case 'TYPE_GROUP': {
      Object.entries(groupUnits(unnamed)).forEach(([key, units]) => {
        setAtInitiative(
          {
            name: `${units[0].name} (x${units.length})`,
            id: key,
            units: units,
            isPlayer: false,
          },
          units[0]
        )
      })
      break
    }
    case 'ONE_GROUP': {
      setAtInitiative(
        {
          name: 'Unnamed Characters',
          id: 'unnamed-characters',
          units: unnamed,
          isPlayer: false,
        },
        unnamed[0]
      )
      break
    }
  }

  return result
}

export const RunningPage = () => {
  const {
    room: { hideTokensOnInitiativeInput, tokenSettings },
  } = useRoomMetadata()

  const { metadata } = useScene()
  const { unnamedCharacterStrategy } = metadata

  const goBack = () => {
    // TODO: Change these state changes to not remove all metadata from the scene
    removeUnnamedLabels().then(() => OBR.scene.setMetadata(buildSceneMetadata({ state: 'STARTING' }, metadata)))
  }

  const turnTakers = useTurnTakers()

  const { gmIDs } = useGMData()

  const initiativeList = useMemo(
    () => generateInitiativeList(turnTakers, unnamedCharacterStrategy, gmIDs),
    [turnTakers, unnamedCharacterStrategy, gmIDs]
  )

  return (
    <Wrapper>
      <SideSpace>
        <Title $level={3}>Running combat</Title>
        {[...initiativeList.entries()]
          .sort(([a], [b]) => b - a)
          .map(([initiative, units]) => (
            <InitiativeContainer key={initiative}>
              <InitiativeIndicatorContainer>
                <InitiativeIndicator $level={5}>{initiative}</InitiativeIndicator>
              </InitiativeIndicatorContainer>
              <Entries>
                {units.map(unit => (
                  <InitiativeRow
                    key={unit.id}
                    tokenSetting={tokenSettings[unit.units[0].name]}
                    entry={unit}
                    hideToken={hideTokensOnInitiativeInput}
                    startTabOnNext={() => {
                      console.log('TODO: Go to next item')
                    }}
                  />
                ))}
              </Entries>
            </InitiativeContainer>
          ))}
        <ClearButton onClick={goBack}>Quit Combat</ClearButton>
      </SideSpace>
    </Wrapper>
  )
}

const ClearButton = styled(Button)`
  margin: 12px 0;
  width: 100%;
`

const SideSpace = styled.div`
  margin: 0 12px;
`

const Entries = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const InitiativeIndicatorContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 100%;
  margin-right: 4px;
  width: 44px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.25s;
`

const InitiativeIndicator = styled(Title)<{ isActive: boolean }>`
  margin-bottom: -1px;
`

const InitiativeContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 12px;
  align-items: center;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`
