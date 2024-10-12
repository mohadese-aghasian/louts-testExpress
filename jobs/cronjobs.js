const db = require("../models/index");
const Redis = require('ioredis');
const cron = require('node-cron');

const redis = new Redis();


async function updateCategoryViewsInDb(){
    try{
        const keys = await redis.scan(0, 'MATCH', 'views:category:*');

        if(keys[1].lenght === 0 ){
            console.log('nothing to update');
            
            return true;
        }

        for(const key of keys[1]){
            const view = await redis.get(key);
            const categoryId = parseInt(key.split(':')[2],10); 

            if(!view){
                console.log(`no data category ${categoryId}`);
                continue;
            }

            await db.Categories.increment(
                {
                    views:parseInt(view, 10),
                },
                {
                    where:{
                        id:categoryId
                    }
                });
            await redis.del(key);   
        }
        console.log("fetch all views to category.");
        return true;

    }catch(err){
        console.log(`message:${err.message}`);
        return false;
    }
    
}

const UpdateCategoryViewJob = () => {
    cron.schedule('*/60 * * * * *', updateCategoryViewsInDb);
};

module.exports = UpdateCategoryViewJob;