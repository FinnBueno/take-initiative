import OBR, { Image } from '@owlbear-rodeo/sdk'
import styled from 'styled-components'
import { Text, Title } from '../../components/atoms/typography'
import { RefObject, createRef, useEffect, useMemo, useState } from 'react'
import { useGMData } from '../../services/gm-data/hook'
import { PlayerTag } from '../../components/molecules/player-tag'
import { castMetadata } from '../../../util/general'
import { SceneMetadata } from '../../../util/metadata'

type Props = {
  units: Image[]
}

export const ConfigureNamedUnits = ({ units }: Props) => {
  const enterRandomInitiative = (e: React.KeyboardEvent<HTMLInputElement>, nextInput?: RefObject<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.currentTarget.value = String(Math.ceil(Math.random() * 20))
    if (nextInput?.current) {
      nextInput.current.focus()
      nextInput.current.select()
    }
  }

  const nextInputs = Array.from({ length: units.length - 1 }, () => createRef<HTMLInputElement>())

  const dmData = useGMData()

  // const [letPlayersEnterOwnInitiative, setLetPlayersEnterOwnInitiative] = useState(true)

  // useEffect(() => {
  //   OBR.room.getMetadata().then(md => {
  //     const roomMetadata = castMetadata<SceneMetadata>(md)
  //   })
  // }, [OBR.room.id])

  return (
    <Wrapper>
      <TitleContainer>
        <Title $level={3}>Named units</Title>
        <Text>
          Assign these units an initiative, or press enter inside the input field to generate one automatically.
        </Text>
      </TitleContainer>
      <TurnTakerContainer>
        {units.map((unit, index) => {
          const isPlayer = !dmData.gmIDs.find(dmID => dmID === unit.createdUserId)
          return (
            <TurnTaker key={unit.id}>
              <NameContainer>
                <Name>{unit.text.plainText}</Name>
                {isPlayer ? <PlayerTag /> : ''}
              </NameContainer>
              <InitiativeInput
                ref={index > 0 ? nextInputs[index - 1] : undefined}
                type='number'
                onKeyDown={e => enterRandomInitiative(e, index >= nextInputs.length ? undefined : nextInputs[index])}
              />
            </TurnTaker>
          )
        })}
      </TurnTakerContainer>
    </Wrapper>
  )
}

const InitiativeInput = styled.input`
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
  & > *:first-child {
    margin-right: 8px;
  }
`

const Name = styled(Text)`
  text-align: left;
  font-weight: bold;
  font-size: 16px;
  margin-left: 12px;
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
