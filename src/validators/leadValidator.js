import { body, param, query } from "express-validator";

const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Lost"];

const createLeadValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Lead name is required")
    .isLength({ min: 2 })
    .withMessage("Lead name must be at least 2 characters"),

  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ min: 7, max: 15 })
    .withMessage("Phone number must be between 7 and 15 characters"),

  body("company").optional({ checkFalsy: true }).trim().isString(),

  body("status")
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(", ")}`),

  body("notes").optional({ checkFalsy: true }).trim().isString(),
];

const updateLeadValidator = [
  param("id").isMongoId().withMessage("Invalid lead id"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Lead name must be at least 2 characters"),

  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ min: 7, max: 15 })
    .withMessage("Phone number must be between 7 and 15 characters"),

  body("status")
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(", ")}`),
];

const leadIdValidator = [param("id").isMongoId().withMessage("Invalid lead id")];

const getLeadsQueryValidator = [
  query("status")
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(", ")}`),
  query("search").optional().trim().isString(),
];

export {
  createLeadValidator,
  updateLeadValidator,
  leadIdValidator,
  getLeadsQueryValidator,
};
