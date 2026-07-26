import express from "express";
const router = express.Router();
import { getUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

router.get("/get-all-users", protect, authorize("admin"), getUsers);

export default router;
