const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes');
const checkerController = require('./controller/checker.controller');
const authContoller = require('./controller/auth.controller');
const authMiddleware = require('./middleware/auth.middleware');
const sslRedirect = require('heroku-ssl-redirect');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(sslRedirect());

// if (!process.env.JWT_SECRET) {
//   console.error('ERROR!: Please set JWT_SECRET to .env file before running the app.');
//   process.exit();
// }

app.use(bodyParser.json());
app.use('/*', authMiddleware.checkAuth);
app.use('/checker', checkerController);
// app.use('/goods', goodsController);
// app.use('/promoChecker', promoCheckerController);
// app.use('/shops', shopContoller);
// app.use('/currency', currencyContoller);
app.use('/auth', authContoller);
// app.use('/pay', payContoller);
// app.use('/users', usersContoller);
// app.use('/payments', paymentsContoller);

app.use(routes.app.frontend, express.static(routes.fs.frontend));
// app.use(routes.app.uploads, express.static(routes.fs.uploads));

app.get('/*', (req, res) => res.sendFile(path.join(routes.fs.frontend, 'index.html')));

const server = app.listen(PORT, () => console.log(`Running at ${PORT}`));

module.exports = app;
