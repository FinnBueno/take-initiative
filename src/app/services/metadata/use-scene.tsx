import { useState } from 'react'
import { SceneMetadata, UnnamedCharacterStrategy } from '../../../util/metadata'
import { useOBR } from '../use-obr-data'
import OBR, { Metadata } from '@owlbear-rodeo/sdk'
import { buildSceneMetadata, castMetadata } from '../../../util/general'

export const useScene = () => {
  const [metadata, setMetadata] = useState<SceneMetadata>(buildSceneMetadata({ state: 'INACTIVE' }))
  useOBR<Metadata>({
    onChange: cb => OBR.scene.onMetadataChange(cb),
    get: () => OBR.scene.getMetadata(),
    run: md => setMetadata(castMetadata<SceneMetadata>(md)),
    waitForScene: true,
  })

  const updateUnnamedCharacterStrategy = (unnamedCharacterStrategy: UnnamedCharacterStrategy) =>
    OBR.scene.setMetadata(buildSceneMetadata({ ...metadata, unnamedCharacterStrategy }))

  return { ...metadata, updateUnnamedCharacterStrategy }
}
