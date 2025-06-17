import { CognitoUserPool } from "amazon-cognito-identity-js";
import { COGNITO_CONFIG } from "./config";

const poolData = {
  UserPoolId: COGNITO_CONFIG.userPoolId,
  ClientId: COGNITO_CONFIG.clientId
};

export default new CognitoUserPool(poolData);