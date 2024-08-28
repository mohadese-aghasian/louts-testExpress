module.exports = (sequelize, DataTypes) =>{
    const OrderItems=sequelize.define("OrderItems", {
        orderId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Orders',
                key:"id"
            }
        },
        productId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Products',
                key:"id"
            }
        },
        quantity:{
            type:DataTypes.INTEGER,
            defaultValue:1,
        }
    });
    OrderItems.associate=(models)=>{
        OrderItems.belongsTo(models.Orders, {foreignKey:"orderId"});
        // OrderItems.belongsToMany(models.Products, {foreignKey:"productId"});
    }
    return OrderItems;
    
}
