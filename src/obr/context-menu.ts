import ORB, { Item } from '@owlbear-rodeo/sdk'
import { extId } from '../util/general'
import { INITIATIVE_KEY } from '../util/constants'

export const setupContextMenu = () => {
    ORB.contextMenu.create({
        id: extId('context-menu'),
        icons: [
            {
                icon: '/add.svg',
                label: 'Add to initiative',
                filter: {
                    roles: ['GM'],
                    every: [
                        {
                            key: 'layer',
                            value: 'CHARACTER'
                        }
                    ],
                    some: [
                        {
                            key: ['metadata', extId(INITIATIVE_KEY)],
                            value: undefined
                        }
                    ]
                }
            }
        ],
        onClick(context) {
            ORB.scene.items.updateItems(context.items, items => {
                for (const item of items) {
                    item.metadata
                }
            })
        },
    })
}