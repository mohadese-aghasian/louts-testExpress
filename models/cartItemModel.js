module.exports = (sequelize, DataTypes) =>{
    const CartItems=sequelize.define("CartItems", {
        cartId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Carts',
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
    return CartItems;
    
}

