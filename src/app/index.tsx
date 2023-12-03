import { useEffect, useState } from 'react'
import './main.css'
import ORB from '@owlbear-rodeo/sdk'
import { castMetadata } from '../util/general'
import { SceneInitiativeState, SceneMetadata } from '../util/initiative'
import { StartingPage } from './starting'
import { InactivePage } from './inactive'

function App() {
  const [initiativeState, setInitiativeState] = useState<SceneInitiativeState>('INACTIVE')

  const setState = (sceneMetadata: SceneMetadata) => {
    if (sceneMetadata) setInitiativeState(sceneMetadata.state)
  }

  useEffect(() => {
    ORB.onReady(() => {
      ORB.scene.onReadyChange(ready => {
        if (!ready) return
        ORB.scene.onMetadataChange(md => setState(castMetadata<SceneMetadata>(md)))
        ORB.scene.getMetadata().then(md => setState(castMetadata<SceneMetadata>(md)))
      })
    })
    ORB.scene.getMetadata().then(md => setState(castMetadata<SceneMetadata>(md)))
  }, [])
  switch (initiativeState) {
    case 'INACTIVE':
      return <InactivePage />
    case 'STARTING':
      return <StartingPage />
    case 'RUNNING':
      return <>Running!</>
  }
}

export default App
