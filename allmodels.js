// // Like.belongsTo(Blog, { foreignKey: 'blogId'});
// // Like.belongsTo(User, { foreignKey: 'userId' });
// const userModel=require("./userModel");
// const blogModel=require("./blogModel");
// const likeModel=require("./likeModel");
// const cartModel=require("./cartModel");
// const cartItemModel=require("./cartItemModel");
// const orderItemModel=require("./orderItemModel");
// const favouriteModel=require("./favouriteModel");
// const productModel=require("./productModel");
// const orderModel=require("./orderModel");


// blogModel.belongsTo(userModel, { foreignKey: 'userId', as: 'author' });
// likeModel.belongsTo(blogModel, { foreignKey: 'blogId'});
// likeModel.belongsTo(userModel, { foreignKey: 'userId' });

// cartModel.belongsTo(userModel, {foreignKey:"userId", as:"User"});
// cartItemModel.belongsTo(cartModel, {foreignKey:"cartId"});
// cartItemModel.hasMany(productModel, {foreignKey:"productId"});

// orderModel.belongsTo(userModel, {foreignKey:"userId", as:"User"});
// orderItemModel.belongsTo(cartModel, {foreignKey:"cartId"});
// orderItemModel.hasMany(productModel, {foreignKey:"productId"});

// favouriteModel.belongsTo(userModel, {foreignKey:"userId", as:"User"});
// favouriteModel.belongsTo(productModel,{foreignKey:"productId"});

// module.exports = { userModel, blogModel, likeModel,cartModel,cartItemModel,orderItemModel,orderModel,favouriteModel};
// // module.exports={Blog, User, Like};