import dotenv from "dotenv";
dotenv.config();

const getEnvVariables = () => ({
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,

  mongo_uri: process.env.MONGO_URI,

  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY,

  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY,

  client_url: process.env.CLIENT_URL,
});

export default getEnvVariables;
