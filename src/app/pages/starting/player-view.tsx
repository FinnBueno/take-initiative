import OBR, { Image } from '@owlbear-rodeo/sdk'
import styled from 'styled-components'
import { InitiativeInput } from './initiative-input'
import { createRef } from 'react'
import { useRoomMetadata } from '../../services/metadata/use-room'
import { Text, Title } from '../../components/atoms/typography'
import { Button } from '../../components/atoms/button'
import { D20 } from '../../components/atoms/svg/d20'

type Props = {
  namedTurnTakers: Image[]
}

export const PlayerInitiativeView = ({ namedTurnTakers }: Props) => {
  const thisUserId = OBR.player.id
  const turnTakersPlayerCanControl = namedTurnTakers.filter(tt => tt.createdUserId === thisUserId)
  const nextInputs = Array.from({ length: turnTakersPlayerCanControl.length - 1 }, () => createRef<HTMLInputElement>())
  const roomSettings = useRoomMetadata()
  return (
    <div>
      <HeadingContainer>
        <Title $level={3}>Roll initiative!</Title>
        <Text>Enter the initiative for the tokens you control</Text>
      </HeadingContainer>
      {turnTakersPlayerCanControl.map((unit, index) => {
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
          />
        )
      })}
      <SubmitButton>
        Submit <D20 size='12px' color='white' />
      </SubmitButton>
    </div>
  )
}

const SubmitButton = styled(Button)`
  margin-top: 12px;
`

const HeadingContainer = styled.div`
  margin-bottom: 12px;
`
