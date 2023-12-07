import { ReactNode, useEffect, useState } from 'react'
import './main.css'
import ORB, { Metadata, Theme } from '@owlbear-rodeo/sdk'
import { castMetadata } from '../../util/general'
import { SceneInitiativeState, SceneMetadata } from '../../util/metadata'
import { StartingPage } from './starting'
import { InactivePage } from './inactive'
import { GMIDContextProvider } from '../services/gm-data/context'
import styled, { createGlobalStyle } from 'styled-components'
import { Cogs } from '../components/atoms/svg/cogs'
import { ButtonIcon } from '../components/atoms/button-icon'
import { Settings } from './settings'
import { useOBR } from '../services/use-obr-data'
import OBR from '@owlbear-rodeo/sdk'
import { SettingsButton } from './settings/settings-button'
import { RunningPage } from './running'

function App() {
  const [theme, setTheme] = useState<Theme | undefined>()

  const [initiativeState, setInitiativeState] = useState<SceneInitiativeState>('INACTIVE')

  const [showSettings, setShowSettings] = useState(false)

  const setState = (sceneMetadata: SceneMetadata) => {
    if (sceneMetadata) setInitiativeState(sceneMetadata.state)
  }

  useOBR<Metadata>({
    onChange: cb => OBR.scene.onMetadataChange(cb),
    get: () => OBR.scene.getMetadata(),
    run: md => setState(castMetadata<SceneMetadata>(md)),
    waitForScene: true,
  })

  useOBR<Theme>({
    onChange: cb => OBR.theme.onChange(cb),
    get: () => OBR.theme.getTheme(),
    run: setTheme,
  })

  let content: ReactNode
  switch (initiativeState) {
    case 'INACTIVE':
      content = <InactivePage />
      break
    case 'STARTING':
      content = <StartingPage />
      break
    case 'RUNNING':
      content = <RunningPage />
      break
    default:
      content = <></>
  }
  return (
    <GMIDContextProvider>
      {theme && <GlobalStyle isLight={theme.mode === 'LIGHT'} theme={theme} />}
      <SettingsButton onPress={() => setShowSettings(s => !s)} />
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
  --primary-color: ${props => props.theme.primary.main};
  --primary-text-color: ${props => props.theme.primary.contrastText};
  --secondary-color: ${props => props.theme.secondary.main};
  --secondary-text-color: ${props => props.theme.secondary.contrastText};

  color: var(--text-color);
}
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export default App
