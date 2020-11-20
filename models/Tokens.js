module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define('tokens', {
        token: {
            type: Sequelize.TEXT
        },
    });
    return Token;
}