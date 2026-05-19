import Complaint from '../models/Complaint.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { analyzeComplaint } from '../services/aiService.js';
import {
  sendComplaintNotification,
  buildStatusUpdateEmail,
} from '../services/emailService.js';

const buildFilter = (req) => {
  const filter = {};

  if (req.user.role !== 'admin') {
    filter.$or = [{ user: req.user._id }, { email: req.user.email }];
  }

  return filter;
};

export const createComplaint = asyncHandler(async (req, res) => {
  const { name, email, title, description, category, location } = req.body;

  let aiAnalysis = {};
  try {
    aiAnalysis = await analyzeComplaint({ title, description, category, location });
  } catch (err) {
    console.warn('AI analysis failed on create:', err.message);
  }

  const complaintData = {
    name,
    email,
    title,
    description,
    category,
    location,
    aiAnalysis,
    user: req.user?._id,
  };

  if (req.file) {
    complaintData.attachment = {
      filename: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
    };
  }

  const complaint = await Complaint.create(complaintData);

  await sendComplaintNotification({
    to: email,
    subject: `Complaint Registered: ${title}`,
    html: `
      <h2>Complaint Registered Successfully</h2>
      <p>Hello ${name},</p>
      <p>Your complaint "<strong>${title}</strong>" has been registered.</p>
      <p><strong>Status:</strong> ${complaint.status}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Location:</strong> ${location}</p>
      ${aiAnalysis.autoResponse ? `<p>${aiAnalysis.autoResponse}</p>` : ''}
    `,
  });

  res.status(201).json({
    success: true,
    message: 'Complaint created successfully',
    data: complaint,
  });
});

export const getComplaints = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = buildFilter(req);

  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;

  const [complaints, total] = await Promise.all([
    Complaint.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email'),
    Complaint.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: complaints.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: complaints,
  });
});

export const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');

  if (!complaint) {
    throw new AppError('Complaint not found.', 404);
  }

  if (req.user.role !== 'admin') {
    const isOwner =
      complaint.user?.toString() === req.user._id.toString() ||
      complaint.email === req.user.email;
    if (!isOwner) {
      throw new AppError('You do not have access to this complaint.', 403);
    }
  }

  res.json({ success: true, data: complaint });
});

export const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    throw new AppError('Complaint not found.', 404);
  }

  const isAdmin = req.user.role === 'admin';
  const isOwner =
    complaint.user?.toString() === req.user._id.toString() ||
    complaint.email === req.user.email;

  if (!isAdmin && !isOwner) {
    throw new AppError('You do not have permission to update this complaint.', 403);
  }

  if (!isAdmin && req.body.status) {
    throw new AppError('Only admins can update complaint status.', 403);
  }

  const allowedFields = isAdmin
    ? ['status', 'title', 'description', 'category', 'location']
    : ['title', 'description', 'category', 'location'];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      complaint[field] = req.body[field];
    }
  });

  if (req.body.status && req.body.status !== complaint.status) {
    complaint.timeline.push({
      status: req.body.status,
      note: req.body.note || `Status changed to ${req.body.status}`,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    });
    complaint.status = req.body.status;

    await sendComplaintNotification({
      to: complaint.email,
      subject: `Complaint Status Updated: ${complaint.title}`,
      html: buildStatusUpdateEmail(complaint),
    });
  }

  await complaint.save();

  res.json({
    success: true,
    message: 'Complaint updated successfully',
    data: complaint,
  });
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    throw new AppError('Complaint not found.', 404);
  }

  if (req.user.role !== 'admin') {
    throw new AppError('Only admins can delete complaints.', 403);
  }

  await complaint.deleteOne();

  res.json({
    success: true,
    message: 'Complaint deleted successfully',
  });
});

export const searchByLocation = asyncHandler(async (req, res) => {
  const { location } = req.query;

  if (!location?.trim()) {
    throw new AppError('Location query parameter is required.', 400);
  }

  const filter = {
    location: { $regex: location.trim(), $options: 'i' },
    ...buildFilter(req),
  };

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const [complaints, total] = await Promise.all([
    Complaint.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Complaint.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: complaints.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: complaints,
  });
});

export const filterByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;

  if (!category?.trim()) {
    throw new AppError('Category query parameter is required.', 400);
  }

  const filter = {
    category: { $regex: new RegExp(`^${category.trim()}$`, 'i') },
    ...buildFilter(req),
  };

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const [complaints, total] = await Promise.all([
    Complaint.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Complaint.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: complaints.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: complaints,
  });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required.', 403);
  }

  const [statusStats, categoryStats, priorityStats, recentCount, total] =
    await Promise.all([
      Complaint.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        { $match: { 'aiAnalysis.priority': { $nin: [null, ''] } } },
        { $group: { _id: '$aiAnalysis.priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Complaint.countDocuments(),
    ]);

  res.json({
    success: true,
    data: {
      total,
      recentWeek: recentCount,
      byStatus: statusStats,
      byCategory: categoryStats,
      byPriority: priorityStats,
    },
  });
});

export const exportComplaintsCSV = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required.', 403);
  }

  const complaints = await Complaint.find().sort({ createdAt: -1 }).lean();

  const headers = [
    'ID',
    'Name',
    'Email',
    'Title',
    'Category',
    'Location',
    'Status',
    'Priority',
    'Department',
    'Created At',
  ];

  const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const rows = complaints.map((c) =>
    [
      c._id,
      c.name,
      c.email,
      c.title,
      c.category,
      c.location,
      c.status,
      c.aiAnalysis?.priority || '',
      c.aiAnalysis?.department || '',
      new Date(c.createdAt).toISOString(),
    ]
      .map(escape)
      .join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=complaints-export.csv');
  res.send(csv);
});
