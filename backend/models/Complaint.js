import mongoose from 'mongoose';

const timelineEntrySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const aiAnalysisSchema = new mongoose.Schema(
  {
    priority: { type: String, default: '' },
    department: { type: String, default: '' },
    summary: { type: String, default: '' },
    autoResponse: { type: String, default: '' },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Water',
        'Electricity',
        'Roads',
        'Sanitation',
        'Health',
        'Education',
        'Public Safety',
        'Other',
      ],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    aiAnalysis: {
      type: aiAnalysisSchema,
      default: () => ({}),
    },
    attachment: {
      filename: String,
      path: String,
      mimetype: String,
    },
    timeline: {
      type: [timelineEntrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.index({ location: 'text', title: 'text', description: 'text' });
complaintSchema.index({ category: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ user: 1 });
complaintSchema.index({ createdAt: -1 });

complaintSchema.pre('save', function addInitialTimeline(next) {
  if (this.isNew) {
    this.timeline = [
      {
        status: this.status || 'Pending',
        note: 'Complaint registered',
        updatedAt: new Date(),
      },
    ];
  }
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
