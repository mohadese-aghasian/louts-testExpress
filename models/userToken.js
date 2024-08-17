const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Adjust the path to your Sequelize instance

const UserToken = sequelize.define('UserToken', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', 
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user_tokens',
    timestamps: false
});

module.exports = UserToken;
