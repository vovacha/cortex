// https://dev.to/aws-builders/how-to-use-amazon-cognito-with-reacttypescript-4elj
import { Amplify, Auth } from 'aws-amplify'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AwsConfigAuth } from '../auth.conf'

Amplify.configure({ Auth: AwsConfigAuth })

interface UseAuth {
  isLoading: boolean
  isAuthenticated: boolean
  username: string
  signIn: (username: string, password: string) => Promise<Result>
  signOut: () => Promise<Result>
}

interface Result {
  success: boolean
  message: string
}

interface Props {
  children?: React.ReactNode
};

const authContext = createContext<UseAuth | null>(null)

export const ProvideAuth: React.FC<Props> = ({ children }) => {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
};

export const useAuth: any = () => {
  return useContext(authContext)
}

const useProvideAuth = (): UseAuth => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((result) => {
        setUsername(result.username)
        setIsAuthenticated(true)
        setIsLoading(false)
      })
      .catch(() => {
        setUsername('')
        setIsAuthenticated(false)
        setIsLoading(false)
      })
  }, [])

  const signIn = async (username: string, password: string): Promise<Result> => {
    try {
      const result = await Auth.signIn(username, password)
      setUsername(result.username)
      setIsAuthenticated(true)
      return { success: true, message: '' }
    } catch (error) {
      return {
        success: false,
        message: 'LOGIN FAIL'
      }
    }
  }

  const signOut = async (): Promise<Result> => {
    try {
      await Auth.signOut()
      setUsername('')
      setIsAuthenticated(false)
      return { success: true, message: '' }
    } catch (error) {
      return {
        success: false,
        message: 'LOGOUT FAIL'
      }
    }
  }

  return {
    isLoading,
    isAuthenticated,
    username,
    signIn,
    signOut
  }
}
