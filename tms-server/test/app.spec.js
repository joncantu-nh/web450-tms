/**
 * Author: Professor Krasso
 * Date: 7 August 2024
 * File: app.spec.js
 * Description: Test file for the Express application setup.
 */

// Require statements
const request = require('supertest');
const express = require('express');
const app = require('../src/app');
const { errorHandler } = require('../src/error-handler');

// Test cases
describe('app.js', () => {
  it('serves Swagger UI and the OpenAPI contract', async () => {
    const ui = await request(app).get('/api-docs/');
    expect(ui.status).toBe(200);
    expect(ui.text).toContain('TMS API Documentation');
    expect(ui.text).toContain('id="swagger-ui"');

    const init = await request(app).get('/api-docs/swagger-ui-init.js');
    expect(init.status).toBe(200);
    expect(init.text).toContain('/api-docs/openapi.json');

    const spec = await request(app).get('/api-docs/openapi.json');
    expect(spec.status).toBe(200);
    expect(spec.body.openapi).toBe('3.1.0');
    expect(spec.body.info.description).toContain('![TMS REST API flowchart](/api-docs/flowchart.svg)');
    expect(spec.body.paths['/api/projects'].post.operationId).toBe('addProject');
    expect(spec.body.paths['/api/tasks'].post['x-implementation-status']).toBe('planned');
  });

  it('serves the generated REST API flowchart as an SVG', async () => {
    const response = await request(app).get('/api-docs/flowchart.svg');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/image\/svg\+xml/);
    expect((response.text ?? response.body.toString())).toContain('TMS REST API');
  });

  it('serves Swagger UI browser assets', async () => {
    const response = await request(app).get('/api-docs/swagger-ui-bundle.js');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/javascript/);
  });

  // Verify that the API returns the CORS headers needed by the Angular client.
  it('should set CORS headers', async () => {
    const response = await request(app).get('/api');
    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-methods']).toBe('GET, POST, PUT, DELETE, OPTIONS');
    expect(response.headers['access-control-allow-headers']).toBe('Origin, X-Requested-With, Content-Type, Accept');
  });

  // Test the 500 error handler
  it('should handle 500 errors and return appropriate response', async () => {
    // Create a new instance of the app for testing
    const testApp = express();

    // Define a route that throws an error
    testApp.get('/error', (req, res, next) => {
      const error = new Error('Test error');
      error.status = 500;
      next(error);
    });

    // Use the error handling directly
    testApp.use(errorHandler);

    const response = await request(testApp).get('/error');
    expect(response.status).toBe(500);
    expect(response.body).toEqual(expect.objectContaining({
      type: 'error',
      status: 500,
      message: 'Test error'
    }));
  });

  // Test the 404 error handler
  it('should return 404 for undefined routes', async () => {
    const response = await request(app).get('/undefined-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual(expect.objectContaining({
      type: 'error',
      status: 404,
      message: 'Not Found'
    }));
  });
});
