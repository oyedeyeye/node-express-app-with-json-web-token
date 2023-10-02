const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server Listening
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
