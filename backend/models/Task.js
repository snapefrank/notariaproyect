const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String},
    description: { type: String},
    startDate: { type: Date },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    comment: { type: String },
    createdBy: { type: String, required: true } // puedes usar user._id si deseas
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
