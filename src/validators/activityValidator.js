import { body, param, query } from "express-validator";

const ACTIVITY_TYPES = ["Call", "Meeting", "Note", "Follow-up"];

const createActivityValidator = [
  body("type")
    .notEmpty()
    .withMessage("type is required")
    .isIn(ACTIVITY_TYPES)
    .withMessage(`type must be one of: ${ACTIVITY_TYPES.join(", ")}`),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("description is required")
    .isLength({ min: 2 })
    .withMessage("description must be at least 2 characters"),

  body("lead").notEmpty().withMessage("lead is required").isMongoId().withMessage("Invalid lead id"),

  body("deal").optional({ checkFalsy: true }).isMongoId().withMessage("Invalid deal id"),
];

const activityIdValidator = [param("id").isMongoId().withMessage("Invalid activity id")];

const getActivitiesQueryValidator = [
  query("search").optional().trim().isString(),
  query("lead").optional().isMongoId().withMessage("Invalid lead id"),
];

export {
  createActivityValidator,
  activityIdValidator,
  getActivitiesQueryValidator,
};
