import styled from 'styled-components'
import { SmallInputField } from '../atoms/small-input-field'
import { Shield } from '../atoms/svg/shield'
import { Heart } from '../atoms/svg/heart'
import { ComponentProps, forwardRef } from 'react'
import { Statblock } from '../atoms/svg/statblock'
import { Damage } from '../atoms/svg/damage'

type Direction = 'LEFT' | 'RIGHT'

type Props = Omit<ComponentProps<typeof SmallInputField>, 'size'> & {
  direction: Direction
  icon: typeof Shield | typeof Heart | typeof Statblock | typeof Damage
  size?: string
}

export const StatInput = forwardRef<HTMLInputElement, Props>(({ icon: Icon, size, direction, ...rest }, ref) => (
  <Option $direction={direction}>
    <SmallInputField {...rest} noMargin ref={ref} />
    <Icon size={size} />
  </Option>
))

const Option = styled.div<{ $direction: Direction }>`
  display: flex;
  flex-direction: ${props => (props.$direction === 'RIGHT' ? 'row' : 'row-reverse')};
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-top: 8px;
  padding: 4px 4px;
  & > input {
    margin: 0 2px;
    padding: 2px;
  }
`
