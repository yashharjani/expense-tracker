export const COGNITO_CONFIG = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT,
  region: import.meta.env.VITE_AWS_REGION
};