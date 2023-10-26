import React, { createContext, useContext, useEffect, useState } from 'react'
import { useCurrentActiveUser } from '../services/queries'

interface UseAuth {
  isLoading: boolean
  isAuthenticated: boolean
  username: string
  signIn: (username: string) => void
  signOut: () => void
}

interface Props {
  children?: React.ReactNode
}

const authContext = createContext<UseAuth | null>(null)

export const ProvideAuth: React.FC<Props> = ({ children }) => {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth: any = () => {
  return useContext(authContext)
}

const useProvideAuth = (): UseAuth => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const currentActiveUser = useCurrentActiveUser()

  useEffect(() => {
    setIsAuthenticated(!currentActiveUser.isError)
    setUsername(currentActiveUser.data?.getUsername() ?? '')
    setIsLoading(false)
  }, [currentActiveUser])

  const signIn = (username: string): void => {
    setUsername(username)
    setIsAuthenticated(true)
  }

  const signOut = (): void => {
    setUsername('')
    setIsAuthenticated(false)
  }

  return {
    isLoading,
    isAuthenticated,
    username,
    signIn,
    signOut
  }
}
