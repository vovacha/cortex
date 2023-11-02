import { createContext } from 'react'
import type { ApiKey } from '@/interfaces'

export const ApiKeyContext = createContext<ApiKey | undefined>(undefined)
