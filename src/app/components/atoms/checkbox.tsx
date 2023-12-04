import styled from 'styled-components'

export const Checkbox = ({
  onToggle,
  defaultValue,
}: {
  onToggle: (toggledOn: boolean) => void
  defaultValue: boolean
}) => {
  return <Input type='checkbox' value={String(defaultValue)} onChange={e => onToggle(e.currentTarget.checked)} />
}

// https://moderncss.dev/pure-css-custom-checkbox-style/
const Input = styled.input`
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  font: inherit;
  color: var(--text-color);
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid var(--text-color);
  border-radius: 0.15em;
  transform: translateY(-0.075em);
  cursor: pointer;

  display: grid;
  place-content: center;
  &::before {
    content: '';
    width: 0.65em;
    height: 0.65em;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--highlight-color);
    transform-origin: bottom left;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  &:checked::before {
    transform: scale(1);
  }
`
