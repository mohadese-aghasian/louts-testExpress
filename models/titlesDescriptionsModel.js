module.exports = (sequelize, DataTypes) => {
    const TitleDescription = sequelize.define('TitlesDescriptions', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
      url:{
          type:DataTypes.STRING, 
          allowNull:false,
        },
      titles:{
          type:DataTypes.JSONB,
        }, 
      descriptions:{
          type:DataTypes.JSONB,
        },
      createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      updatedAt: {
          allowNull: false,
          type:DataTypes.DATE,
        }
    });
  

    return TitleDescription;
  };