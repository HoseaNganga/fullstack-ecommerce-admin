const path = require('path');

module.exports = {
  // other configuration settings...
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    }
  }
};
