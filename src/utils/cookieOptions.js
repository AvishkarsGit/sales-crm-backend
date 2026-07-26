import getEnvVariables from "../environment/env.js";

const isProd = getEnvVariables().node_env === "production";

const accessTokenCookieOptions = () => ({
  httpOnly: true,
  secure: isProd,                    // must be true for sameSite: none
  sameSite: isProd ? "none" : "lax", // "none" for cross-site (prod), "lax" for local dev
  maxAge: 15 * 60 * 1000,
});

const refreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export { accessTokenCookieOptions, refreshTokenCookieOptions };