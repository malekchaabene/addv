const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const Sequelize = require('sequelize')
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = express();

//// Database
const db = require('./config/dbconfig')


// Test DB
db.sequelize.authenticate()
    .then(() => console.log(chalk.green.bold('Database Connected...')))
    .catch((err) => console.log(chalk.red.bold('Error Database : ' + err)))


// db.sequelize.sync({ force: true }).then(() => {
//     console.log(chalk.green.bold('Drop and Resync with Database ...'))
// });


// Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('/uploads'));
app.use('/assets/', express.static('assets'));



// Routes

const userRouter = require('./routes/user')


app.use(userRouter)

app.listen(PORT, () => {
    console.log(chalk.white.inverse.bold(`server is running on Port ${PORT}!`))
    //console.log(`server is running on Port ${PORT}!`)
})