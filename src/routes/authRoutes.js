import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { registerValidator, loginValidator } from "../validators/authValidator.js";

router.post("/register", registerValidator, validate, registerUser);
router.post("/login", loginValidator, validate, loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/get-profile", protect, getMe);

export default router;
