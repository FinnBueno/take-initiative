import styled from 'styled-components'

type Identifiable = { id: string }

type Props<T extends Identifiable> = {
  options: T[]
  row: (item: T) => string
  onSelect: (item: T) => void
  defaultOption?: T
}

export function Select<T extends Identifiable>({ options, row, onSelect, defaultOption }: Props<T>) {
  return (
    <StyledSelect
      defaultValue={defaultOption?.id}
      onChange={e => {
        const option = options.find(o => o.id === e.target.value)
        if (option) onSelect(option)
      }}
    >
      {options.map(option => {
        return (
          <Option key={option.id} value={option.id}>
            {row(option)}
          </Option>
        )
      })}
    </StyledSelect>
  )
}

const Option = styled.option`
  color: black;
`

const StyledSelect = styled.select`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
  padding: 4px 2px;
  border: 0;
  border-radius: 8px;
  color: var(--text-color);
`
