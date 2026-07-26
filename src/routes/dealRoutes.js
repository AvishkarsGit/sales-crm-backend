import express from "express";
const router = express.Router();
import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
} from "../controllers/dealController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  createDealValidator,
  updateDealValidator,
  dealIdValidator,
  getDealsQueryValidator,
} from "../validators/dealValidator.js";

router.use(protect);

router.get("/get-all-deals", getDealsQueryValidator, validate, getDeals);
router.get("/get-deal/:id", dealIdValidator, validate, getDealById);
router.post("/create-deal", createDealValidator, validate, createDeal);
router.patch("/update-deal/:id", updateDealValidator, validate, updateDeal);
router.delete("/delete-deal/:id", dealIdValidator, validate, deleteDeal);

export default router;
