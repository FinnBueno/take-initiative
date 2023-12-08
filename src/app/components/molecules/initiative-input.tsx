import { RefObject, ChangeEvent } from 'react'
import styled from 'styled-components'
import { Image } from '@owlbear-rodeo/sdk'
import { Text } from '../atoms/typography'
import { PlayerTag } from './player-tag'
import { Token } from './token'
import { NaNToUndefined } from '../../../util/tools'

type Props = {
  isPlayer: boolean
  unit?: Image
  letPlayersEnterOwnInitiative: boolean
  index?: number
  nextInputs?: RefObject<HTMLInputElement>[]
  hideToken?: boolean
  disableRandom?: boolean
  hidePlayerTag?: boolean
  onChange?: (newInitiative?: number) => void
  overrideInitiativeValue?: number
  defaultValue?: number
  name?: string
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
  onChange = () => {},
  overrideInitiativeValue,
  defaultValue,
  name,
}: Props) => (
  <TurnTaker>
    <NameContainer>
      {!hideToken && unit && <Token image={unit} height='32px' width='auto' />}
      <Name>{name ?? unit?.text.plainText}</Name>
      {isPlayer && !hidePlayerTag ? <PlayerTag /> : ''}
    </NameContainer>
    {isPlayer && letPlayersEnterOwnInitiative ? (
      <WaitingContainer>
        <Text>{overrideInitiativeValue ? <b>{overrideInitiativeValue}</b> : 'Waiting...'}</Text>
      </WaitingContainer>
    ) : (
      <InitiativeInputField
        ref={index !== undefined && nextInputs && index > 0 ? nextInputs[index - 1] : undefined}
        type='number'
        defaultValue={defaultValue}
        // TODO: Debounce
        onChange={e => onChange(NaNToUndefined(e.currentTarget.valueAsNumber))}
        onKeyDown={e => {
          if (e.key !== 'Enter') return
          if (!disableRandom) {
            const newInitiative = Math.ceil(Math.random() * 20)
            e.currentTarget.value = String(newInitiative)
            onChange(newInitiative)
          }
          if (nextInputs && index !== undefined) {
            const nextInput = index >= nextInputs.length ? undefined : nextInputs[index]
            if (nextInput?.current) {
              nextInput.current.focus()
              nextInput.current.select()
            }
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
  justify-content: center;
  min-width: 32px;
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
