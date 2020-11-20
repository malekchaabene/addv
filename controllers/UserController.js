const Sequelize = require('sequelize')
const { Op } = require('sequelize');
const { user } = require('../config/dbconfig');
const fs = require('fs');
var dateFormat = require('dateformat');
//Import Models
const db = require('../config/dbconfig');
const chalk = require('chalk');
const User = db.user;
const Book = db.book;
const Order = db.order;
const Chapter = db.chapter;
const ReadCurrent = db.readcurrent
const FinishRead = db.finishread
const Rating = db.rating

module.exports = {


    ////////////////////////////////
    ////////// Favories 
    ////////////////////////////////
    async favories(req, res) {
        try {
            const favorie = await User.findOne({
                where: {
                    id: req.user.id,
                },
                include: [
                    {
                        model: Book,
                        as: "books"
                    }
                ]
            })
            res.status(200).json(favorie);
        } catch (error) {
            res.status(500).json(error);
        }
    },


    ////////////////////////////////
    ////////// Search Books 
    ////////////////////////////////
    async searchbook(req, res) {
        try {
            const books = await Book.findAll({
                subQuery: false,
                attributes: {
                    include: [
                        [Sequelize.fn('AVG', Sequelize.col('ratings.rate')), 'rates']
                    ]
                },
                where: {
                    [Op.or]: {
                        category: { [Op.like]: "%" + req.body.search.toLowerCase() + "%" },
                        author: { [Op.like]: "%" + req.body.search.toLowerCase() + "%" },
                        title: { [Op.like]: "%" + req.body.search.toLowerCase() + "%" },
                    }
                },
                include: [
                    {
                        model: Rating,
                        attributes: [],
                        required: false,
                    },
                    {
                        model: Chapter,
                    }
                ],
                group: ['book.title']
            })
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json(error);
        }
    },



    ////////////////////////////////
    ////////// My Orders Owned 
    ////////////////////////////////
    async myorders(req, res) {
        try {
            const orders = await Order.findAll({
                where: {
                    [Op.and]: [
                        { owned: true },
                        { userId: req.user.id }
                    ]
                },
                include: [
                    {
                        model: Book
                    }
                ]
            })
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json(error);
        }
    },


    ////////////////////////////////
    ////////// My Orders
    ////////////////////////////////
    async orders(req, res) {
        try {
            const orders = await Order.findAll({
                where: {
                    [Op.and]: [
                        { owned: false },
                        { userId: req.user.id }
                    ]
                },
                include: [
                    {
                        model: Book
                    }
                ]
            })
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json(error);
        }
    },


    ////////////////////////////////
    ////////// Top 100 Readers
    ////////////////////////////////
    async topreaders(req, res) {
        try {
            // const users = await User.findAll({
            //     attributes: {
            //         include: [
            //             [Sequelize.fn('COUNT', 'Book.id'), 'books']
            //         ]
            //     }
            // })


            const users = await FinishRead.findAll({
                attributes: {
                    include: [
                        [Sequelize.fn('COUNT', 'Book.id'), 'books']
                    ]
                },
                include: [
                    {
                        model: User
                    }
                ],
                group: 'FinishRead.userId',
                order: [[Sequelize.literal('`books`'), 'DESC']],
                //limit: 100
            })

            const index = users.findIndex((user) => {
                return user.userId == req.user.id
            })

            res.status(200).json({ index: index, user: users[index], users: users.slice(0, 100) });
        } catch (error) {
            res.status(500).json(error);
        }
    },


    ////////////////////////////////
    ////////// Add TO Favorie
    ////////////////////////////////
    async addFavorie(req, res) {
        try {
            const book = await Book.findByPk(req.body.id)
            console.log(book)
            User.findByPk(req.user.id).then((user) => {
                user.addBook(book)
            })
            res.status(200).json({ msg: "book Addet To Favories" });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    ////////////////////////////////
    ////////// Remove From Favorie
    ////////////////////////////////
    async removeFavorie(req, res) {
        try {
            const book = await Book.findByPk(req.body.id)
            User.findByPk(req.user.id).then((user) => {
                user.removeBook(book)
            })
            res.status(200).json({ msg: "book Removed From Favories" });
        } catch (error) {
            res.status(500).json(error);
        }
    },


    ////////////////////////////////
    ////////// Add Rating
    ////////////////////////////////
    async addRating(req, res) {
        try {
            const rate = await Rating.findOne({
                where: {
                    userId: req.user.id,
                    bookId: req.body.id,
                }
            })
            console.log(rate)
            if (!rate) {
                await Rating.create({
                    rate: req.body.rate,
                    userId: req.user.id,
                    bookId: req.body.id,
                })
            } else {
                await rate.update({
                    rate: req.body.rate
                });
            }

            res.status(200).json({ msg: "Rate Added" });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    ////////////////////////////////
    ////////// Upload User Avatar
    ////////////////////////////////
    async uploadAvatar(req, res, next) {
        console.log("Etape 1")
        if (!req.body.file || Object.keys(req.body.file).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        var base64Data = req.body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        var fileName = req.user.id + "." + dateFormat(Date.now(), "yyyy-mm-dd-hh.MM.ss") + '.jpg';
        console.log(chalk.yellow.bold(fileName))
        try {
            fs.writeFileSync("./uploads/images/" + fileName, base64Data, 'base64');
            req.user.avatar = fileName;
            await req.user.save();
            return res.status(200).send({ "status": "success", "ImageName": fileName });
        } catch (e) {
            next(e);
        }
        res.status(200).send({ "msg": "Fail Upload" })
    },



    ////////////////////////////////
    ////////// User Avatar Image Gate
    ////////////////////////////////
    async userAvatar(req, res) {
        var img = './uploads/images/' + req.params.img;
        res.sendfile(img);
    },


    ////////////////////////////////
    ////////// Edit User Account Info
    ////////////////////////////////
    async editUser(req, res) {
        console.log('Enter Edit')
        try {
            req.user.fname = req.body.fname;
            req.user.lname = req.body.lname;
            req.user.phone = req.body.phone;
            req.user.about = req.body.about;
            req.user.email = req.body.email;
            console.log(req.body.fname)
            await req.user.save()
            res.status(200).send({ "status": "success", msg: "User Updated", user: req.user })
        } catch (error) {
            res.status(500).json(error);
        }
    },



    ////////////////////////////////
    ////////// User Current Read Chapter
    ////////////////////////////////
    async currentRead(req, res) {
        try {
            const readCurrent = await ReadCurrent.findAll({
                where: {
                    'stats': false,
                    userId: req.user.id,
                }, include: [{
                    model: Chapter,
                    include: [{
                        model: Book,
                    }]
                },],
                //order: Sequelize.literal('rand()'),
            });
            console.log(readCurrent)
            res.status(200).send({ "readCurrent": readCurrent })
        } catch (error) {
            res.status(500).json(error);
        }
    },


    ////////////////////////////////
    ////////// Complete Chapter Read
    ////////////////////////////////
    async completeChapter(req, res) {
        try {

            const read = await ReadCurrent.findOne({
                where: {
                    userId: { [Op.eq]: req.user.id },
                    ChapterId: { [Op.eq]: req.params.id },
                }
            })

            if (read.stats == false) {
                req.user.point += 25;
                await req.user.save();
            }

            if (read) {
                read.stats = true;
                await read.save();
            }

            res.status(200).json({ msg: "Finish Read Chapter", user: req.user });
        } catch (error) {
            res.status(500).json(error);
        }
    },


    ////////////////////////////////
    ////////// Complete Book Read
    ////////////////////////////////
    async completeBook(req, res) {
        try {

            const read = await FinishRead.findOne({
                where: {
                    userId: { [Op.eq]: req.user.id },
                    bookId: { [Op.eq]: req.params.id },
                }
            })

            if (!read) {
                req.user.point += 100;
                await req.user.save();
                await FinishRead.create({
                    userId: req.user.id,
                    bookId: req.params.id
                })
            }

            res.status(200).json({ msg: "Finish Read Book", user: req.user });
        } catch (error) {
            res.status(500).json(error);
        }
    },


    ////////////////////////////////
    ////////// My Finished Books
    ////////////////////////////////
    async finishBook(req, res) {
        try {
            const orders = await FinishRead.findAll({
                where: {
                    userId: req.user.id
                },
                include: [
                    {
                        model: Book
                    }
                ]
            })
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json(error);
        }
    },
}