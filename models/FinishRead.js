module.exports = (sequelize, Sequelize) => {
    const FinishRead = sequelize.define('finishread', {
        date: {
            type: Sequelize.DATE,
        },

    }, { timestamps: false });
    return FinishRead
}