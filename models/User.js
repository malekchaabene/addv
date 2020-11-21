module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        fname: {
            type: Sequelize.STRING
        },
        lname: {
            type: Sequelize.STRING
        },
        avatar: {
            type: Sequelize.STRING,
            defaultValue: "avatar.jpg"
        },
        cover: {
            type: Sequelize.STRING
        },
        birthdate: {
            type: Sequelize.DATE
        },
        about: {
            type: Sequelize.TEXT,
            defaultValue: "Write Me"
        },
        phone: {
            type: Sequelize.STRING,
            defaultValue: "87 654 321"
        },
        country: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        facebook: {
            type: Sequelize.STRING
        },
        instagram: {
            type: Sequelize.STRING
        },
        twitter: {
            type: Sequelize.STRING
        },
        point: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    }, {
        timestamps: true
    });

    return User;
}
