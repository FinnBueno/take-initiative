import OBR from '@owlbear-rodeo/sdk'
import { useEffect } from 'react'

type Callback<T> = (param: T) => void

type OBRFetcher<T> = {
  onChange: { listener: (callback: Callback<T>) => () => void; run: Callback<T> }
  get: { listener: () => Promise<T>; run: Callback<T> }
  waitForScene?: boolean
}

export function useOBR<T>(obrFetchers: OBRFetcher<T>) {
  const { onChange, get, waitForScene } = obrFetchers
  useEffect(() => {
    let returnFunction = undefined
    OBR.onReady(() => {
      if (waitForScene) {
        OBR.scene.onReadyChange(ready => {
          if (!ready) return
          returnFunction = onChange.listener(onChange.run)
        })
      } else {
        returnFunction = onChange.listener(onChange.run)
      }
    })
    if (OBR.isReady && waitForScene ? OBR.scene.isReady : true) {
      get.listener().then(get.run)
    }
    return returnFunction
  })
}
