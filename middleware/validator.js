import { validationResult, body } from "express-validator"

const validateContactForm = [
  body("name").trim().isLength({ min: 2, max: 50 }).escape(),
  body("company").trim().isLength({ min: 1, max: 100 }).escape(),
  body("email").trim().isEmail().normalizeEmail(),
  body("phone")
    .trim()
    .matches(/^\+?[\d\s-]+$/),
  body("message").trim().isLength({ min: 10, max: 1000 }).escape(),
]

const validatePlanForm = [
  body("name").trim().isLength({ min: 2, max: 50 }).escape(),
  body("email").trim().isEmail().normalizeEmail(),
  body("phone")
    .trim()
    .matches(/^\+?[\d\s-]+$/),
  body("selectedPlan").isObject(),
  body("selectedPlan.name").trim().isString(),
  body("selectedPlan.price").isNumeric(),
]

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

export { validateContactForm, validatePlanForm, validate }
