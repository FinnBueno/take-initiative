export const NaNToUndefined = (nmbr: number): number | undefined => {
  if (isNaN(nmbr)) {
    return undefined
  } else {
    return nmbr
  }
}
