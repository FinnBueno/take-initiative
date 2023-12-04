import { ReactNode, useEffect, useState } from 'react'
import './main.css'
import ORB, { Theme } from '@owlbear-rodeo/sdk'
import { castMetadata } from '../util/general'
import { SceneInitiativeState, SceneMetadata } from '../util/metadata'
import { StartingPage } from './pages/starting'
import { InactivePage } from './pages/inactive'
import { GMIDContextProvider } from './services/gm-data/context'
import styled, { createGlobalStyle } from 'styled-components'
import { Cogs } from './components/atoms/svg/cogs'
import { ButtonIcon } from './components/atoms/button-icon'
import { Settings } from './pages/settings'

function App() {
  const [theme, setTheme] = useState<Theme | undefined>()

  const [initiativeState, setInitiativeState] = useState<SceneInitiativeState>('INACTIVE')

  const [showSettings, setShowSettings] = useState(false)

  const setState = (sceneMetadata: SceneMetadata) => {
    if (sceneMetadata) setInitiativeState(sceneMetadata.state)
  }

  useEffect(() => {
    const returnFunctions: (() => void)[] = []
    ORB.onReady(() => {
      ORB.scene.onReadyChange(ready => {
        if (!ready) return
        returnFunctions.push(ORB.scene.onMetadataChange(md => setState(castMetadata<SceneMetadata>(md))))
        returnFunctions.push(ORB.theme.onChange(theme => setTheme(theme)))
        ORB.theme.getTheme().then(setTheme)
        ORB.scene.getMetadata().then(md => setState(castMetadata<SceneMetadata>(md)))
      })
    })
    if (ORB.isReady) {
      ORB.theme.getTheme().then(setTheme)
      ORB.scene.getMetadata().then(md => setState(castMetadata<SceneMetadata>(md)))
    }
    return () => returnFunctions.forEach(func => func())
  }, [])

  let content: ReactNode
  switch (initiativeState) {
    case 'INACTIVE':
      content = <InactivePage />
      break
    case 'STARTING':
      content = <StartingPage />
      break
    case 'RUNNING':
      content = <>Running!</>
      break
    default:
      content = <></>
  }
  return (
    <GMIDContextProvider>
      {theme && <GlobalStyle isLight={theme.mode === 'LIGHT'} theme={theme} />}
      <CogsContainer>
        <CogsButton onClick={() => setShowSettings(s => !s)}>
          <Cogs />
        </CogsButton>
      </CogsContainer>
      <Container>
        <Settings open={showSettings} />
        {content}
      </Container>
    </GMIDContextProvider>
  )
}

const GlobalStyle = createGlobalStyle<{ isLight: boolean; theme: Theme }>`
:root {
  --highlight-color: ${props => props.theme.primary.main};
  --highlight-color-hover: ${props => props.theme.primary.main};
  --text-color: ${props => props.theme.text.primary};

  color: var(--text-color);
}
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const CogsContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 12px;
`

const CogsButton = styled(ButtonIcon)`
  position: relative;
  z-index: 10;
`

export default App
