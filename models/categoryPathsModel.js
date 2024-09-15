module.exports = (sequelize, DataTypes) => {
    const Categorypath = sequelize.define('CategoryPaths', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      path:{
        type:DataTypes.STRING,
        unique:true,
      },
    });
    
      return Categorypath;
    };