import { Amplify, Auth } from 'aws-amplify'
import { useMutation, useQueryClient, useQuery, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query'
import { type CognitoUser, type ISignUpResult } from 'amazon-cognito-identity-js'

const AwsConfigAuth = {
  region: import.meta.env.VITE_AWS_REGION,
  userPoolId: import.meta.env.VITE_AWS_COGNITO_POOL_ID,
  userPoolWebClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,
  authenticationFlowType: 'USER_SRP_AUTH'
}
Amplify.configure({ Auth: AwsConfigAuth })

interface HasUsername {
  username: string
}

interface HasPassword {
  password: string
}

interface HasCode {
  code: string
}

export function useSignUpMut (): UseMutationResult<ISignUpResult, Error, HasUsername & HasPassword, unknown> {
  return useMutation({
    mutationFn: async ({ username, password }) => {
      const signUpParameters = {
        username,
        password,
        attributes: {
          email: username
        }
      }
      return await Auth.signUp(signUpParameters)
    }
  })
}

export function useConfirmSignUpMut (): UseMutationResult<any, Error, HasUsername & HasCode, unknown> {
  return useMutation({
    mutationFn: async ({ username, code }) => {
      return await Auth.confirmSignUp(username, code)
    }
  })
}

export function useSignInMut (): UseMutationResult<CognitoUser, Error, HasUsername & HasPassword, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ username, password }) => {
      return await Auth.signIn(username, password)
    },
    onSuccess: user => {
      queryClient.setQueryData(['authUser'], user)
    }
  })
}

export function useForgotPasswordRequestMut (): UseMutationResult<any, Error, HasUsername, unknown> {
  return useMutation({
    mutationFn: async ({ username }) => {
      return await Auth.forgotPassword(username)
    }
  })
}

export function useForgotPasswordSubmitMut (): UseMutationResult<string, Error, HasUsername & HasPassword & HasCode, unknown> {
  return useMutation({
    mutationFn: async ({ username, password, code }) => {
      return await Auth.forgotPasswordSubmit(username, code, password)
    }
  })
}

export function useSignOutMut (): UseMutationResult<any, Error, void, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      return await Auth.signOut()
    },
    onSuccess: async () => {
      queryClient.removeQueries(['authUser'], { exact: true })
    }
  })
}

export function useCurrentActiveUser (): UseQueryResult<CognitoUser, unknown> {
  return useQuery({
    retry: false,
    queryKey: ['authUser'],
    queryFn: async () => {
      return await Auth.currentAuthenticatedUser()
    }
  })
}
