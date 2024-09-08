module.exports=(sequelize,DataTypes)=>{
    const ProductCovers=sequelize.define("ProductCovers", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
          },
          name:{
            type:DataTypes.STRING,
            allowNull:false,
          },
          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            
          },
          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            
          }  
    });
    return ProductCovers;
}



