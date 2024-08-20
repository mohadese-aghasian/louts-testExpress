const { faker } = require('@faker-js/faker');
const sequelize = require('./models'); // Adjust this to your sequelize configuration
const { User, Blog, Like } = require('./models/allmodels'); // Adjust the path if needed

(async () => {
    try {
        // Synchronize all models with the database
        await sequelize.sync({ force: true });

        // Create 100 fake users
        const users = [];
        for (let i = 0; i < 100; i++) {
            const user = await User.create({
                username: faker.internet.userName(),
                password: faker.internet.password()
            });
            users.push(user);
        }

        // Create 100 fake blogs
        const blogs = [];
        for (let i = 0; i < 100; i++) {
            const blog = await Blog.create({
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraphs(),
                likeNum: faker.datatype.number({ min: 0, max: 100 }),
                userId: users[faker.datatype.number({ min: 0, max: 99 })].id // Assign blog to a random user
            });
            blogs.push(blog);
        }

        // Create 100 fake likes
        for (let i = 0; i < 100; i++) {
            await Like.create({
                blogId: blogs[faker.datatype.number({ min: 0, max: 99 })].id, // Assign like to a random blog
                userId: users[faker.datatype.number({ min: 0, max: 99 })].id  // Assign like to a random user
            });
        }

        console.log('100 fake records inserted successfully!');
        process.exit(0); // Exit the script
    } catch (error) {
        console.error('Error inserting fake data:', error);
        process.exit(1); // Exit the script with error
    }
})();
