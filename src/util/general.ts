import OBR, { Item, Metadata } from '@owlbear-rodeo/sdk'
import { EXTENSION_ID } from './constants'
import { CharacterMetadata, RequiredSceneMetadata, RoomMetadata, SceneMetadata, defaultSceneMetadata } from './metadata'

export const extId = (txt: string) => `${EXTENSION_ID}/${txt}`

export const buildMetadata = (metadata: Metadata) => {
  const result: Metadata = {}
  result[extId('metadata')] = { ...metadata }
  return result
}

export const buildRoomMetadata = (roomMetadata: RoomMetadata, currentMetadata: RoomMetadata = {}) =>
  buildMetadata({ ...currentMetadata, ...roomMetadata }) as RoomMetadata

export const buildSceneMetadata = (sceneData: RequiredSceneMetadata) =>
  buildMetadata({ ...defaultSceneMetadata, ...sceneData }) as SceneMetadata

export const buildCharacterMetadata = () => buildMetadata({ partOfCombat: true } as CharacterMetadata)

type MetadataTypes = SceneMetadata | CharacterMetadata | RoomMetadata

export const castMetadata = <T extends MetadataTypes>(metadata: Metadata): T => {
  return metadata[extId('metadata')] as T
}

export const getMetadata = <T extends MetadataTypes>(item: Item): T => {
  return item.metadata[extId('metadata')] as T
}

export const removeListFromInitiative = (toRemove: Item[]) => {
  OBR.scene.items.updateItems(
    toRemove.map(({ id }) => id),
    (items: Item[]) => {
      items.forEach(item => (item.metadata[extId('metadata')] = undefined))
    }
  )
}

export const removeCharacterFromInitiative = ({ id }: Item) => {
  OBR.scene.items.updateItems([id], (items: Item[]) => {
    items.forEach(item => (item.metadata[extId('metadata')] = undefined))
  })
}

export const setInitiativeForCharacter = ({ id }: Item, initiative?: number) => {
  OBR.scene.items.updateItems([id], (items: Item[]) => {
    items.forEach(item => {
      const newMD = getMetadata<CharacterMetadata>(item)
      newMD.initiative = initiative
      item.metadata[extId('metadata')] = { ...newMD }
    })
  })
}

export const setInitiativeForList = (toUpdate: Item[], initiative?: number) => {
  OBR.scene.items.updateItems(toUpdate, (items: Item[]) => {
    items.forEach(item => {
      const newMD = getMetadata<CharacterMetadata>(item)
      newMD.initiative = initiative
      item.metadata[extId('metadata')] = { ...newMD }
    })
  })
}
