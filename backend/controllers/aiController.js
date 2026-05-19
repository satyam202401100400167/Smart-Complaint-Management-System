import asyncHandler from '../utils/asyncHandler.js';
import { analyzeComplaint, chatWithAssistant } from '../services/aiService.js';

export const analyze = asyncHandler(async (req, res) => {
  const { title, description, category, location } = req.body;

  const analysis = await analyzeComplaint({
    title,
    description,
    category,
    location,
  });

  res.json({
    success: true,
    data: analysis,
  });
});

export const chat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  const reply = await chatWithAssistant(message, history || []);

  res.json({
    success: true,
    data: { reply },
  });
});
