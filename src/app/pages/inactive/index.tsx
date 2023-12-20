import styled from 'styled-components'
import { HandwritingText, Text, Title } from '../../components/atoms/typography'
import { D20 } from '../../components/atoms/svg/d20'
import { useState } from 'react'
import { Button } from '../../components/atoms/button'
import { TokenStatsPage } from '../stats'
import { Divider } from '../../components/atoms/divider'

const INTRO_TEXTS = ['You take your sword to strike at the goblin...', 'You line up your arrow, aiming for the orc...']

const randomIntroText = () => INTRO_TEXTS[Math.floor(Math.random() * INTRO_TEXTS.length)]

export const InactivePage = () => {
  const [showStatsScreen, setShowStatsScreen] = useState(false)
  if (showStatsScreen) {
    return <TokenStatsPage goBack={() => setShowStatsScreen(false)} />
  }
  return (
    <TotalContainer>
      <HandwritingText>{randomIntroText()}</HandwritingText>
      <TitleContainer style={{ marginBottom: '48px', marginTop: '24px' }}>
        <D20 color='white' size='40px' />
        <Title>Roll initiative!</Title>
        <D20 color='white' size='40px' />
      </TitleContainer>
      <Text>Select tokens on the map and then add them to the initiative using the context menu</Text>
      <Divider />
      <Text>You can configure things like health and armor class for tokens in your library.</Text>
      <Spacing>
        <Button onClick={() => setShowStatsScreen(true)}>Configure token stats</Button>
      </Spacing>
    </TotalContainer>
  )
}

const Spacing = styled.div`
  margin-top: 12px;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const TotalContainer = styled.div`
  margin: 12px;
  margin-top: 32px;
`
