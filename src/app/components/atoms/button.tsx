import styled from 'styled-components'

export const Button = styled.button<{ primary?: boolean }>`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: ${props => (props.primary ? 'var(--primary-color)' : '#1a1a1a')};
  color: ${props => (props.primary ? 'var(--primary-text-color)' : 'white')};
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: #646cff;
  }
  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`
