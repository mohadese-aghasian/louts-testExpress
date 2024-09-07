const { faker } = require('@faker-js/faker');
const db = require("./models/index");
const { options } = require('joi');



(async ()=>{
    try{
        const users = [];
        for (let i = 0; i < 100; i++) {
            const user = await db.Users.create({
                username: faker.internet.userName(),
                password: faker.internet.password(),
                email:faker.internet.email()
            });
            users.push(user);
        }
        // const blogs = [];
        // for (let i = 0; i < 100; i++) {
        //     const blog = await db.Blogs.create({
        //         title: faker.lorem.sentence(),
        //         content: faker.lorem.paragraphs(),
        //         likeNum: faker.number.int({ min: 0, max: 99 }),
        //         userId: users[faker.number.int({ min: 0, max: 99 })].id // Assign blog to a random user
        //     });
        //     blogs.push(blog);
        // }
        // for (let i = 0; i < 100; i++) {
        //     await db.Likes.create({
        //         blogId: blogs[faker.number.int({ min: 0, max: 99 })].id, // Assign like to a random blog
        //         userId: users[faker.number.int({ min: 0, max: 99 })].id  // Assign like to a random user
        //     });
        // }
        var products=[];
        for (let i =0; i<100; i++){
            const product= await db.Products.create({
                title:faker.commerce.product(),
                description:faker.commerce.productDescription(),
                price:faker.commerce.price(),
                cover:faker.image.url({options:{width:200,height:200}})
            }); 
            products.push(product);
        }
        for(let i=0;i<100;i++){
            const favouriteproduct=await db.FavouriteProducts.create({
                userId:users[faker.number.int({min:0, max:99})].id,
                productId:products[faker.number.int({min:0, max:99})].id,
            });
        }
        var carts=[];
        for(let i=0; i<100;i++){
            const cart=await db.Carts.create({
                userId:users[faker.number.int({min:0, max:99})].id,
                total:faker.number.int({min:5,max:1000}),
            });
            carts.push(cart);
        }
        for(let i=0; i<100;i++){
            const cartitem=await db.CartItems.create({
                productId:products[faker.number.int({min:0,max:99})].id,
                cartId:carts[faker.number.int({min:0,max:99})].id,
                quantity:faker.number.int({min:1, max:10}),
            });
        }
        var orders=[];
        for(let i=0; i<100;i++){
            const order=await db.Orders.create({
                userId:users[faker.number.int({min:0, max:99})].id,
                total:faker.number.int({min:5,max:1000}),
            });
            orders.push(order);
        }
        for(let i=0; i<100;i++){
            const orderitem=await db.OrderItems.create({
                productId:products[faker.number.int({min:0,max:99})].id,
                orderId:orders[faker.number.int({min:0,max:99})].id,
                quantity:faker.number.int({min:1, max:10}),
            });
        }
        for(let i=0;i<100;i++){
            const gallery=await db.ProductGalleries.create({
                productId:faker.number.int({min:602,max:701}),
                path:faker.image.url({options:{width:200,height:200}}),
                
            });
        }
        
        
        process.exit(0);

    }catch(err){
        console.error(err);
        console.log(err);
        process.exit(1);
    }
})();