// Like.belongsTo(Blog, { foreignKey: 'blogId'});
// Like.belongsTo(User, { foreignKey: 'userId' });
const userModel=require("./userModel");
const blogModel=require("./blogModel");
const likeModel=require("./likeModel");


blogModel.belongsTo(userModel, { foreignKey: 'userId', as: 'author' });
likeModel.belongsTo(blogModel, { foreignKey: 'blogId'});
likeModel.belongsTo(userModel, { foreignKey: 'userId' });


module.exports = { userModel, blogModel, likeModel};
// module.exports={Blog, User, Like};