module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('order', {
        paid: {
            type: Sequelize.BOOLEAN,
            defaultValue : true,
            comment:'Paid --> True | Not Paid --> False'
        },
        owned: {
            type: Sequelize.BOOLEAN,
            defaultValue : true,
            comment:'Owned --> True | Not Owned --> False'
        },
        type: {
            type: Sequelize.STRING,
            defaultValue: "DIGITAL(PDF)",
            comment:'DIGITAL(PDF)/DIGITAL(AUDIO)/PHYSIQUAL'
        }
    });
    return Order;
}