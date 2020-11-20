const Sequelize = require('sequelize')
const { Op } = require('sequelize')
const fs = require('fs')
//Import Models
const db = require('../config/dbconfig');
const chalk = require('chalk');
const User = db.user;
const Book = db.book;
const Chapter = db.chapter;
const ReadCurrent = db.readcurrent
const Rating = db.rating



/*
 attributes : attributes,
    include    : [{ model: bar, attributes: attributes}]
*/


module.exports = {


    ////////////////////////////////
    ////////// Home Page [Mobile]
    ////////////////////////////////
    async home(req, res) {
        try {
            // Book.findAll({ order: Sequelize.literal('rand()'), limit: 2 }).then((encounters) => {
            //     // single random encounter
            //     console.log(encounters)
            //     res.status(200).json({ msg: encounters });
            // });
            //const books = await Book.findAll({ order: Sequelize.literal('rand()'), limit: 1 });
            const books = await Book.findAll({
                subQuery: false,
                attributes: {
                    include: [
                        [Sequelize.fn('AVG', Sequelize.col('ratings.rate')), 'rates']
                    ]
                },
                include: [
                    {
                        model: Rating,
                        attributes: [],
                        required: false,
                    }
                ],
                group: ['book.title'],
                order: Sequelize.literal('rand()'), limit: 1
            })
            const bestBooks = await Book.findAll({
                subQuery: false,
                attributes: {
                    include: [
                        [Sequelize.fn('AVG', Sequelize.col('ratings.rate')), 'rates']
                    ]
                },
                include: [
                    {
                        model: Rating,
                        attributes: [],
                        required: false,
                    }
                ],
                group: ['book.title'],
                order: [['createdAt', 'DESC']],
                limit: 5
            });
            //const chapters = await Chapter.findByPk('1')
            // const chapters = await Chapter.findAll({
            //     //attributes: attributes,
            //     include: [{
            //         model: Book,
            //         //attributes: attributes
            //     }]
            // })

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
                order: Sequelize.literal('rand()'),
            });
            // const chaps = await ReadCurrent.findAll({
            //     where: {
            //         userId :'1'
            //     },
            //     include: [{
            //         model: Chapter,
            //         //attributes: attributes
            //     }]
            // })

            res.status(200).json({ sectionOne: bestBooks, sectionTwo: books, sectionThree: readCurrent });

        } catch (error) {
            res.status(500).json(error);
        }

    },

    ////////////////////////////////
    ////////// Book Details [Mobiles]
    ////////////////////////////////
    async bookdetails(req, res) {
        try {

            console.log(req.body.bookid)
            const book = await Book.findOne({
                // attributes: {
                //     // include: [
                //     //     [Sequelize.fn('AVG', Sequelize.col('ratings.rate')), 'rates']
                //     // ]
                // },
                where: {
                    id: req.body.bookid,
                },
                include: [
                    {
                        model: Chapter,
                    },
                    // {
                    //     model: Rating,
                    // }
                ]
            })
            console.log(book)

            // const books = await Book.findAll({
            //     where: {
            //         category: { [Op.like]: "%" + book.category.toLowerCase() + "%" },
            //     },
            //     order: Sequelize.literal('rand()'),
            //     limit: 1
            // });

            const books = await Book.findAll({
                subQuery: false,
                attributes: {
                    include: [
                        [Sequelize.fn('AVG', Sequelize.col('ratings.rate')), 'rates']
                    ]
                },
                where: {
                    [Op.or]: {
                        category: { [Op.like]: "%" + book.category.toLowerCase() + "%" },
                        author: { [Op.like]: "%" + book.author.toLowerCase() + "%" },
                    }
                },
                include: [
                    {
                        model: Rating,
                        attributes: [],
                        required: false,
                    }
                ],
                group: ['book.title'],
                order: Sequelize.literal('rand()'),
                limit: 1
            })

            res.status(200).json({ book: book, books: books });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    async bookAvatar(req, res) {
        var img = './uploads/images/' + req.params.img;
        res.sendfile(img);
    },
    async bookPdfChapter(req, res) {
        // const pdf = fs.readFileSync('./uploads/docs/' + req.params.doc);
        // // var file = fs.createReadStream('./uploads/docs/' + req.params.doc);
        // // var stat = fs.statSync('./uploads/docs/' + req.params.doc);
        // // res.setHeader('Content-Length', stat.size)
        // res.setHeader('Content-Type', 'application/pdf')
        // // res.setHeader('Content-Disposition', 'attachment; filename=quate.pdf')
        // // //var pdf = './uploads/docs/' + req.params.doc;
        // // // res.contentType("application/pdf")
        // // // res.send(pdf);
        // // file.pipe(res)
        // res.send(pdf);

        //var tempFile = "./uploads/docs/" + req.params.doc;

        const chapter = await Chapter.findByPk(req.params.doc)
        const read = await ReadCurrent.findOne({
            where: {
                userId: { [Op.eq]: req.params.user },
                ChapterId: { [Op.eq]: chapter.id },
            }
        })

        if (read) {
            await read.save();
        } else {
            await ReadCurrent.create({
                stats: false,
                userId: req.params.user,
                ChapterId: chapter.id,
            })
        }


        var tempFile = "./uploads/docs/" + chapter.file;
        console.log(chalk.redBright.bold(tempFile))
        var file = fs.createReadStream(tempFile);
        var fileName = "fff.pdf"
        fileName = encodeURIComponent(fileName)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"')
        file.pipe(res)




        // var stream = fs.readStream(tempFile)
        // var fileName = "fff.pdf"
        // fileName = encodeURIComponent(fileName)
        // res.setHeader('Content-Type', 'application/pdf')
        // res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"')
        // stream.pipe(res)
        // fs.readFile(tempFile, (err, data) => {
        //     var fileName = "fff.pdf"
        //     fileName = encodeURIComponent(fileName)
        //     res.setHeader('Content-Type', 'application/pdf')
        //     res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"')
        //     console.log(data)
        //     res.send(data);
        // })




    }
}