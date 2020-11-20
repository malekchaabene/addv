module.exports = (sequelize, Sequelize) => {
    const Chapter = sequelize.define('chapter', {
        order: {
            type: Sequelize.INTEGER,
        },
        title: {
            type: Sequelize.STRING,
        },
        subtitle: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        },
        file: {
            type: Sequelize.STRING,
        },
        audio: {
            type: Sequelize.STRING,
        }
    });
    return Chapter;
}