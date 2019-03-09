const path = require('path');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const isFunction = require('lodash.isfunction');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfigFn = require('../../config/webpack/webpack.config');

// TODO: Webpack only in dev server...
const webpackConfig = webpackConfigFn({ NODE_ENV: 'development' });
const webpackCompiler = webpack(webpackConfig);
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
  app.use( // TODO: Only in dev mode
    webpackDevMiddleware(webpackCompiler, {
      publicPath: webpackConfig.output.publicPath,
    })
  );
  app.use(webpackHotMiddleware(webpackCompiler));

  return {
    start: () => {
      app.get('/', (request, response) => {
        response.sendFile(path.join(__dirname, '../../public/index.html'));
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
