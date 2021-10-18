const glob = require('glob'), fs = require('fs');
const collection = [];


async function start() { // step1
    glob("../tc-ri-client/src/pages/api/lang/**/*.json", async (err, files) => {
        if(err) {
            console.error(err);
            return;
        }
        jsCollection = files;
        console.log(jsCollection)
        grabJSContent()
    })
}

function grabJSContent() {
    return new Promise( resolve => {
        const cursor = jsCollection.shift();
        let content = fs.readFileSync(cursor, {encoding: "utf8"});
        processContent(cursor,content)
            .then(() => {
                if(!jsCollection.length) {
                    fs.writeFileSync("./outputs/pages.json", JSON.stringify(collection), "utf8")
                    resolve();
                } else {
                    grabJSContent()
                }
            })
    })
}
function processContent(path,content) {
    return new Promise(resolve => {
        if(path.indexOf("[...tpl]") > -1) {
            resolve();
            return;
        }
        let json = JSON.parse(content)
        let lang = path.match(/lang\/([^\/]+)/)
        if(lang.length) lang = lang[1]
        let template = json.template;
        delete json.template;
        
        const clearPath = path.split("src/pages")[1]
            .replace(".json",'')
            .replace("[id]",'<<id>>')
            .replace("/api",'')
            .replace("/lang/"+lang+"/",'')
        
        const registry = {
            "file": clearPath,
            isSubRouter: path.indexOf("articles") > -1,
            [lang]:json
        };
        if(template) registry.template = template;
        const cursor = collection.find(e => {
            return e.file == clearPath
        })
        if(cursor) {
            console.log(lang);
            cursor[lang] = json;
        } else {
            collection.push(registry)
        }
        resolve();
    })
}

start();
