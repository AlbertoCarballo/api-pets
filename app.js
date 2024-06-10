var createError = require('http-errors');
var express = require('express');
var cors= require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/Usuarios');
var vacunasRouter = require('./routes/Vacunas');
var reportesExtravioRouter = require('./routes/ReportesExtravio');
var reportesMaltratoRouter = require('./routes/ReportesMaltrato');
var mascotaRouter = require('./routes/Mascotas');
var loginRouter = require('./routes/Login');
var vacunarRouter = require('./routes/RegistroVacunas');
var problemasRouter = require('./routes/ProblemasPaginas');
var adoptarRouter = require('./routes/CartaAdopcion');
var catalogoAdopcionesRouter = require('./routes/CatalogoAdopciones');
var catalogoReportesRouter= require('./routes/ReportesMaltrato');
var isLoggedRouter = require('./routes/IsValidToken');

var app = express();

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/usuarios', usersRouter);
app.use('/vacunas', vacunasRouter);
app.use('/reportes-extravio', reportesExtravioRouter);
app.use('/reportes-maltrato', reportesMaltratoRouter);
app.use('/mascotas', mascotaRouter);
app.use('/login',loginRouter);
app.use('/vacunar',vacunarRouter);
app.use('/problemas',problemasRouter);
app.use('/adoptar',adoptarRouter);
app.use('/adopciones',catalogoAdopcionesRouter);
app.use('/reportar',catalogoReportesRouter);
app.use('/loggear',isLoggedRouter);

// catch 404 and forward to error handler//
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
