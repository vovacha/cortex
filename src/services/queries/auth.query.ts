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

interface SingUpData {
  username: string
  password: string
}

interface SignUpVerificationData {
  username: string
  code: string
}

interface SignInData {
  username: string
  password: string
}

export function useSignUpMut (): UseMutationResult<ISignUpResult, Error, SingUpData, unknown> {
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

export function useConfirmSignUpMut (): UseMutationResult<any, Error, SignUpVerificationData, unknown> {
  return useMutation({
    mutationFn: async ({ username, code }) => {
      return await Auth.confirmSignUp(username, code)
    }
  })
}

export function useSignInMut (): UseMutationResult<CognitoUser, Error, SignInData, unknown> {
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
