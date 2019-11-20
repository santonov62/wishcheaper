const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes');
const checkerController = require('./controller/checker.controller');
const subscriptionsController = require('./controller/subscriptions.controller');
const goodsController = require('./controller/goods.controller');
const shopsController = require('./controller/shops.controller');
const authContoller = require('./controller/auth.controller');
const authMiddleware = require('./middleware/auth.middleware');
const sslRedirect = require('heroku-ssl-redirect');
const checkerService = require('./service/checker/checker.service');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(sslRedirect());

app.use(bodyParser.json());
app.use('/*', authMiddleware.checkAuth);
app.use('/checker', checkerController);
app.use('/goods', goodsController);
app.use('/subscriptions', authMiddleware.authRequired, subscriptionsController);
app.use('/shops', authMiddleware.adminAuthRequired, shopsController);
app.use('/auth', authContoller);
// app.use('/pay', payContoller);

app.use(routes.app.frontend, express.static(routes.fs.frontend));
// app.use(routes.app.uploads, express.static(routes.fs.uploads));

app.get('/*', (req, res) => res.sendFile(path.join(routes.fs.frontend, 'index.html')));

const server = app.listen(PORT, () => console.log(`Running at ${PORT}`));

module.exports = app;
