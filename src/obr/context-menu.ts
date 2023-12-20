import OBR, { Image, Item } from '@owlbear-rodeo/sdk'
import { buildCharacterMetadata, buildSceneMetadata, castMetadata, extId } from '../util/general'
import { INITIATIVE_KEY } from '../util/constants'
import { SceneMetadata } from '../util/metadata'

export const setupContextMenu = () => {
  OBR.contextMenu.create({
    id: extId('context-menu'),
    icons: [
      {
        icon: '/d20.svg',
        label: 'Add to initiative',
        filter: {
          roles: ['GM'],
          every: [
            {
              key: 'layer',
              value: 'CHARACTER',
            },
          ],
          some: [
            {
              key: ['metadata', extId(INITIATIVE_KEY)],
              value: undefined,
            },
          ],
        },
      },
    ],
    onClick(context) {
      OBR.scene.getMetadata().then(sceneMD => {
        OBR.scene.setMetadata(buildSceneMetadata({ state: 'STARTING' }, castMetadata<SceneMetadata>(sceneMD)))
        OBR.scene.items.updateItems(context.items, (items: Item[]) => {
          const images = items.filter(token => token.type === 'IMAGE' && token.layer === 'CHARACTER') as Image[]
          for (const image of images) {
            image.metadata = buildCharacterMetadata()
          }
        })
      })
    },
  })
}
