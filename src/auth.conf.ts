export const AwsConfigAuth = {
  region: import.meta.env.VITE_AWS_REGION,
  userPoolId: import.meta.env.VITE_AWS_COGNITO_POOL_ID,
  userPoolWebClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,
  authenticationFlowType: 'USER_SRP_AUTH'
}
