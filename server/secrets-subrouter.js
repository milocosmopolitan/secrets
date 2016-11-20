const express = require('express');
const router = express.Router();
module.exports = router;

const models = require('../db/models');
const Secret = models.Secret;
const Comment = models.Comment;


router.get('/', function (req, res, next) {	

	let secrets, limit = 5,
		// set current page number as 'page' key exist in reqest.query or 1 if doesn't exist
		currentPage = parseInt(req.query.page) || 1,		
		offset = req.query.page ? (currentPage-1 < 0 ? 0 : currentPage-1) * limit : 0;

	Secret.findAll({
		order: '"createdAt" DESC',
		limit: limit,
		offset: offset
	}).then((data)=>{
		secrets = data;
		if(secrets.length===0) throw new Error('no secrets');

		// get total number of rows in secret table
		return Secret.count();
	}).then((data)=>{
		let totalPages = Math.ceil(data/limit);
		if(currentPage > totalPages) currentPage = totalPages;
		res.render('index', {
			secrets: secrets,
			page: currentPage,
			totalPages: totalPages
		});
	}).catch(()=>{
		res.render('index');
	});
});

router.get('/add', function (req, res, next) {
	res.render('add');
});

router.get('/:secretId', function (req, res, next) {
	let data;

	Secret.findById(req.params.secretId)
	.then((secret)=>{
		if(!secret) throw new Error('Secret ID ' + req.params.secretId +' does not exist');
		
		data = secret
		return Comment.findAll({
			where:{
				secretId: req.params.secretId
			}
		})
	}).then((comments)=>{
		data.comments = comments;		
		res.render('secret', {secret: data});
	})	.catch(()=>{
		res.redirect('/');
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