const { createExpressServer } = require('./server/server');

const server = createExpressServer();
server.start();
