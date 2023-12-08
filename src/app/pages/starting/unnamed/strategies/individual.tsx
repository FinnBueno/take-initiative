import { InitiativeInput } from '../../../../components/molecules/initiative-input'
import styled from 'styled-components'
import { StrategyProps } from '../select-unnamed-strategy'
import { createRef } from 'react'
import { getMetadata, setInitiativeForCharacter } from '../../../../../util/general'
import { CharacterMetadata } from '../../../../../util/metadata'

export const Individual = ({ units }: StrategyProps) => {
  const sortedUnits = units.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  const nextInputs = Array.from({ length: units.length - 1 }, () => createRef<HTMLInputElement>())

  const nameCounter = new Map<string, number>()
  const updateNameCounter = (name: string) => {
    const counter = (nameCounter.get(name) ?? 0) + 1
    nameCounter.set(name, counter)
    return counter
  }
  return (
    <Wrapper>
      {sortedUnits.map((unit, index) => {
        const storedInitiative = getMetadata<CharacterMetadata>(unit)?.initiative
        return (
          <InitiativeInput
            key={unit.id}
            isPlayer={false}
            unit={unit}
            letPlayersEnterOwnInitiative={false}
            index={index}
            nextInputs={nextInputs}
            name={`${unit.name} (${updateNameCounter(unit.name)})`}
            onChange={init => setInitiativeForCharacter(unit, init)}
            defaultValue={storedInitiative}
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
