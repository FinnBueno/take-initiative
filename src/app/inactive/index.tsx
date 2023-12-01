import styled from 'styled-components'
import { Text, Title } from '../components/atoms/typography'

const INTRO_TEXTS = [
  'You take your sword to strike at the goblin...',
  'You line up your arrow, aiming for the orc...'
]

const randomIntroText = () => INTRO_TEXTS[Math.floor(Math.random() * INTRO_TEXTS.length)]

export const InactivePage = () => {
  return (
    <TotalContainer>
      <Text>{randomIntroText()}</Text>
      <Title style={{ marginBottom: '48px' }}>
        Roll initiative!
      </Title>
      <Text>Select tokens on the map and then add them to the initiative using the context menu</Text>
    </TotalContainer>
  )
}

const TotalContainer = styled.div`
`