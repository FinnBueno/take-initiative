import { Image } from '@owlbear-rodeo/sdk'
import styled from 'styled-components'
import { Token } from '../../components/molecules/token'
import { Text } from '../../components/atoms/typography'

export type InitiativeEntry = {
  name: string
  id: string
  units: Image[]
  initiative: number
}

type Props = {
  entry: InitiativeEntry
  hideToken?: boolean
}

export const InitiativeRow = ({ entry, hideToken }: Props) => {
  return (
    <Wrapper>
      <NameContainer>
        {!hideToken && <Token image={entry.units[0]} height='42px' width='auto' />}
        <Name>{entry.name}</Name>
        {/* {isPlayer && !hidePlayerTag ? <PlayerTag /> : ''} */}
      </NameContainer>
    </Wrapper>
  )
}

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

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 4px;
  padding: 8px 0;
  width: 100%;
  position: relative;
`
