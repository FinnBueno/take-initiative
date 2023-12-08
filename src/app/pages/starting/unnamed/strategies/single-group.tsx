import { InitiativeInput } from '../../../../components/molecules/initiative-input'
import styled from 'styled-components'
import { StrategyProps } from '../select-unnamed-strategy'
import { getMetadata, setInitiativeForList } from '../../../../../util/general'
import { CharacterMetadata } from '../../../../../util/metadata'

export const SingleGroup = ({ units }: StrategyProps) => {
  const storedInitiative = getMetadata<CharacterMetadata>(units[0])?.initiative
  return (
    <Wrapper>
      <InitiativeInput
        isPlayer={false}
        letPlayersEnterOwnInitiative={false}
        name='All unnamed characters'
        onChange={init => setInitiativeForList(units, init)}
        defaultValue={storedInitiative}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
