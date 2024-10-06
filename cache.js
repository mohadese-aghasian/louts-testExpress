const NodeCache = require("node-cache");
const myCache = new NodeCache();
const db = require("./models/index");

async function caching() {
    try {
        // First, check if data is already cached
        const cachedCats = myCache.get('categories');

        if (cachedCats) {
            // If cached data exists, parse and log it
            console.log('Restored from cache:', JSON.parse(cachedCats));
        } else {
            // Fetch categories from the database (await the promise)
            const cat = await db.Categories.findAll({
                attributes: ['id', 'name'], // Select relevant fields to reduce payload
            });

            // Cache the result as a JSON string
            myCache.set('categories', JSON.stringify(cat));

            // Log the fetched data
            console.log('Fetched from DB:', cat);
        }
    } catch (err) {
        console.error('Error fetching categories:', err);
    }
}

// Call the function
caching();
