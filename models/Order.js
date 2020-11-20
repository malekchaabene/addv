module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('order', {
        paid: {
            type: Sequelize.BOOLEAN
        },
        owned: {
            type: Sequelize.BOOLEAN,
            comment:'Owned --> True | Not Owned --> False'
        },
        type: {
            type: Sequelize.STRING,
            comment:'DIGITAL(PDF)/DIGITAL(AUDIO)/PHYSIQUAL'
        }
    });
    return Order;
}