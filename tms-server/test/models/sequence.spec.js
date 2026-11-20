const { Counter } = require('../../src/models/counter');
const { Project } = require('../../src/models/project');
const { Task } = require('../../src/models/task');

describe('model ID sequences', () => {
  afterEach(() => jest.restoreAllMocks());

  it('increments independent project and task sequences before validation', async () => {
    const sequences = {};
    const initialize = jest.spyOn(Counter, 'updateOne').mockImplementation(
      async ({ _id }, { $setOnInsert }) => {
        sequences[_id] ??= $setOnInsert.seq;
      }
    );
    const allocate = jest.spyOn(Counter, 'findByIdAndUpdate').mockImplementation(
      async (field) => ({ seq: ++sequences[field] })
    );

    const project = new Project({ name: 'Project Alpha', startDate: '2026-01-01' });
    await project.validate();
    const tasks = [
      new Task({ title: 'First task', projectId: project.projectId, status: 'Pending', priority: 'Low' }),
      new Task({ title: 'Second task', projectId: project.projectId, status: 'Pending', priority: 'High' })
    ];
    await Promise.all(tasks.map((task) => task.validate()));
    await project.validate();

    expect(project.projectId).toBe(1000);
    expect(tasks.map((task) => task.taskId).sort()).toEqual([1000, 1001]);
    expect(tasks.every((task) => task.projectId === project.projectId)).toBe(true);
    expect(project._id).toBeDefined();
    expect(tasks[0]._id).toBeDefined();
    expect(allocate).toHaveBeenCalledTimes(3);
    expect(initialize).toHaveBeenCalledWith(
      { _id: 'projectId' }, { $setOnInsert: { seq: 999 } }, { upsert: true }
    );
    expect(allocate).toHaveBeenCalledWith(
      'projectId', { $inc: { seq: 1 } }, { new: true }
    );
  });

  it('keeps an existing document ID when validated', async () => {
    const allocate = jest.spyOn(Counter, 'findByIdAndUpdate');
    const project = Project.hydrate({ name: 'Existing project', projectId: 42, startDate: '2026-01-01' });

    await project.validate();

    expect(project.projectId).toBe(42);
    expect(allocate).not.toHaveBeenCalled();
  });
});
