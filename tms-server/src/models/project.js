const mongoose = require('mongoose');
const { addSequence } = require('./counter');

const projectSchema = new mongoose.Schema({
  projectId: { type: Number, required: true, unique: true, immutable: true },
  name: { type: String, required: true, trim: true },
  description: String,
  startDate: Date,
  endDate: Date
}, {
  timestamps: { createdAt: 'dateCreated', updatedAt: 'dateModified' }
});

addSequence(projectSchema, 'projectId');

module.exports = { Project: mongoose.model('Project', projectSchema, 'projects') };
