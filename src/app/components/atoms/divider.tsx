import styled from 'styled-components'

export const Divider = styled.div<{ $size?: number }>`
  height: 1px;
  width: 100%;
  background-color: var(--darken);
  margin: ${props => `${(props.$size ?? 3) * 8}px`} 0;
`
