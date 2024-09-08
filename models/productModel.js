module.exports = (sequelize, DataTypes) =>{
    const Products =sequelize.define('Products', {
        title:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        description:{
            type:DataTypes.STRING, 
            allowNull:true,
        },
        price:{
            type:DataTypes.FLOAT,
            allowNull:false,
        }, 
        coverId:{
            type:DataTypes.INTEGER,
            allowNull:true,
            references:{
                model:"ProductCovers",
                key:"id",
      },
        }
        
    });
    Products.associate=(models)=>{ Products.hasMany(models.ProductGalleries, {
        foreignKey: 'productId',
        as: 'galleries'  // Optional alias for easier querying
    });
    }
    Products.associate=(models)=>{
        Products.belongsTo(models.ProductCovers,{
            foreignKey:'coverId',
            as:'cover'
        });
    }
    return Products;
     
}


