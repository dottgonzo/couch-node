import * as Promise from "bluebird";

let rpj = require("request-promise-json");

function find(_id: string, couchdb: string) {

    return new Promise(function(resolve, reject) {

        rpj.get(couchdb + "/" + _id).then(function(obj) {
            resolve(obj);
        }).catch(function(err) {
            reject(err);
        })

    })

}

function update(obj, couchdb: string) {

    return new Promise<boolean>(function(resolve, reject) {

        find(obj._id, couchdb).then(function(o: any) {

            obj._rev = o._rev;

            create(obj, couchdb).then(function() {
                resolve(true);
            }).catch(function(err) {
                reject(err);
            })

        })

    })

}

function create(obj, couchdb: string) {

    return new Promise<boolean>(function(resolve, reject) {

        rpj.put(couchdb + "/" + obj._id, event).then(function() {
            resolve(true);
        }).catch(function(err) {
            reject(err);
        })

    })

}


class CouchManager {

    couchdb: string;

    constructor(couch: string) {

        this.couchdb = couch;


    }



    createDB() {
        let db = this.couchdb;
        rpj.get(db).catch(function(err) {
            if (err.statusCode === 404) {
                rpj.put(db).then(function() {
                    console.log("new DB " + db.split("/")[db.split("/").length - 1]);
                }).catch(function(err) {
                    throw Error(err)
                })
            } else {
                throw Error(err)
            }

        })

    }
    create(obj) {
        return create(obj, this.couchdb);
    }

    update(obj) {
        return update(obj, this.couchdb);
    }

    find(_id) {
        return find(_id, this.couchdb);
    }

}


export = CouchManager