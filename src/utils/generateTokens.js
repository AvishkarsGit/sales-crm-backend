import jwt from "jsonwebtoken";
import getEnvVariables from "../environment/env.js";

// Short-lived token used to authenticate normal requests
const generateAccessToken = (userId) => {
  const { access_token_secret, access_token_expiry } = getEnvVariables();
  return jwt.sign({ id: userId }, access_token_secret, { expiresIn: access_token_expiry });
};

// Long-lived token used only to mint a new access token via /refresh-token.
// Not stored anywhere in the database - purely a signed, stateless cookie.
const generateRefreshToken = (userId) => {
  const { refresh_token_secret, refresh_token_expiry } = getEnvVariables();
  return jwt.sign({ id: userId }, refresh_token_secret, { expiresIn: refresh_token_expiry });
};

export { generateAccessToken, generateRefreshToken };
