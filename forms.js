const fs = require('fs');

var content;

const list = [];

function start() {
    content = fs.readFileSync("./outputs/pages.json", {encoding: "utf-8"})
    content = JSON.parse(content);
    processAll();
}
function processAll() {
    content.forEach(e => processEach(e))
}

function processEach(obj) {
    if(obj.shared) {
        obj.shared = processObject(obj.shared)
    } 
    if(obj['pt-BR']) {
        obj['pt-BR'] = processObject(obj['pt-BR'])
    } 
    if(obj['en-US']) {
        obj['en-US'] = processObject(obj['en-US'])
    }
    list.push(obj);
    fs.writeFileSync("./outputs/fields.json",JSON.stringify(list, null, 2) , "utf8")
}
function processObject(obj) {
    const newObj = {...obj}
    Object.keys(obj).forEach(e => {
        const cursor = obj[e];
        switch(typeof cursor) {
            case 'string':
                if(cursor.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}([0-9]+)?Z/)) {
                    newObj[e] = 'date'
                } else {
                    newObj[e] = 'string'
                }
                break;
            case 'object':
                if(Array.isArray(cursor)) {
                    newObj[e] = "array"
                } else {
                    newObj[e] = processObject(cursor);    
                }
                break;
            case 'number': 
                newObj[e] = 'number'
                break;
        }
    })
    return newObj;
}
start();