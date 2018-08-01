const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const express = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');

const config = require('./config');
const User   = require('./app/models/User'); 


const port = process.env.PORT || 8080;
require('./database');// secret variable


if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running`);
  
	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
	  cluster.fork();
	}
  
	cluster.on('exit', (worker, code, signal) => {
	  console.log(`worker ${worker.process.pid} died`);
	});
  } else {

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/setup', function(req, res) {
	// create a sample user
	var heri = new User({ 
		name: 'Heri Agape',
		password: 'password',
		email: 'agape@live.fr',
		username: 'heri',
		admin: true 
	});
	heri.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});

	console.log(heri.speak());
});

app.get('/', function(req, res) {

	var mail = require('./app/utils/Mail');

	mail.sendRegistrationEmail("agape@live.fr", "Heri Agape");

	res.json({
		message: 'Hello! The API is at http://localhost:' + port + '/api',
		link: 'http://localhost:' + port + '/api'
	});
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = require('./app/routes');


app.use('/api', apiRoutes.User);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
  });
  
  // error handlers
  
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  res.json({
		message: err.message,
		error: err
	  });
	});
  }
  
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
	  message: err.message,
	  error: {}
	});
  });



app.listen(port);
console.log('Magic happens at http://localhost:' + port);
console.log(`Worker ${process.pid} started`);
}
