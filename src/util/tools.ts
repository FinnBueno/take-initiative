import { Image } from '@owlbear-rodeo/sdk'

export const NaNToUndefined = (nmbr: number): number | undefined => {
  if (isNaN(nmbr)) {
    return undefined
  } else {
    return nmbr
  }
}

export function seperateNamedAndUnnamed(units: Image[]): [Image[], Image[]] {
  return units.reduce<[Image[], Image[]]>(
    (total, next) => {
      total[next.text.plainText ? 0 : 1].push(next)
      return total
    },
    [[], []]
  )
}

type GroupedUnits = {
  [key: string]: Image[]
}

export const groupUnits = (units: Image[]): GroupedUnits =>
  Object.fromEntries(
    units
      .reduce((total, next) => {
        const collectionForType = total.get(next.name)
        if (collectionForType) {
          collectionForType.push(next)
        } else {
          total.set(next.name, [next])
        }
        return total
      }, new Map<string, Image[]>())
      .entries()
  )
