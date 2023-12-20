import { useState } from 'react'
import { SceneMetadata, UnnamedCharacterStrategy, defaultSceneMetadata } from '../../../util/metadata'
import { useOBR } from '../use-obr-data'
import OBR, { Metadata } from '@owlbear-rodeo/sdk'
import { buildSceneMetadata, castMetadata } from '../../../util/general'

export const useScene = () => {
  const [metadata, setMetadata] = useState<SceneMetadata>({ ...defaultSceneMetadata, state: 'INACTIVE' })
  useOBR<Metadata>({
    onChange: cb => OBR.scene.onMetadataChange(cb),
    get: () => OBR.scene.getMetadata(),
    run: md => {
      setMetadata(castMetadata<SceneMetadata>(md))
    },
    waitForScene: true,
  })

  const [dpi, setDPI] = useState<number>(1)
  useOBR<number>({
    onChange: cb => OBR.scene.grid.onChange(g => cb(g.dpi)),
    get: () => OBR.scene.grid.getDpi(),
    run: setDPI,
    waitForScene: true,
  })

  const updateUnnamedCharacterStrategy = (unnamedCharacterStrategy: UnnamedCharacterStrategy) =>
    OBR.scene.setMetadata(buildSceneMetadata({ unnamedCharacterStrategy }, metadata))

  return {
    metadata,
    updateUnnamedCharacterStrategy,
    dpi,
  }
}
