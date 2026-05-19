import AppError from '../utils/AppError.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const parseJsonFromContent = (content) => {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new AppError('AI returned invalid response format.', 502);
  }
  return JSON.parse(jsonMatch[0]);
};

const callOpenRouter = async (messages, { jsonMode = false } = {}) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new AppError('OpenRouter API key is not configured.', 503);
  }

  const body = {
    model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
    messages,
    temperature: 0.3,
  };

  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
      'X-Title': 'Smart Complaint Management System',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('OpenRouter error:', errText);
    throw new AppError('AI service temporarily unavailable.', 502);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new AppError('Empty response from AI service.', 502);
  }

  return content;
};

export const analyzeComplaint = async ({ title, description, category, location }) => {
  const systemPrompt = `You are an expert municipal complaint analyst. Analyze complaints and respond ONLY with valid JSON in this exact structure:
{
  "priority": "Low" | "Medium" | "High" | "Critical",
  "department": "specific department name",
  "summary": "one sentence summary",
  "autoResponse": "professional citizen-facing response"
}
Assign realistic department names (e.g. Water Department, Electricity Board, Roads & Transport, Sanitation Department, Health Department, Education Department, Public Safety Department).
Base priority on urgency and public safety impact.`;

  const userPrompt = `Analyze this complaint:
Title: ${title}
Category: ${category}
Location: ${location}
Description: ${description}`;

  const content = await callOpenRouter(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { jsonMode: true }
  );

  const parsed = parseJsonFromContent(content);

  const required = ['priority', 'department', 'summary', 'autoResponse'];
  for (const key of required) {
    if (!parsed[key]) {
      throw new AppError(`AI response missing field: ${key}`, 502);
    }
  }

  return {
    priority: String(parsed.priority),
    department: String(parsed.department),
    summary: String(parsed.summary),
    autoResponse: String(parsed.autoResponse),
  };
};

export const chatWithAssistant = async (message, history = []) => {
  const systemPrompt = `You are a helpful AI assistant for a Smart Complaint Management System. Help citizens with:
- How to file complaints
- Complaint categories (Water, Electricity, Roads, Sanitation, Health, Education, Public Safety, Other)
- Tracking complaint status
- General municipal services guidance
Keep responses concise, friendly, and professional.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10).map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ];

  return callOpenRouter(messages);
};

export default { analyzeComplaint, chatWithAssistant };
