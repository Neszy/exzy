const express = require('express');
const app = express();
const config = require('./src/configs/app');
const morgan = require('morgan'); 

// ! Express Configs
app.use(morgan('combined'));
require('./src/configs/express')(app);

// ! Routes
app.use(require('./src/routes/index'));
app.use(express.static('public'));

// ! Start Server
const server = app.listen( config.port, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.warn(`Server is running at http://${host}:${port}`);
});
