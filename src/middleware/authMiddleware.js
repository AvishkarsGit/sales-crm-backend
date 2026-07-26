import jwt from "jsonwebtoken";
import User from "../models/User.js";
import getEnvVariables from "../environment/env.js";

// Verifies the access token (from the httpOnly cookie, or Authorization header as a
// fallback for tools like Postman/curl) and attaches the user to req
const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const decoded = jwt.verify(token, getEnvVariables().access_token_secret);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

export { protect };
