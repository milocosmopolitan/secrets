const express = require('express');
const router = express.Router();
module.exports = router;

const models = require('../db/models');
const Secret = models.Secret;
const Comment = models.Comment;


router.get('/', function (req, res, next) {	

	let secrets, offset = 0, limit = 5;

	if(req.query.page) offset = req.query.page;

	Secret.findAll({
		order: '"createdAt" DESC',
		limit: limit,
		offset: (offset-1 < 0 ? 0 : offset-1) * limit
	})
	.then((data)=>{
		secrets = data;
		return Secret.count()
	})
	.then((data)=>{
		
		console.log(data);
		res.render('index', {
			secrets: secrets,
			page: parseInt(req.query.page),
			totalPages: Math.ceil(data/limit)
		});
	});
});

router.get('/add', function (req, res, next) {
	res.render('add');
});

router.get('/:secretId', function (req, res, next) {
	let data;

	Secret.findById(req.params.secretId)
	.then((secret)=>{
		data = secret
		return Comment.findAll({
			where:{
				secretId: req.params.secretId
			}
		})
	})
	.then((comments)=>{
		data.comments = comments;		
		res.render('secret', {secret: data});
	});
});

router.post('/', function (req, res, next) {
	Secret.build({
		text: req.body.text
	})
	.save()
	.then((secrets)=>{
		console.log(secrets)
		res.redirect('/');
	});
});

router.use('/:secretId/comments', require('./comments-subrouter'));