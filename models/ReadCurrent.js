module.exports = (sequelize, Sequelize) => {
    const ReadCurrent = sequelize.define('readcurrent', {
        stats: {
            type: Sequelize.BOOLEAN,
            comment: '0 : NOT FINISH / 1 : FINISH'
        }
    });
    return ReadCurrent;
}