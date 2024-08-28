module.exports = (sequelize, DataTypes) =>{
    
const UserTokens = sequelize.define('UserTokens', {
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
    timestamps: false
});
    UserTokens.associate=(models)=>{
        UserTokens.belongsTo(models.Users, {foreignKey:'user_id'});
    }
    return UserTokens;
}
