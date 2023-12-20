import OBR, { Image, Item, Metadata, isImage } from '@owlbear-rodeo/sdk'
import { EXTENSION_ID } from './constants'
import {
  CharacterMetadata,
  RequiredSceneMetadata,
  RoomMetadata,
  SceneMetadata,
  defaultSceneMetadata,
  defaultRoomMetadata,
} from './metadata'
import { abbreviate, groupUnits, hasName } from './tools'

export const extId = (txt: string) => `${EXTENSION_ID}/${txt}`

export const buildMetadata = (metadata: Metadata, oldData: Metadata = {}, defaultData: Metadata = {}) => {
  const result: Metadata = {}
  result[extId('metadata')] = { ...defaultData, ...oldData, ...metadata }
  return result
}

export const buildRoomMetadata = (roomMetadata: Partial<RoomMetadata>, oldData?: RoomMetadata) =>
  buildMetadata(roomMetadata, oldData, defaultRoomMetadata) as RoomMetadata

export const buildSceneMetadata = (sceneData: Partial<RequiredSceneMetadata>, oldData?: SceneMetadata) =>
  buildMetadata(sceneData, oldData, defaultSceneMetadata) as SceneMetadata

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

export const setHealthForCharacter = (health: number, ...toUpdate: Item[]) => {
  OBR.scene.items.updateItems(toUpdate, items => {
    items.forEach((item: Item) => {
      const newMD = getMetadata<CharacterMetadata>(item)
      newMD.health = health
      item.metadata[extId('metadata')] = { ...newMD }
    })
  })
}

const FONT_SIZE_VALUES = [6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 21, 24, 36, 48, 60, 72]

export const addNicknamesToTokens = (listOfUnits: Image[], namedTurnTakers?: Image[]) => {
  const fontSizeOfNamedUnits = namedTurnTakers
    ? FONT_SIZE_VALUES[
        Math.floor(
          namedTurnTakers
            .map(ntt => FONT_SIZE_VALUES.indexOf(ntt.text.style.fontSize))
            .reduce((current, total) => total + current, 0) / namedTurnTakers.length
        )
      ]
    : FONT_SIZE_VALUES[10]
  return OBR.scene.items.updateItems(listOfUnits, items => {
    const grouped = groupUnits(items)
    Object.values(grouped).forEach(group => {
      const abbreviation = abbreviate(group[0].name)
      group.forEach((item, index) => {
        if (isImage(item)) {
          const asImage = item as Image
          asImage.textItemType = 'LABEL'
          asImage.text.type = 'PLAIN'
          asImage.text.plainText = `${abbreviation} ${index + 1}`
          asImage.text.style.fontSize = fontSizeOfNamedUnits
          asImage.text.style.padding = 6
        }
      })
    })
    return items
  })
}

export const removeUnnamedLabels = async () => {
  OBR.scene.items.updateItems(
    item => {
      if (item.layer !== 'CHARACTER' || !isImage(item)) return false

      return !hasName(item as Image)
    },
    items =>
      items.forEach((item: Item) => {
        const asImage = item as Image
        asImage.text.plainText = ''
      })
  )
}

export const stringSort = (a: string, b: string) => {
  if (a > b) {
    return 1
  } else if (a < b) {
    return -1
  }
  return 0
}
