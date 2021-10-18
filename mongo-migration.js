const mongo = require('./mongo-connect');

const docs = {}

const ids = {
    "60e6d623a770eaf8d02a6214":"60e6d623a770eaf8d02a6220",
    "60e6d623a770eaf8d02a6215":"60e6d623a770eaf8d02a6228",
    "60e6d623a770eaf8d02a6216":"60e6d623a770eaf8d02a6226",
    "60e6d623a770eaf8d02a6217":"60e6d623a770eaf8d02a6229",

}
async function start() {
    const db = await mongo();

    const files = await db.collection("documents").find({}).toArray()
    files.forEach((e,i) => {
        if(!e.lang) return;
        const key = e.pdf_path || e.source;
        if(!docs[key]) docs[key] = {};
        docs[key] = {
            ...docs[key],
            id: e._id.toString(),
            categories: e.categories, 
            year: e.year,
            [e.lang]: {
                title: e.title,
                source: key
            },
            created_at: e.created_at,
            reference_at: e.reference_at
        }

        console.log(i,e.title, e._id.toString(), e.pdf_path || e.source)
    })
    //console.log(docs);
}  
start();