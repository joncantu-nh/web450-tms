const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true });

// Accept calendar dates and ISO timestamps, rejecting dates that JavaScript rolls over.
ajv.addFormat('project-date', (value) => {
  if (!/^\d{4}-\d{2}-\d{2}(T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d))?$/.test(value)) {
    return false;
  }
  const date = new Date(value);
  const calendarDate = new Date(value.slice(0, 10));
  return Number.isFinite(date.getTime()) &&
    Number.isFinite(calendarDate.getTime()) &&
    calendarDate.toISOString().slice(0, 10) === value.slice(0, 10);
});

const addProjectSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', pattern: '\\S' },
    description: { type: 'string' },
    startDate: { type: 'string', format: 'project-date' },
    endDate: { type: 'string', format: 'project-date' }
  },
  required: ['name', 'startDate'],
  additionalProperties: false
};

const validateAddProject = ajv.compile(addProjectSchema);

module.exports = { ajv, validateAddProject };
