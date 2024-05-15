const fs = require('fs');
const http = require('http');

fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-type', 'text/plain');
  res.end('Hello, World!\n');
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});

// Define the /api/greet route
app.get('/api/greet', (req, res) => {
  const name = req.query.name || 'Guest'; // Default to 'Guest' if no name is provided
  res.json({ message: `Hello, ${name}!` });
});
