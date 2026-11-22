const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const spec = yaml.load(fs.readFileSync(path.join(__dirname, '../openapi.yaml'), 'utf8'));
const methods = ['get', 'post', 'patch', 'put', 'delete'];
const groups = Object.entries(spec.paths).map(([route, definition]) => {
  const operations = methods.flatMap(method => {
    const operation = definition[method];
    if (!operation || !operation.tags?.some(tag => ['Tasks', 'Projects'].includes(tag))) {
      return [];
    }

    // GET /api/tasks represents two user-facing operations in the TDD.
    return (operation['x-use-cases'] || [{ summary: operation.summary }]).map(useCase => ({
      method: method.toUpperCase(),
      summary: useCase.summary,
      input: useCase.query
        || (operation.requestBody ? (route.includes('{id}') ? 'Path ID + JSON body' : 'JSON request body')
          : route.includes('{id}') ? 'Path ID (MongoDB _id)' : 'No request body'),
      responses: Object.keys(operation.responses).join(', ')
    }));
  });
  return { route, operations };
}).filter(group => group.operations.length);

const width = groups.length * 366 + 48;
const center = width / 2;
const panelY = 225;
const cardHeight = 94;
const panelHeight = 62 + Math.max(...groups.map(group => group.operations.length)) * cardHeight;
const panelBottom = panelY + panelHeight;
const databaseY = panelBottom + 62;
const height = databaseY + 158;
const svg = [];

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[character]);
}

function text(x, y, value, className, anchor = 'start') {
  svg.push(`<text x="${x}" y="${y}" class="${className}" text-anchor="${anchor}">${escapeXml(value)}</text>`);
}

function rect(x, y, w, h, fill, stroke = 'none', radius = 8) {
  svg.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`);
}

function line(d, arrow = false) {
  svg.push(`<path d="${d}" fill="none" stroke="#64758a" stroke-width="2"${arrow ? ' marker-end="url(#arrow)"' : ''}/>`);
}

svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title">
<title id="title">Task Management System API flowchart</title>
<defs>
  <marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#64758a"/></marker>
</defs>
<style>
  text { font-family: Arial, Helvetica, sans-serif; fill: #213447; }
  .title { font-size: 20px; font-weight: bold; }
  .route { font-size: 18px; font-weight: bold; fill: white; }
  .label { font-size: 17px; font-weight: bold; }
  .method { font-size: 15px; font-weight: bold; }
  .detail { font-size: 14px; }
  .status { font-size: 12px; }
</style>`);
rect(0, 0, width, height, '#ffffff', 'none', 0);

text(center, 27, 'TMS REST API — Target design', 'title', 'middle');
rect(center - 167, 48, 334, 44, '#e9f0f7', '#9cb2c9');
text(center, 76, 'Angular client / HTTP service', 'label', 'middle');
line(`M${center} 92 V115`, true);
rect(center - 167, 118, 334, 49, '#e9f0f7', '#9cb2c9');
text(center, 139, 'Express REST API', 'label', 'middle');
text(center, 157, 'Route and request validation', 'detail', 'middle');

const centers = groups.map((_, i) => 24 + i * 366 + 171);
line(`M${center} 167 V197 M${centers[0]} 197 H${centers.at(-1)}`);
for (const x of centers) line(`M${x} 197 V${panelY - 3}`, true);

groups.forEach((group, i) => {
  const x = 24 + i * 366;
  rect(x, panelY, 342, panelHeight, '#f7f9fc', '#c6d1de');
  rect(x, panelY, 342, 42, '#254b6e');
  text(x + 171, panelY + 27, group.route, 'route', 'middle');

  group.operations.forEach((operation, j) => {
    const y = panelY + 52 + j * cardHeight;
    rect(x + 10, y, 322, cardHeight - 10, '#ffffff', '#ccd6e2');
    text(x + 21, y + 21, operation.method, 'method');
    text(x + 21, y + 43, operation.summary, 'label');
    text(x + 21, y + 60, operation.input, 'status');
    text(x + 21, y + 76, `HTTP responses: ${operation.responses}`, 'status');
  });
});

for (const x of centers) line(`M${x} ${panelBottom} V${panelBottom + 28}`);
line(`M${centers[0]} ${panelBottom + 28} H${centers.at(-1)} M${center} ${panelBottom + 28} V${databaseY - 3}`, true);
rect(center - 225, databaseY, 450, 66, '#e9f0f7', '#9cb2c9');
text(center, databaseY + 24, 'Mongoose / MongoDB Atlas', 'label', 'middle');
text(center, databaseY + 46, 'projects · tasks · counters (IDs on create)', 'detail', 'middle');
text(center, databaseY + 93, 'API returns the result or an error to the Angular client.', 'detail', 'middle');
text(center, databaseY + 113, '2xx: success   ·   400: invalid input   ·   404: not found   ·   409: duplicate title   ·   500: server error', 'detail', 'middle');
text(center, databaseY + 137, 'Generated from tms-server/openapi.yaml', 'status', 'middle');
svg.push('</svg>');

const outputPath = path.join(__dirname, '../../docs/TMS_API_Flowchart.svg');
fs.writeFileSync(outputPath, svg.join('\n') + '\n');
console.log(`Generated ${outputPath} (${groups.reduce((total, group) => total + group.operations.length, 0)} TDD operations).`);
