import { useState } from 'react'
import { RoomMetadata, TokenSetting, defaultRoomMetadata } from '../../../util/metadata'
import { useOBR } from '../use-obr-data'
import OBR from '@owlbear-rodeo/sdk'
import { buildRoomMetadata, castMetadata } from '../../../util/general'

export const useRoomMetadata = (id?: string) => {
  const [roomMetadata, setRoomMetadata] = useState<RoomMetadata>(defaultRoomMetadata)
  useOBR({
    onChange: cb =>
      OBR.room.onMetadataChange(md => {
        console.log('onChange!')
        return cb(md)
      }),
    get: () => OBR.room.getMetadata(),
    run: md => setRoomMetadata(castMetadata<RoomMetadata>(md)),
  })

  const updateTokenConfigurations = (newConfigurations: TokenSetting[]) => {
    const newSettings = newConfigurations.reduce((total, current) => {
      total[current.tokenName] = current
      return total
    }, roomMetadata.tokenSettings)
    OBR.room.setMetadata(buildRoomMetadata({ tokenSettings: newSettings }, roomMetadata))
  }

  const deleteTokenConfiguration = (name: string) => {
    delete roomMetadata.tokenSettings[name]
    OBR.room.setMetadata(buildRoomMetadata(roomMetadata))
  }

  console.log('new room md from ', id, roomMetadata)

  return { room: roomMetadata, updateTokenConfigurations, deleteTokenConfiguration }
}
