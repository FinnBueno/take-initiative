import OBR from '@owlbear-rodeo/sdk'
import { useEffect } from 'react'

type Callback<T> = (param: T) => void

// type Fetcher<T> = {
//   onChange: { listener: (callback: Callback<T>) => () => void; run: Callback<T> }
//   get: { listener: () => Promise<T>; run: Callback<T> }
//   waitForScene?: boolean
// }

export type Fetcher<T> = {
  onChange: (callback: Callback<T>) => () => void
  get: () => Promise<T>
  run: Callback<T>
  waitForScene?: boolean
  onUnmount?: () => void
}

export function useOBR<T>(fetchers: Fetcher<T>) {
  const { onChange, get, run, waitForScene } = fetchers
  useEffect(() => {
    let returnFunction: (() => void) | undefined = undefined
    OBR.onReady(() => {
      if (waitForScene) {
        OBR.scene.onReadyChange(ready => {
          if (!ready) return
          returnFunction = onChange(run)
          get().then(run)
        })
      } else {
        returnFunction = onChange(run)
        get().then(run)
      }
    })
    if (OBR.isReady) {
      get().then(run)
    }
    return () => {
      if (returnFunction) returnFunction()
      if (fetchers.onUnmount) fetchers.onUnmount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
