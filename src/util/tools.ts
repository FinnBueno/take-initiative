import { Image, Item } from '@owlbear-rodeo/sdk'

export const NaNToUndefined = (nmbr?: number): number | undefined => {
  if (nmbr === undefined) return undefined
  if (isNaN(nmbr)) {
    return undefined
  } else {
    return nmbr
  }
}

export const abbreviate = (name: string) => {
  if (name.includes(' ')) {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
  } else {
    return name.charAt(0).toUpperCase() + name.slice(1, 3).toLowerCase()
  }
}

export const hasName = (image: Image) => {
  if (!image.text.plainText) return false
  const abbreviation = abbreviate(image.name)
  const splitName = image.text.plainText.split(' ')
  const name = splitName.slice(0, -1).join(' ')
  const identifier = splitName[splitName.length - 1]
  const isUnnamed = name === abbreviation && !isNaN(+identifier)
  return !isUnnamed
}

export function seperateNamedAndUnnamed(units: Image[]): [Image[], Image[]] {
  return units.reduce<[Image[], Image[]]>(
    (total, next) => {
      total[hasName(next) ? 0 : 1].push(next)
      return total
    },
    [[], []]
  )
}

export type GroupedUnits<T> = {
  [key: string]: T[]
}

export function groupUnits<T extends Item>(units: T[]): GroupedUnits<T> {
  return Object.fromEntries(
    units
      .reduce((total, next) => {
        const collectionForType = total.get(next.name)
        if (collectionForType) {
          collectionForType.push(next)
        } else {
          total.set(next.name, [next])
        }
        return total
      }, new Map<string, T[]>())
      .entries()
  )
}
