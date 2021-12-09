const db = require("../../data/db-config");
/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  try {
    const scheme = await db("schemes")
      .where("scheme_id", req.params.scheme_id)
      .first();

    if (scheme) {
      next();
    } else {
      next({
        status: 404,
        message: `scheme with scheme_id ${req.params.scheme_id} not found`,
      });
    }
  } catch (err) {
    next(err);
  }
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = async (req, res, next) => {
  if (!req.body.scheme_name || !req.body.scheme_name.trim()) {
    next({ status: 400, message: "invalid scheme_name" });
  } else {
    req.body.scheme_name = req.body.scheme_name.trim();
  }
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  if (
    !req.body.instructions ||
    !req.body.instructions.trim() ||
    isNaN(req.body.step_number) ||
    req.body.step_number < 1
  ) {
    next({ status: 400, message: "invalid step" });
  } else {
    next();
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
