const Sequelize = require('sequelize');


const database = process.env.DB_DATABASE;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;


const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


/// Models
db.user = require('../models/User.js')(sequelize, Sequelize);
db.book = require('../models/Book.js')(sequelize, Sequelize);
db.chapter = require('../models/Chapter.js')(sequelize, Sequelize);
db.rating = require('../models/Rating.js')(sequelize, Sequelize);
db.order = require('../models/Order.js')(sequelize, Sequelize);
db.finishread = require('../models/FinishRead.js')(sequelize, Sequelize);
db.readcurrent = require('../models/ReadCurrent.js')(sequelize, Sequelize);
db.token = require('../models/Tokens.js')(sequelize, Sequelize);

db.book.hasMany(db.chapter);
db.chapter.belongsTo(db.book);


db.user.hasMany(db.order);
db.order.belongsTo(db.user);
db.book.hasMany(db.order);
db.order.belongsTo(db.book);

db.user.hasMany(db.rating);
db.rating.belongsTo(db.user);
db.book.hasMany(db.rating);
db.rating.belongsTo(db.book);

db.user.hasMany(db.readcurrent);
db.readcurrent.belongsTo(db.user);
db.chapter.hasMany(db.readcurrent);
db.readcurrent.belongsTo(db.chapter);

db.user.hasMany(db.finishread);
db.finishread.belongsTo(db.user);
db.book.hasMany(db.finishread);
db.finishread.belongsTo(db.book);


db.user.belongsToMany(db.book, { through: "favories", as: "books", foreignKey: "user_id" })
db.book.belongsToMany(db.user, { through: "favories", as: "users", foreignKey: "book_id" })

db.user.belongsTo(db.token);
db.token.hasOne(db.user);

// db.project.belongsToMany(db.user, { as: 'Workers', through: 'worker_tasks', foreignKey: 'projectId', otherKey: 'userId'});
// db.user.belongsToMany(db.project, { as: 'Tasks', through: 'worker_tasks', foreignKey: 'userId', otherKey: 'projectId'});


module.exports = db
