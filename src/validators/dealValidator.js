import { body, param, query } from "express-validator";

const DEAL_STAGES = ["Prospect", "Negotiation", "Won", "Lost"];

const createDealValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Deal title is required")
    .isLength({ min: 2 })
    .withMessage("Deal title must be at least 2 characters"),

  body("value")
    .notEmpty()
    .withMessage("Deal value is required")
    .isFloat({ min: 0 })
    .withMessage("Deal value must be a positive number"),

  body("stage")
    .optional()
    .isIn(DEAL_STAGES)
    .withMessage(`Stage must be one of: ${DEAL_STAGES.join(", ")}`),

  body("lead").notEmpty().withMessage("lead is required").isMongoId().withMessage("Invalid lead id"),
];

const updateDealValidator = [
  param("id").isMongoId().withMessage("Invalid deal id"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Deal title must be at least 2 characters"),

  body("value")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Deal value must be a positive number"),

  body("stage")
    .optional()
    .isIn(DEAL_STAGES)
    .withMessage(`Stage must be one of: ${DEAL_STAGES.join(", ")}`),
];

const dealIdValidator = [param("id").isMongoId().withMessage("Invalid deal id")];

const getDealsQueryValidator = [
  query("search").optional().trim().isString(),
  query("stage")
    .optional()
    .isIn(DEAL_STAGES)
    .withMessage(`Stage must be one of: ${DEAL_STAGES.join(", ")}`),
  query("lead").optional().isMongoId().withMessage("Invalid lead id"),
];

export {
  createDealValidator,
  updateDealValidator,
  dealIdValidator,
  getDealsQueryValidator,
};
