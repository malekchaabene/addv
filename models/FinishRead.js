module.exports = (sequelize, Sequelize) => {
    const FinishRead = sequelize.define('finishread', {
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },

    }, { timestamps: false });
    return FinishRead
}