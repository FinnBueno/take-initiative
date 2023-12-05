import { RefObject } from 'react'
import styled from 'styled-components'
import { Image } from '@owlbear-rodeo/sdk'
import { Text } from '../../components/atoms/typography'
import { PlayerTag } from '../../components/molecules/player-tag'
import { Token } from '../../components/molecules/token'

type Props = {
  isPlayer: boolean
  unit: Image
  letPlayersEnterOwnInitiative: boolean
  index: number
  nextInputs: RefObject<HTMLInputElement>[]
  hideToken?: boolean
  disableRandom?: boolean
  hidePlayerTag?: boolean
}

export const InitiativeInput = ({
  isPlayer,
  unit,
  letPlayersEnterOwnInitiative,
  index,
  nextInputs,
  hideToken = false,
  disableRandom = false,
  hidePlayerTag = false,
}: Props) => (
  <TurnTaker>
    <NameContainer>
      {!hideToken && <Token image={unit} height='32px' width='auto' />}
      <Name>{unit.text.plainText}</Name>
      {isPlayer && !hidePlayerTag ? <PlayerTag /> : ''}
    </NameContainer>
    {isPlayer && letPlayersEnterOwnInitiative ? (
      <WaitingContainer>
        <Text>Waiting...</Text>
      </WaitingContainer>
    ) : (
      <InitiativeInputField
        ref={index > 0 ? nextInputs[index - 1] : undefined}
        type='number'
        onKeyDown={e => {
          if (e.key !== 'Enter') return
          if (!disableRandom) {
            e.currentTarget.value = String(Math.ceil(Math.random() * 20))
          }
          const nextInput = index >= nextInputs.length ? undefined : nextInputs[index]
          if (nextInput?.current) {
            nextInput.current.focus()
            nextInput.current.select()
          }
        }}
      />
    )}
  </TurnTaker>
)

const WaitingContainer = styled.div`
  margin: 8px 12px 8px 0;
  height: 32px;
  display: flex;
  align-items: center;
`

const InitiativeInputField = styled.input`
  width: 28px;
  height: 30px;
  margin-right: 12px;
  margin: 8px 12px 8px 0;
  border: none;
  border-radius: 4px;
  outline: none;
  font-weight: bold;
  text-align: center;
`

const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 8px;
`

const Name = styled(Text)`
  text-align: left;
  font-weight: bold;
  font-size: 16px;
  margin-left: 8px;
  margin-right: 8px;
`

const TurnTaker = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 4px;
`
