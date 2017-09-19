var config = require('./config'); // config for db connector/driver
var knex = require('knex')(config.database);
var moment = require('moment');

// USER LOGIN
function getUsers(req, res, next) {
	var url = req.params.url;
	knex.select().table('users').where('url', url).then(function(users) {
		if (!users.length) {
			// no users found. move to next middleware or route
			return next();
		}
		return res.send(users[0]);
	})
  // do something with error, maybe even just:
	.catch(console.log)
}

function editUser (req, res, next) {
	var id = req.params.userId;
	var users = {};
	if (!req.body) {
		return res.send('no data provided!!');
	}
	if (req.body.name) {
		users.name = req.body.name;
	}
	if (req.body.email) {
		users.email = req.body.email;
	}
	if (req.body.password) {
		users.password = req.body.password;
	}
	
	knex('users').where('id', id).update(users)
		.then(function(){
			res.send(users);	
		})
		.catch(function (err) {
			console.log(err);
			res.send('something went wrong');
		})
}

// POSTS
function getPosts(req, res, next) {
	var userId = req.params.userId;
	knex.select().from('posts').orderBy('date', 'desc').then(function(posts) {
		posts = posts.map(function(post) {
			var _post = {};
			_post.title = post.title;
			_post.body = post.body;
			_post.url = post.url;
			_post.date = moment(post.date);
			_post.tags = post.tags;
			_post.id = post.id;
			//_post.featuredImg = post.featuredImg;
			return _post;
		})
		res.send(posts);
	});
}
function addPosts (req, res, next) {
	var title = req.body[0].title;
	var body = req.body[0].body;
	var url = req.body[0].url;
	var tags = req.body[0].tags;

	//if (id === '' || id === undefined ){
//		addPosts(title, body, function(result) {
			//res.send(result);
			knex('posts')
				.insert({title, url, body, tags})
				.then(function(){
					res.send(req.body[0]);	
				})
				.catch(function (err) {
					console.log(err);
					res.send('something went wrong');
				})
		//})
	//}
}
function editPosts (req, res, next) {
	var posts = req.body;
	var postPromiseArray = posts.map(function (post) {
		return new Promise(function (resolve, reject) {
			var id = post.id;
			debugger;
			knex('posts')
				.update(post)
				.where('id', id)
				.then(function(){	
					resolve(post);
				})
				.catch(function (err) {
					console.log(err);
					reject('something went wrong');
				});
		});
	});

	Promise.all(postPromiseArray)
		.then(function(results) {
			res.send(posts);
		
		});
}
function deletePosts (req, res, next) {
	var id = req.query.id;
	console.log('You have deleted post id:', id);
	knex('posts')
		.where('id', id)
		.delete()
		.then(function(){	
			res.send();
		})
		.catch(function (err) {
			console.log(err);
			res.send('something went wrong');
		});
}

// PROJECTS
function getProjects(req, res, next) {
	var userId = req.params.userId;
	knex.select().from('projects').orderBy('date', 'desc').then(function(projects) {
		projects = projects.map(function(project) {
			var _project = {};
			_project.title = project.title;
			_project.body = project.body;
			_project.url = project.url;
			_project.date = moment(project.date).format("DD/MM/YYYY");
			_project.tags = project.tags;
			_project.id = project.id;
			//_project.featuredImg = project.featuredImg;
			return _project;
		})
		res.send(projects);
	});
}
function addProjects (req, res, next) {
	var title = req.body[0].title;
	var body = req.body[0].body;
	var url = req.body[0].url;
	var tags = req.body[0].tags;

			knex('projects')
				.insert({title, body, url, tags})
				.then(function(){
					res.send(req.body[0]);	
				})
				.catch(function (err) {
					console.log(err);
					res.send('something went wrong');
				})
}
function editProjects (req, res, next) {
	var projects = req.body;
	var postPromiseArray = projects.map(function (project) {
		return new Promise(function (resolve, reject) {
			var id = project.id;
			knex('projects')
				.update(project)
				.where('id', id)
				.then(function(){	
					resolve(project);
				})
				.catch(function (err) {
					console.log(err);
					reject('something went wrong');
				});
		});
	});

	Promise.all(postPromiseArray)
		.then(function(results) {
			res.send(projects);
		
		});
}
function deleteProjects (req, res, next) {
	var id = req.query.id;
	console.log('You have deleted project id:', id);
	knex('projects')
		.where('id', id)
		.delete()
		.then(function(){	
			res.send();
		})
		.catch(function (err) {
			console.log(err);
			res.send('something went wrong');
		});
}
// JOBS
function getJobs(req, res, next) {
	var userId = req.params.userId;
	knex.select().from('jobs').orderBy('finished', 'desc').then(function(jobs) {
		jobs = jobs.map(function(job) {
			var _job={};
			_job.id = job.id;
			_job.name = job.name;
			_job.url = job.url;
			_job.position = job.position;
			_job.description = job.description;
			_job.city = job.city;
			_job.state = job.state;
			_job.finished = moment(job.finished).format("MM/YYYY");
			_job.started = moment(job.started).format("MM/YYYY");
			return _job;
		});
		res.send(jobs);
	});
}
function addJobs (req, res, next) {
	var name = req.body[0].name;
	var url = req.body[0].url;
	var position = req.body[0].position;
	var description = req.body[0].description;
	var city = req.body[0].city;
	var state = req.body[0].state;
	var started = req.body[0].started;
	var finished = req.body[0].finished;
	
//	if (id === '' || id === undefined ){
//		addJobs(name, url, position, description, city, state, started, finished, function(result) {
//			res.send(result);
			
			knex('jobs')
				.insert({name, url, position, description, city, state, started, finished})
				.then(function(){
					res.send(req.body[0]);	
				})
				.catch(function (err) {
					console.log(err);
					res.send('something went wrong');
				})
//			})
//	}
}
function editJobs (req, res, next) {
	var jobs = req.body;
	var jobPromiseArray = jobs.map(function (job) {
		return new Promise(function (resolve, reject) {
			var id = job.id;
			knex('jobs')
			.update(job)
			.where(`id`, id)
			.then(function(){	
				resolve(job);
			})
			.catch(function (err) {
				console.log(err);
				reject('something went wrong');
			});
		});
	});
	Promise.all(jobPromiseArray)
	.then(function(results) {
		res.send(jobs);
	});
}
function deleteJobs (req, res, next) {
	debugger;
	var id = req.query.id;
	console.log('You have deleted job id:', id);
	knex('jobs')
		.where('id', id)
		.delete()
		.then(function(){	
			res.send();
		})
		.catch(function (err) {
			console.log(err);
			res.send('something went wrong');
		});
}
// SCHOOLS
function getSchools(req, res, next) {
	knex.select().from('schools').orderBy('finished', 'desc').then(function(schools) {
		schools = schools.map(function(school) {
			var _school={};
			_school.id = school.id;
			_school.name = school.name;
			_school.url = school.url;
			_school.status = school.status;
			_school.degree = school.degree;
			_school.major = school.major;
			_school.city = school.city;
			_school.state = school.state;
			_school.finished = moment(school.finished).format("MM/YYYY");
			_school.started = moment(school.started).format("MM/YYYY");
			return _school;
		});
		res.send(schools);
	});
}
function editSchools (req, res, next) {
	var userId = req.params.userId;
	var schools = req.body;
	var schoolPromiseArray = schools.map(function (school) {
		return new Promise(function (resolve, reject) {
			var id = school.id;
			delete school.id;
			knex('schools')
			.where(`id`, id)
			.update(school)
			.then(function(){	
				resolve(school);
			})
			.catch(function (err) {
				console.log(err);
				reject('something went wrong');
			});
		});
	});
	Promise.all(schoolPromiseArray)
	.then(function(results) {
		res.send(schools);
	});
}
function addSchools (req, res, next) {
	var userId = req.params.userId;
	var schools = {};
	if (!req.body) {
		return res.send('no data provided!!');
	}
	if (req.body.name) {
		schools.name = req.body.name;
	}
	if (req.body.url) {
		schools.url = req.body.url;
	}
	if (req.body.degree) {
		schools.degree = req.body.degree;
	}
	if (req.body.major) {
		schools.major = req.body.major;
	}
	if (req.body.started) {
		schools.started = req.body.started;
	}
	if (req.body.finished) {
		schools.finished = req.body.finished;
	}
	if (req.body.city) {
		schools.city = req.body.city;
	}
	if (req.body.state) {
		schools.state = req.body.state;
	}
	knex('schools').where('userId', userId).returning('id').insert({schoolName: schoolName})
	.then(function(){
		res.send(schools);	
	})
	.catch(function (err) {
		console.log(err);
		res.send('something went wrong');
	})
}

module.exports = {
   getUsers,
	 
	 getPosts,
	 addPosts,
	 editPosts,
	 deletePosts,

	 getProjects,
	 addProjects,
	 editProjects,
	 deleteProjects,

	 getSchools,
	 addSchools,
	 editSchools,
	 //deleteSchools,

	 getJobs,
	 addJobs,
	 editJobs,
	 deleteJobs
}
