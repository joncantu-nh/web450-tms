const { Task } = require('../../src/models/task');

describe('task status and priority validation', () => {
  const task = { taskId: 1000, projectId: 1000, title: 'Test task' };

  it.each([
    ['Pending', 'Low'],
    ['In Progress', 'Medium'],
    ['Completed', 'High']
  ])('accepts status %s and priority %s', (status, priority) => {
    expect(Task.hydrate({ ...task, status, priority }).validateSync()).toBeUndefined();
  });

  it.each([
    ['Unknown', 'Urgent', 'enum'],
    [undefined, undefined, 'required']
  ])('rejects invalid or missing status and priority', (status, priority, kind) => {
    const error = Task.hydrate({ ...task, status, priority }).validateSync();
    expect(error.errors.status.kind).toBe(kind);
    expect(error.errors.priority.kind).toBe(kind);
  });
});
