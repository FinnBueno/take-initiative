import { Image } from '@owlbear-rodeo/sdk'
import styled from 'styled-components'
import { Text, Title } from '../components/atoms/typography'

type Props = {
  units: Image[]
}

export const ConfigureNamedUnits = ({ units }: Props) => {
  const enterRandomInitiative = (e: React.KeyboardEvent<HTMLInputElement>, unit: Image) => {
    if (e.key === 'Enter') console.log('Enter random initiative', e, unit)
  }
  return (
    <Wrapper>
      <TitleContainer>
        <Title level={3}>Named units</Title>
        <Text>
          Assign these units an initiative, or press enter inside the input field to generate one automatically.
        </Text>
      </TitleContainer>
      <TurnTakerContainer>
        {units.map(unit => (
          <TurnTaker key={unit.id}>
            <TurnTakerName>{unit.text.plainText}</TurnTakerName>
            <InitiativeInput type='number' onKeyDown={e => enterRandomInitiative(e, unit)} />
          </TurnTaker>
        ))}
      </TurnTakerContainer>
    </Wrapper>
  )
}

const InitiativeInput = styled.input`
  width: 28px;
  margin-right: 12px;
  margin: 8px 12px 8px 0;
  border: none;
  border-radius: 4px;
  outline: none;
  font-weight: bold;
  text-align: center;
`

const TurnTakerName = styled(Text)`
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
  background-color: rgba(255, 255, 255, 0.02);
  margin-top: 4px;
  /* padding: 4px 12px; */
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
