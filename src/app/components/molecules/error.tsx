import styled from 'styled-components'
import { Text } from '../atoms/typography'

type Props = {
  visible: boolean
  text: string
  nm?: boolean
  maxHeight?: number
}

export const Error = ({ visible, text, nm, maxHeight = 150 }: Props) => {
  return (
    <ErrorContainer $nm={nm} $visible={visible} $maxHeight={maxHeight}>
      <Text $variant='danger'>{text}</Text>
    </ErrorContainer>
  )
}

const ErrorContainer = styled.div<{ $nm?: boolean; $visible: boolean; $maxHeight: number }>`
  pointer-events: none;
  text-align: left;
  ${props => (props.$nm ? '' : 'margin: 0 12px 12px 12px;')}
  opacity: ${props => (props.$visible ? 1 : 0)};
  height: fit-content;
  max-height: ${props => (props.$visible ? props.$maxHeight : 0)}px;
  transition: max-height 0.25s ease-in-out, opacity 0.25s ease-in-out;
`
