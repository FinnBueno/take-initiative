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
        // const { named, unnamed } = images.reduce<{named:Image[], unnamed:Image[]}>((allImages, image) => {
        //     allImages[image.text.plainText ? 'named' : 'unnamed'].push(image)
        //     return allImages
        // }, { named: [], unnamed: [] })
        // window.alert(`Found ${named.length} named tokens: ${named.map(image => image.text.plainText)}`)
        // window.alert(`Found ${unnamed.length} unnamed tokens`)
        ORB.scene.setMetadata(buildSceneMetadata({ state: 'STARTING' }))
        for (const image of images) {
          image.metadata = buildCharacterMetadata()
        }
      })
    },
  })
}
