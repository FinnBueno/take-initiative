import { Image } from '@owlbear-rodeo/sdk'
import styled from 'styled-components'
import { Text, Title } from '../../../components/atoms/typography'
import { createRef } from 'react'
import { useGMData } from '../../../services/gm-data/hook'
import { InitiativeInput } from '../../../components/molecules/initiative-input'
import { getMetadata, setInitiativeForCharacter } from '../../../../util/general'
import { CharacterMetadata } from '../../../../util/metadata'

type Props = {
  units: Image[]
  preventPlayersFromEnteringOwnInitiative: boolean
  hideTokensOnInitiativeInput: boolean
}

export const ConfigureNamedUnits = ({
  units,
  preventPlayersFromEnteringOwnInitiative,
  hideTokensOnInitiativeInput,
}: Props) => {
  const nextInputs = Array.from({ length: units.length - 1 }, () => createRef<HTMLInputElement>())

  const dmData = useGMData()

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
          return (
            <InitiativeInput
              key={unit.id}
              isPlayer={isPlayer}
              unit={unit}
              letPlayersEnterOwnInitiative={!preventPlayersFromEnteringOwnInitiative}
              index={index}
              nextInputs={nextInputs}
              hideToken={hideTokensOnInitiativeInput}
              onChange={init => setInitiativeForCharacter(unit, init)}
              overrideInitiativeValue={characterMetadata.initiative}
              defaultValue={characterMetadata.initiative}
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
