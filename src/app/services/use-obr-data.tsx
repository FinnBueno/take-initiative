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
    const listenAndFetch = () => {
      returnFunction = onChange(run)
      get().then(run)
    }
    const destroy = () => {
      if (returnFunction) returnFunction()
      if (fetchers.onUnmount) fetchers.onUnmount()
    }
    OBR.onReady(() => {
      // if we have to wait for the scene to load too, we need a lot of additional logic
      if (waitForScene) {
        // unlike OBR.onReady, OBR.scene.onReadyChange doesn't fire the first time so we
        // manually have to check if the scene is already ready at the time of running
        // isReady returns a promise, so wait for that
        OBR.scene.isReady().then(isSceneReady => {
          // if it's ready
          if (isSceneReady) {
            // then just place our listener and perform initial fetch like normal
            listenAndFetch()
          } else {
            // if we're not ready yet
            // we wait for the scene to be ready
            OBR.scene.onReadyChange(ready => {
              // check if the change was set to true
              if (ready) {
                // if so we start listening and perform initial fetch
                listenAndFetch()
              } else {
                // but if set to false
                // we must remove our listener
                destroy()
              }
            })
          }
        })
      } else {
        // no need to wait for the scene, yay!
        listenAndFetch()
      }
    })
    if (OBR.isReady) {
      get().then(run)
    }
    return destroy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
