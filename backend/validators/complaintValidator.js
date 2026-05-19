import { body } from 'express-validator';

const categories = [
  'Water',
  'Electricity',
  'Roads',
  'Sanitation',
  'Health',
  'Education',
  'Public Safety',
  'Other',
];

export const createComplaintValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(categories)
    .withMessage(`Category must be one of: ${categories.join(', ')}`),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

export const updateComplaintValidation = [
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Resolved', 'Rejected'])
    .withMessage('Invalid status'),
  body('note').optional().trim(),
];

export const analyzeValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

export const chatValidation = [
  body('message').trim().notEmpty().withMessage('Message is required'),
];
