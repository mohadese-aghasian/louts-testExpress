module.exports = (sequelize, DataTypes) =>{
    
const Orders=sequelize.define("Orders", {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    total:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },

});
    Orders.associate=(models)=>{
        Orders.belongsTo(models.Users, {foreignKey:"userId"});
    }
    return Orders;
}




