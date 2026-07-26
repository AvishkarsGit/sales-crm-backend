import express from "express";
const router = express.Router();
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  createLeadValidator,
  updateLeadValidator,
  leadIdValidator,
  getLeadsQueryValidator,
} from "../validators/leadValidator.js";

router.use(protect);

router.get("/get-all-leads", getLeadsQueryValidator, validate, getLeads);
router.get("/get-lead/:id", leadIdValidator, validate, getLeadById);
router.post("/create-lead", createLeadValidator, validate, createLead);
router.patch("/update-lead/:id", updateLeadValidator, validate, updateLead);
router.delete("/delete-lead/:id", leadIdValidator, validate, deleteLead);

export default router;
