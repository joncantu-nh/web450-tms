const express = require('express');
const createError = require('http-errors');
const { Project } = require('../../models/project');
const { mongo } = require('../../utils/mongo');
const { ajv, validateAddProject } = require('../../schemas');

const router = express.Router();

// Browsers send an OPTIONS preflight request before a cross-origin JSON POST.
// Return 204 to acknowledge it before the browser submits the project data.
router.options('/', (req, res) => res.sendStatus(204));

router.post('/', async (req, res, next) => {
  if (!validateAddProject(req.body)) {
    return next(createError(400, ajv.errorsText(validateAddProject.errors)));
  }

  const { name, description, startDate, endDate } = req.body;
  if (endDate && new Date(endDate) <= new Date(startDate)) {
    return next(createError(400, 'End date must be after the start date.'));
  }

  await mongo(async () => {
    const project = new Project({ name, description, startDate, endDate });
    await project.save();
    res.status(201).json({
      message: 'Project created successfully',
      projectId: project.projectId
    });
  }, next);
});

module.exports = router;
