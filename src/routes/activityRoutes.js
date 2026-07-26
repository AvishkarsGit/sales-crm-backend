import express from "express";
const router = express.Router();
import {
  getActivities,
  createActivity,
  deleteActivity,
} from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  createActivityValidator,
  activityIdValidator,
  getActivitiesQueryValidator,
} from "../validators/activityValidator.js";

router.use(protect);

router.get("/get-all-activities", getActivitiesQueryValidator, validate, getActivities);
router.post("/create-activity", createActivityValidator, validate, createActivity);
router.delete("/delete-activity/:id", activityIdValidator, validate, deleteActivity);

export default router;
