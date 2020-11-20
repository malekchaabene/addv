module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define('book', {
        title: {
            type: Sequelize.STRING,
        },
        author: {
            type: Sequelize.STRING,
        },
        cover: {
            type: Sequelize.STRING
        },
        category: {
            type: Sequelize.STRING,
            comment : "Fantasy/Adventure/Romance/Contemporary/Dystopian/Mystery/Horror/Thriller",
        },
        description: {
            type: Sequelize.STRING
        },
        totalChapter: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        free: {
            type: Sequelize.BOOLEAN
        },
        price: {
            type: Sequelize.FLOAT
        },
        digital:{
            type: Sequelize.BOOLEAN
        },
        file:{
            type: Sequelize.STRING
        }
    });
    return Book;
}