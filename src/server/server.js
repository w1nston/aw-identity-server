const path = require('path');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const isFunction = require('lodash.isfunction');

const port = 3000; // TODO: from process.env

function emitReady() {
  if (isFunction(process.send)) {
    process.send('ready');
  }
}

// TODO: Proper logger.

module.exports.createExpressServer = function createExpressServer() {
  const app = express();

  app.use(compression());
  app.use(cors());
  app.use(helmet());
  app.use(express.static(path.join(__dirname, '../../public')));

  return {
    start: () => {
      app.get('/', (request, response) => {
        response.sendFile(path.join(__dirname, '../../public/index.html')); // TODO: hot reload...
      });

      const server = app.listen(port, () => {
        console.log(`Server started. Listening on http://localhost:${port}`);
        emitReady();
      });

      process.on('SIGINT', () => {
        server.close(error => {
          if (error) {
            console.error('SIGINT received.', error);
            process.exit(1);
          }
          process.exit(0);
        });
      });
    },
  };
};
