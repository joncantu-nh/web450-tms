const request = require('supertest');
const app = require('../../src/app');
const { Project } = require('../../src/models/project');
const { mongo } = require('../../src/utils/mongo');

jest.mock('../../src/utils/mongo', () => ({
  mongo: jest.fn(async (operation, next) => {
    try {
      await operation();
    } catch (error) {
      next(error);
    }
  })
}));

describe('POST /api/projects', () => {
  const body = { name: 'Project Alpha', startDate: '2026-01-01', endDate: '2026-02-01' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => jest.restoreAllMocks());

  it('creates a project using its generated ID', async () => {
    jest.spyOn(Project.prototype, 'save').mockImplementation(async function () {
      this.projectId = 1000;
      return this;
    });
    const response = await request(app).post('/api/projects').send(body);
    expect(mongo).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Project created successfully', projectId: 1000
    });
  });

  it.each([
    { name: ' ', startDate: '2026-01-01' },
    { name: 'Project' },
    { name: 'Project', startDate: '2026-02-30' },
    { name: 'Project', startDate: '2026-01-01', endDate: '2026-01-01' },
    { name: 'Project', startDate: '2026-01-01', endDate: '2025-12-31' },
    { ...body, projectId: 1000 }
  ])('rejects invalid project data before connecting: %j', async (invalidBody) => {
    const response = await request(app).post('/api/projects').send(invalidBody);
    expect(response.status).toBe(400);
    expect(mongo).not.toHaveBeenCalled();
  });

  it('accepts browser CORS preflight requests', async () => {
    const response = await request(app).options('/api/projects')
      .set('Origin', 'http://localhost:4200')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type');
    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });
});
