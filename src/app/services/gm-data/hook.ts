import { useContext } from 'react'
import { GMIDContext } from './context'

export const useGMData = () => useContext(GMIDContext)
