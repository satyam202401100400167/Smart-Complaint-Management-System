import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    const error = new AppError(messages.join('. '), 400);
    error.errors = errors.array();
    return next(error);
  }
  next();
};

export default validate;
