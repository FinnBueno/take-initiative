import styled from 'styled-components'
import { useTurnTakers } from '../../services/metadata/use-turn-takers'
import { buildSceneMetadata, getMetadata } from '../../../util/general'
import { CharacterMetadata, UnnamedCharacterStrategy } from '../../../util/metadata'
import { Text, Title } from '../../components/atoms/typography'
import OBR, { Image, Item } from '@owlbear-rodeo/sdk'
import { Button } from '../../components/atoms/button'
import { useScene } from '../../services/metadata/use-scene'
import { groupUnits, seperateNamedAndUnnamed } from '../../../util/tools'
import { useMemo } from 'react'
import { InitiativeEntry, InitiativeRow } from './initiative-row'
import { useRoomMetadata } from '../../services/metadata/use-room'

const generateInitiativeList = (units: Image[], strategy: UnnamedCharacterStrategy): Map<number, InitiativeEntry[]> => {
  const [named, unnamed] = seperateNamedAndUnnamed(units)
  const result = new Map<number, InitiativeEntry[]>()

  const setAtInitiative = (entry: Omit<InitiativeEntry, 'initiative'>, unit: Item) => {
    const md = getMetadata<CharacterMetadata>(unit)
    const initiative = md.initiative ?? 0
    const othersAtInitiative = result.get(initiative) ?? []
    result.set(initiative, [...othersAtInitiative, { ...entry, initiative }])
  }

  named.forEach(unit =>
    setAtInitiative(
      {
        name: unit.text.plainText,
        id: unit.id,
        units: [unit],
      },
      unit
    )
  )

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
        },
        unnamed[0]
      )
      break
    }
  }

  return result
}

export const RunningPage = () => {
  const { hideTokensOnInitiativeInput } = useRoomMetadata()
  const { round, unnamedCharacterStrategy } = useScene()
  const turnTakers = useTurnTakers()
  const goBack = () => OBR.scene.setMetadata(buildSceneMetadata({ state: 'STARTING' }))
  const initiativeList = useMemo(
    () => generateInitiativeList(turnTakers, unnamedCharacterStrategy),
    [turnTakers, unnamedCharacterStrategy]
  )
  return (
    <Wrapper>
      <SideSpace>
        <Title $level={3}>Round: {round + 1}</Title>
        {[...initiativeList.entries()]
          .sort(([a], [b]) => b - a)
          .map(([initiative, units]) => {
            return (
              <InitiativeContainer>
                <InitiativeIndicatorContainer>
                  <InitiativeIndicator $level={5}>{initiative}</InitiativeIndicator>
                </InitiativeIndicatorContainer>
                <Entries>
                  {units.map(unit => (
                    <InitiativeRow key={unit.id} entry={unit} hideToken={hideTokensOnInitiativeInput} />
                  ))}
                </Entries>
              </InitiativeContainer>
            )
          })}
        <ClearButton onClick={goBack}>Go Back</ClearButton>
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
`

const InitiativeIndicator = styled(Title)`
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
