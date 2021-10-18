const { MongoClient } = require('mongodb')
const MONGODB_URL="mongodb+srv://tc-ri-client:G9UNwDm8Myfju72NxfkE2K4sH2Kdns@cluster0.rlkcj.mongodb.net/shared?retryWrites=true&w=majority"
let client;

module.exports = async () => {
    if(client) return client;

    if(!client) {
        const conn = new MongoClient(MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        let link = await conn.connect()
        client = await link.db("shared")

    }
    return client;
}