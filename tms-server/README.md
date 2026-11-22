# TMS Server

The Task Management System (TMS) server provides a REST API using Node.js, Express, Mongoose, and MongoDB.

## Starting the server

From the `tms-server` directory, install the dependencies and start the server:

```bash
npm ci
npm start
```

For development, use `npm run dev` to automatically restart the server when source files change.

## Swagger API documentation

Swagger UI provides interactive documentation for the REST API using our [OpenAPI 3.1 specification](openapi.yaml). It describes the endpoints, request parameters, JSON schemas, response examples, and HTTP status codes.

With the server running, access the documentation at:

- [Swagger UI](http://localhost:3000/api-docs/)
- [OpenAPI specification (JSON)](http://localhost:3000/api-docs/openapi.json)
- [REST API flowchart (SVG)](http://localhost:3000/api-docs/flowchart.svg)

The Angular client's homepage also provides an **API Help** link to Swagger UI. The Angular client does not need to be running to use Swagger UI directly.

### Trying an API endpoint

1. Open Swagger UI in your browser.
2. Expand an endpoint, such as **System → GET /api**.
3. Click **Try it out**.
4. Supply any required parameters or request body.
5. Click **Execute** to send the request to the running Express server.
6. Review the HTTP status code and response body under **Server response**.

For example, `GET /api` returns the server welcome message with an HTTP `200 OK` response. To test project creation, expand **Projects → POST /api/projects** and use or modify the example JSON request body. A successful request returns HTTP `201 Created` and the generated project ID.

Swagger UI sends real API requests. Creating, updating, or deleting records affects the configured MongoDB database, so use appropriate test data.

### Implementation status

The OpenAPI specification describes the complete planned TMS API, including endpoints that are still under development. The `x-implementation-status` field identifies whether an operation is `implemented` or `planned`. Planned operations may return `404 Not Found` until implemented.

### Updating the API documentation and flowchart

When an API changes, update `openapi.yaml` and regenerate the REST API flowchart from the `tms-server` directory:

```bash
npm run docs:api-flowchart
```

This updates [TMS_API_Flowchart.svg](../docs/TMS_API_Flowchart.svg) in the project's `docs` directory. The same diagram is displayed in Swagger UI and can be used in the Technical Design Document (TDD).

Restart the server after changing the OpenAPI specification and refresh Swagger UI. Commit both the updated specification and the generated flowchart to keep the documentation in sync.
