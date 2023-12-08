import { InitiativeInput } from '../../../../components/molecules/initiative-input'
import styled from 'styled-components'
import { StrategyProps } from '../select-unnamed-strategy'
import { createRef } from 'react'
import { getMetadata, setInitiativeForList } from '../../../../../util/general'
import { CharacterMetadata } from '../../../../../util/metadata'
import { groupUnits } from '../../../../../util/tools'

export const TypeGroup = ({ units }: StrategyProps) => {
  const groupedUnits = groupUnits(units)
  const groupedUnitsEntries = Object.entries(groupedUnits)
  const nextInputs = Array.from({ length: groupedUnitsEntries.length - 1 }, () => createRef<HTMLInputElement>())

  return (
    <Wrapper>
      {groupedUnitsEntries.map(([type, units], index) => {
        const storedInitiative = getMetadata<CharacterMetadata>(units[0])?.initiative
        return (
          <InitiativeInput
            key={type}
            isPlayer={false}
            unit={units[0]}
            letPlayersEnterOwnInitiative={false}
            index={index}
            nextInputs={nextInputs}
            name={`${type} (x${units.length})`}
            defaultValue={storedInitiative}
            onChange={init => {
              console.log('onChange', init, units[0].name)
              setInitiativeForList(units, init)
            }}
          />
        )
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
