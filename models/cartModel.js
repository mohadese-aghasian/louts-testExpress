module.exports = (sequelize, DataTypes) =>{
    const Carts=sequelize.define("Carts", {
        userId:{
            type:DataTypes.INTEGER,
            references:{
                model:'Users',
                key: 'id'
            }
        },
        total:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
    });
    return Carts;
}
