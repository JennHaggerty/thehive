//FIXME: get rid of PM2 in favor of systemD
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var getData = require("./functions")
var passport = require('passport'), 
    LocalStrategy = require('passport-local').Strategy;
var config = require('./config'); // config for db connector/driver


var port = process.env.PORT || config.port;
var knex = require('knex')(config.database); 

var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization	");
  res.header("Access-Control-Allow-Methods", "DELETE");
  next();
});

function am(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  var token = req.headers.authorization;

  // decode the token using a secret key-phrase
  return jwt.verify(token, "some secret", function(err, decoded) {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    var userId = decoded.sub;
      return next();
  });
}
//REACT VERSION
// get the user
app.get('/:url', getData.getUsers)
// retrieves user information form DB via the URL assigned to user
app.get('/projects', getData.getProjects)
app.get('/posts', getData.getPosts)
app.get('/schools', getData.getSchools)
app.get('/jobs', getData.getJobs)

// send input data from forms to DB.
//app.post('/user/:userId', am, getData.editUser)
app.post('/project', am, getData.addProjects) 
app.post('/projects', am, getData.editProjects)
app.delete('/projects', am, getData.deleteProjects)
app.post('/post', am, getData.addPosts)
app.post('/posts', am, getData.editPosts)
app.delete('/posts', am, getData.deletePosts)
app.post('/school', am, getData.addSchools) 
app.post('/schools', am, getData.editSchools)
app.post('/job', am, getData.addJobs)
app.post('/jobs', am, getData.editJobs)
app.delete('/jobs', am, getData.deleteJobs)

// user login
//app.post('/:user', getUser.getUsers)

var session = require('express-session')

app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

/*
passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  knex.select().from('users').where('email', id)
    		.then(function(users){
    			if (!users.length) {
    				return done('user not found');
    			}

    			done(null, users[0]);
    		})
    		.catch(function(err){
					console.log('fuck,', err);
					done('no');
    		})
});
*/


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password, done) {
  console.log(username);
  console.log(password);

	var hash = crypto.createHmac('sha256', password).digest('hex');
	console.log('hash', hash);

  knex.select().from('users').where('email', username)
  	.then(function(users){
  		if (!users.length) {
  			return done('user not found');
  		}
  		// checking password against a known hash from DB
  		// set up whenever the user signs up
			if (users[0].password !== hash) {
  			return reject('nope');
      }
/*
  TODO:
  I think it's here that the password needs to be checked and
  if it's wrong the user needs to be alerted and the loggedIn
  status should NOT be true.
*/
  		done(null, users[0]);
  	})
  	.catch(function(err){
			console.log('oops', err);
			done('no');
  	})
}));

// Setting the failureFlash option to true instructs Passport to flash
// an error message using the message option set by the verify callback above. 
// This is helpful when prompting the user to try again.
app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
    if (err) { return res.send(err); }
    if (!user) { return next('no user found'); }

    //res.send('ok');
      var payload = {
        sub: user.email
      };

      // create a token string
      var token = jwt.sign(payload, "some secret");
      var data = {
        email: user.email
      };
      return res.json({
      	token: token,
      	data: data,
        redirect: '/'
      });
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});

// user logout
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use(express.static('app'))

// Web server invocation.. starts listening for connection requests here
app.listen(port, '0.0.0.0', function () {
  console.log('Server is now running on port:', port);
  console.log('All systems go.')
});
