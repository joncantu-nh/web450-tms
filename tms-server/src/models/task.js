const mongoose = require('mongoose');
const { addSequence } = require('./counter');

const taskSchema = new mongoose.Schema({
  taskId: { type: Number, required: true, unique: true, immutable: true },
  title: { type: String, required: true, trim: true },
  description: String,
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  dueDate: Date,
  projectId: { type: Number, required: true }
}, {
  versionKey: false,
  timestamps: { createdAt: 'dateCreated', updatedAt: 'dateModified' }
});

addSequence(taskSchema, 'taskId');

module.exports = { Task: mongoose.model('Task', taskSchema, 'tasks') };
