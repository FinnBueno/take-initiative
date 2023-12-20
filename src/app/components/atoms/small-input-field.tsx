import styled from 'styled-components'

export const SmallInputField = styled.input<{ noMargin?: boolean; noBackground?: boolean; width?: number }>`
  width: ${props => (props.width ? `${props.width}px` : 'calc(100% - 20px)')};
  ${props => (props.noMargin ? '' : 'margin: 8px;')}
  background-color: ${props => (props.noBackground ? 'transparent' : 'rgba(255, 255, 255, 0.3)')};
  border: none;
  border-radius: 4px;
  outline: none;
  font-weight: bold;
  text-align: center;
  color: var(--text-color);
  max-width: ${props => props.width ?? 50}px;
`
