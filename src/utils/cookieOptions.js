import getEnvVariables from "../environment/env.js";
const accessTokenCookieOptions = () => ({
  httpOnly: true,
  secure: getEnvVariables().node_env === "production",
  sameSite: "lax",
  maxAge: 15 * 60 * 1000, // 15 minutes
});

const refreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: getEnvVariables().node_env === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

export { accessTokenCookieOptions, refreshTokenCookieOptions };
