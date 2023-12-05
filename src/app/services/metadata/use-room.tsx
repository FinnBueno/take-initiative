import { useState } from 'react'
import { RoomMetadata, defaultRoomMetadata } from '../../../util/metadata'
import { useOBR } from '../use-obr-data'
import OBR from '@owlbear-rodeo/sdk'
import { castMetadata } from '../../../util/general'

export const useRoomMetadata = () => {
  const [roomMetadata, setRoomMetadata] = useState<RoomMetadata>(defaultRoomMetadata)
  useOBR({
    onChange: cb => OBR.room.onMetadataChange(cb),
    get: () => OBR.room.getMetadata(),
    run: md => setRoomMetadata(castMetadata<RoomMetadata>(md)),
  })
  return roomMetadata
}
