import { Item, Metadata } from '@owlbear-rodeo/sdk'
import { EXTENSION_ID } from './constants'
import { CharacterMetadata, RequiredSceneMetadata, SceneMetadata, defaultSceneMetadata } from './initiative'

export const extId = (txt: string) => `${EXTENSION_ID}/${txt}`

export const buildMetadata = (metadata: Metadata) => {
  const result: Metadata = {}
  result[extId('metadata')] = metadata
  return result
}

export const buildSceneMetadata = (sceneData: RequiredSceneMetadata) =>
  buildMetadata({ ...defaultSceneMetadata, ...sceneData })

export const buildCharacterMetadata = () => buildMetadata({ partOfCombat: true } as CharacterMetadata)

type MetadataTypes = SceneMetadata | CharacterMetadata

export const castMetadata = <T extends MetadataTypes>(metadata: Metadata): T => {
  return metadata[extId('metadata')] as T
}

export const getMetadata = <T extends MetadataTypes>(item: Item): T => {
  return item.metadata[extId('metadata')] as T
}

export const removeCharacterFromInitiative = (item: Item) => {
  item.metadata[extId('metadata')] = undefined
}
