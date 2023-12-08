import styled from 'styled-components'
import { Text, Title } from '../../../components/atoms/typography'
import { Image } from '@owlbear-rodeo/sdk'
import { Button } from '../../../components/atoms/button'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { Select } from '../../../components/atoms/select'
import { TypeGroup } from './strategies/type-groups'
import { Individual } from './strategies/individual'
import { SingleGroup } from './strategies/single-group'
import { UnnamedCharacterStrategy } from '../../../../util/metadata'

export type StrategyProps = { units: Image[] }

type Strategy = {
  id: UnnamedCharacterStrategy
  name: string
  description: string
  component: (props: StrategyProps) => ReactNode
}

const STRATEGIES: Strategy[] = [
  {
    id: 'INDIVIDUAL',
    name: 'Individual',
    description: 'Roll initiative for each character individually',
    component: Individual,
  },
  {
    id: 'TYPE_GROUP',
    name: 'Type groups',
    description: 'Group identical tokens and roll per group',
    component: TypeGroup,
  },
  {
    id: 'ONE_GROUP',
    name: 'One group',
    description: 'Group unnamed tokens together and roll once',
    component: SingleGroup,
  },
]

type Props = {
  units: Image[]
  currentStrategy: UnnamedCharacterStrategy
  updateStrategy: (newStrat: UnnamedCharacterStrategy) => void
}

export const SelectUnnamedStrategy = ({ units, currentStrategy, updateStrategy }: Props) => {
  const strategy = useMemo(() => STRATEGIES.find(s => s.id === currentStrategy), [currentStrategy])
  const StrategyComponent = strategy?.component
  return (
    <Wrapper>
      <Title $level={3}>Unnamed Tokens</Title>
      <Text>How do you want to generate initiative for unnamed tokens?</Text>
      <Select<Strategy>
        options={STRATEGIES}
        row={strat => `${strat.name} - ${strat.description}`}
        onSelect={strat => updateStrategy(strat.id)}
        defaultOption={strategy}
      />
      {StrategyComponent && <StrategyComponent units={units} />}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: start;
  padding: 12px;
`
