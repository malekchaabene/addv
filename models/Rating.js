module.exports = (sequelize, Sequelize) => {
    const Rating = sequelize.define('rating', {
        rate: {
            type: Sequelize.FLOAT
        },
    });
    return Rating;
}