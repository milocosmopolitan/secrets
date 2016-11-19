const Sequelize = require('sequelize');

const db = new Sequelize(
    'postgres://localhost:5432/secrets'
);

const SecretModel = db.define('secret', {
	text: Sequelize.TEXT
});

const CommentModel = db.define('comment', {
	text: Sequelize.TEXT
});

SecretModel.hasMany(CommentModel, {as: 'Comments'})
//CommentModel.belongsTo(SecretModel, {as: 'Secret'})

module.exports = {
    Secret: SecretModel,
    Comment: CommentModel
};