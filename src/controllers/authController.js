import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../utils/cookieOptions.js";
import getEnvVariables from "../environment/env.js";

const sendAuthCookies = (res, userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  res.cookie("accessToken", accessToken, accessTokenCookieOptions());
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions());
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User with this email already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === "admin" ? "admin" : "sales",
  });

  sendAuthCookies(res, user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  sendAuthCookies(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;

  if (!incomingToken) {
    return res.status(401).json({ message: "Refresh token missing, please login again" });
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingToken, getEnvVariables().refresh_token_secret);
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token, please login again" });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({ message: "User no longer exists" });
  }

  // rotate both tokens on every refresh
  sendAuthCookies(res, user._id);

  res.status(200).json({ message: "Token refreshed successfully" });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", accessTokenCookieOptions());
  res.clearCookie("refreshToken", refreshTokenCookieOptions());
  res.status(200).json({ message: "Logged out successfully" });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

export { registerUser, loginUser, refreshAccessToken, logoutUser, getMe };
