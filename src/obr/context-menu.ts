import ORB, { Image, Item } from '@owlbear-rodeo/sdk'
import { buildCharacterMetadata, buildSceneMetadata, extId } from '../util/general'
import { INITIATIVE_KEY } from '../util/constants'

export const setupContextMenu = () => {
  ORB.contextMenu.create({
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
      ORB.scene.items.updateItems(context.items, (items: Item[]) => {
        const images = items.filter(token => token.type === 'IMAGE') as Image[]
        ORB.scene.setMetadata(buildSceneMetadata({ state: 'STARTING' }))
        for (const image of images) {
          image.metadata = buildCharacterMetadata()
        }
      })
    },
  })
}
