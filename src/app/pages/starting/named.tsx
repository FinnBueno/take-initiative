import OBR, { Image } from '@owlbear-rodeo/sdk'
import styled from 'styled-components'
import { Text, Title } from '../../components/atoms/typography'
import { createRef } from 'react'
import { useGMData } from '../../services/gm-data/hook'
import { useRoomMetadata } from '../../services/metadata/use-room'
import { InitiativeInput } from './initiative-input'
import { getMetadata, setInitiativeForCharacter } from '../../../util/general'
import { CharacterMetadata } from '../../../util/metadata'
import { NaNToUndefined } from '../../../util/tools'

type Props = {
  units: Image[]
}

export const ConfigureNamedUnits = ({ units }: Props) => {
  const nextInputs = Array.from({ length: units.length - 1 }, () => createRef<HTMLInputElement>())

  const dmData = useGMData()

  const roomSettings = useRoomMetadata()

  const letPlayersEnterOwnInitiative = !roomSettings.preventPlayersFromEnteringOwnInitiative
  const hideToken = roomSettings.hideTokensOnInitiativeInput

  return (
    <Wrapper>
      <TitleContainer>
        <Title $level={3}>Named units</Title>
        <Text>
          Assign these units an initiative, or press <b>Enter</b> inside the input field to generate one automatically.
        </Text>
      </TitleContainer>
      <TurnTakerContainer>
        {units.map((unit, index) => {
          const isPlayer = !dmData.gmIDs.find(dmID => dmID === unit.createdUserId)
          const characterMetadata = getMetadata<CharacterMetadata>(unit)
          // console.log(`Unit ${unit.text.plainText} has initiative`, unit.metadata)
          return (
            <InitiativeInput
              key={unit.id}
              isPlayer={isPlayer}
              unit={unit}
              letPlayersEnterOwnInitiative={letPlayersEnterOwnInitiative}
              index={index}
              nextInputs={nextInputs}
              hideToken={hideToken}
              onChange={e => setInitiativeForCharacter(unit, NaNToUndefined(e.currentTarget.valueAsNumber))}
              initiative={characterMetadata.initiative}
            />
          )
        })}
      </TurnTakerContainer>
    </Wrapper>
  )
}

const TurnTakerContainer = styled.div`
  padding: 12px;
`

const TitleContainer = styled.div`
  margin-left: 12px;
`

const Wrapper = styled.div`
  margin-top: 12px;
  text-align: left;
`
