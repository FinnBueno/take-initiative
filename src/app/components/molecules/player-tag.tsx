import styled from 'styled-components'
import { Caption } from '../atoms/typography'

export const PlayerTag = () => (
  <Tag>
    <Caption>Player</Caption>
    {/* <UserIcon size='16px' /> */}
  </Tag>
)

const Tag = styled.div`
  width: fit-content;
  text-align: center;
  background-color: var(--highlight-color);
  padding: 2px 4px 3px 4px;
  margin: 0;
  border-radius: 16px;
  cursor: default;
`
