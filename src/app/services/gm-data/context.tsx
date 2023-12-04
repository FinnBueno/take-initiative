import OBR from '@owlbear-rodeo/sdk'
import { ReactNode, createContext, useEffect, useState } from 'react'

type ContextData = {
  gmIDs: string[]
  isGM: boolean
}

const DEFAULT_VALUE: ContextData = { gmIDs: [''], isGM: false }

export const GMIDContext = createContext<ContextData>(DEFAULT_VALUE)

export const GMIDContextProvider = ({ children }: { children: ReactNode }) => {
  const [gmData, setGMData] = useState<ContextData>(DEFAULT_VALUE)

  const initializeValues = () => {
    const asyncTasks = async (): Promise<[string[], boolean]> => {
      const self = {
        id: OBR.player.id,
        role: await OBR.player.getRole(),
      }
      const everyone = [...(await OBR.party.getPlayers()), self]
      const peopleWithGmRights = everyone.filter(player => player.role === 'GM')
      const isViewerDM = !!peopleWithGmRights.find(player => player.id === self.id)
      return [peopleWithGmRights.map(({ id }) => id), isViewerDM]
    }
    asyncTasks().then(([gmIDs, isGM]) => setGMData({ gmIDs, isGM }))
  }

  useEffect(() => {
    OBR.onReady(() => {
      initializeValues()
    })
    if (OBR.isReady) {
      initializeValues()
    }
  }, [])
  return <GMIDContext.Provider value={gmData}>{children}</GMIDContext.Provider>
}
