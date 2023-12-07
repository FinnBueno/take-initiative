import OBR, { Image } from '@owlbear-rodeo/sdk'
import styled from 'styled-components'
import { InitiativeInput } from '../../components/molecules/initiative-input'
import { createRef } from 'react'
import { useRoomMetadata } from '../../services/metadata/use-room'
import { Text, Title } from '../../components/atoms/typography'
import { getMetadata, setInitiativeForCharacter } from '../../../util/general'
import { NaNToUndefined } from '../../../util/tools'
import { CharacterMetadata } from '../../../util/metadata'

type Props = {
  namedTurnTakers: Image[]
}

export const PlayerInitiativeView = ({ namedTurnTakers }: Props) => {
  const thisUserId = OBR.player.id
  const turnTakersPlayerCanControl = namedTurnTakers.filter(tt => tt.createdUserId === thisUserId)
  // console.log('Your ID', thisUserId)
  // console.log('You control', turnTakersPlayerCanControl)
  // console.log('From', namedTurnTakers)
  const nextInputs = Array.from({ length: turnTakersPlayerCanControl.length - 1 }, () => createRef<HTMLInputElement>())
  const roomSettings = useRoomMetadata()
  const turnTakersWithMetadata = turnTakersPlayerCanControl.map(
    tt => [tt, getMetadata<CharacterMetadata>(tt)] as [Image, CharacterMetadata]
  )
  const allInitiativesEntered =
    turnTakersWithMetadata.filter(([_, md]) => !!md.initiative).length === turnTakersWithMetadata.length
  return (
    <div>
      <HeadingContainer>
        <Title $level={3}>Roll initiative!</Title>
        <Text>Enter the initiative for the tokens you control</Text>
      </HeadingContainer>
      {turnTakersWithMetadata.map(([unit, characterMetadata], index) => {
        return (
          <InitiativeInput
            key={unit.id}
            isPlayer={true}
            unit={unit}
            letPlayersEnterOwnInitiative={false}
            index={index}
            nextInputs={nextInputs}
            hideToken={roomSettings.hideTokensOnInitiativeInput}
            disableRandom
            hidePlayerTag
            onChange={init => setInitiativeForCharacter(unit, NaNToUndefined(init))}
            defaultValue={characterMetadata.initiative}
          />
        )
      })}
      {allInitiativesEntered && (
        <FooterContainer>
          <Text>Now wait for your GM to start combat</Text>
        </FooterContainer>
      )}
    </div>
  )
}

const FooterContainer = styled.div`
  margin-top: 12px;
`

const HeadingContainer = styled.div`
  margin-bottom: 12px;
`
