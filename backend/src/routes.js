const path = require('path');

const frontend = path.resolve(__dirname + '../../../frontend/build');
// const uploads = path.resolve(__dirname + '../../../uploads');

module.exports = {
  app: {
    frontend: '/',
    // uploads: '/uploads'
  },
  fs: {
    frontend,
    // uploads
  }
};
