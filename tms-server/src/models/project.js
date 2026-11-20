const mongoose = require('mongoose');
const { addSequence } = require('./counter');

const projectSchema = new mongoose.Schema({
  projectId: { type: Number, required: true, unique: true, immutable: true },
  name: { type: String, required: true, trim: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: {
    type: Date,
    validate: {
      validator(value) {
        return value == null || value > this.startDate;
      },
      message: 'End date must be after the start date.'
    }
  }
}, {
  versionKey: false,
  timestamps: { createdAt: 'dateCreated', updatedAt: 'dateModified' }
});

addSequence(projectSchema, 'projectId');

module.exports = { Project: mongoose.model('Project', projectSchema, 'projects') };
