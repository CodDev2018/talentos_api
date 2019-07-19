var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cadastrosRouter = require('./routes/cadastros.router');
var usersRouter = require('./routes/users.router');
var pessoasRouter = require('./routes/pessoas.router');
var candidatosRouter = require('./routes/candidatos.router');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/cadastros', cadastrosRouter);
app.use('/api/pessoas', pessoasRouter);
app.use('/api/candidatos', candidatosRouter);

module.exports = app;