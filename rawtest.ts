import CouchNode = require('./index');


let tmPort=6789;

let spawnPouchdbServer = require('spawn-pouchdb-server');

spawnPouchdbServer({
    port: tmPort
}, function(error, server) {
    console.log('PouchDB Server stared at localhost:'+tmPort+'/_utils');
    
    let couchDBDatabase="http://localhost:"+tmPort+"/ciagdo";

let CouchManager=new CouchNode(couchDBDatabase);

    

})





