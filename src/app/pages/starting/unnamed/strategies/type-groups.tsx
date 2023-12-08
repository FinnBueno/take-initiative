import { Image } from '@owlbear-rodeo/sdk'
import { InitiativeInput } from '../../../../components/molecules/initiative-input'
import styled from 'styled-components'
import { StrategyProps } from '../select-unnamed-strategy'
import { createRef } from 'react'
import { setInitiativeForList } from '../../../../../util/general'

type GroupedUnits = {
  [key: string]: Image[]
}

// const createNamedImage = (unit: Image, amountBefore: number) => ({
//   battleName: `${unit.name} (${amountBefore + 1})`,
//   ...unit,
// })

const groupUnits = (units: Image[]): GroupedUnits =>
  Object.fromEntries(
    units
      .reduce((total, next) => {
        const collectionForType = total.get(next.name)
        if (collectionForType) {
          // collectionForType.push(createNamedImage(next, collectionForType.length))
          collectionForType.push(next)
        } else {
          // total.set(next.name, [createNamedImage(next, 0)])
          total.set(next.name, [next])
        }
        return total
      }, new Map<string, Image[]>())
      .entries()
  )

export const TypeGroup = ({ units }: StrategyProps) => {
  const groupedUnits = groupUnits(units)
  const groupedUnitsEntries = Object.entries(groupedUnits)
  const nextInputs = Array.from({ length: groupedUnitsEntries.length - 1 }, () => createRef<HTMLInputElement>())

  return (
    <Wrapper>
      {groupedUnitsEntries.map(([type, units], index) => (
        <InitiativeInput
          key={type}
          isPlayer={false}
          unit={units[0]}
          letPlayersEnterOwnInitiative={false}
          index={index}
          nextInputs={nextInputs}
          name={`${type} (x${units.length})`}
          onChange={init => setInitiativeForList(units, init)}
        />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
