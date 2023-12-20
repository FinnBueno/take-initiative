import styled from 'styled-components'

export const ButtonIcon = styled.div`
  padding: 0;
  margin: 0;
  background-color: transparent;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  border: none;
  color: var(--text-color);
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus,
  &:focus-visible {
    outline: none;
  }
`
