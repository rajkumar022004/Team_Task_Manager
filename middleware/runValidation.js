import validate from './validate.js';

const runValidation = (rules) => async (req, res, next) => {
  await Promise.all(rules.map((rule) => rule.run(req)));
  validate(req, res, next);
};

export default runValidation;
