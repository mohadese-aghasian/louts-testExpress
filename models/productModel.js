module.exports = (sequelize, DataTypes) =>{
    const Products =sequelize.define('Products', {
        title:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        description:{
            type:DataTypes.STRING, 
            allowNull:true,
        },
        price:{
            type:DataTypes.FLOAT,
            allowNull:true,
        },
        cover:{
            type:DataTypes.STRING,
            allowNull:true,
        },
    });
    return Products;
     
}


