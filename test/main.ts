import CouchNode from '../index';
import * as chai from "chai";

const spawnPouchdbServer = require('spawn-pouchdb-server');

const expect = chai.expect;

const tmPort = 3434;

const couchDBDatabase = "http://localhost:" + tmPort + "/" + new Date().getTime;

let CouchManager;

before(function (done) {
    this.timeout(10000);
    spawnPouchdbServer(
        {
            port: tmPort,
            backend: false,
            config: {
                file: false
            },
            log: {
                file: false,
                level: 'info'
            }
        }, function (error, server) {
            if (error) {
                throw error;

            } else {

                CouchManager = new CouchNode(couchDBDatabase);

                done();

            }
        })

});

describe("db testing", function () {
    let o;
    it("create db", function (done) {
        CouchManager.createDB().then((d) => {

            expect(d).to.be.ok;
            done();

        }).catch((err) => {
            done(Error(err))
        })



    });

    it("create a document", function (done) {
        CouchManager.create({
            _id: 'ff'
        }).then((d) => {
            expect(d).to.be.ok;
            expect(d).to.be.an("Object").to.have.property("_id");
            expect(d).to.have.property("_rev");
            done();

        }).catch((err) => {
            done(Error(err))
        })



    });
    it("find a document", function (done) {
        CouchManager.find('ff').then((d) => {
            o = d;
            expect(d).to.be.an("Object").to.have.property("_id");
            expect(d).to.have.property("_rev");

            expect(d).to.be.ok;
            done();

        }).catch((err) => {
            done(Error(err))
        })



    });


    it("update a document", function (done) {
        o.up = "updated";
        CouchManager.update(o).then((d) => {
            expect(d).to.be.ok;
            expect(d).to.be.an("Object").to.have.property("up");
            expect(d).to.have.property("_id");
            expect(d).to.have.property("_rev");
            expect(d.up).to.be.eq("updated");
            done();

        }).catch((err) => {
            done(Error(err))
        })

    });

    it("delete a document", function (done) {
        CouchManager.delete('ff').then(() => {

            CouchManager.find('ff').then((d) => {
                done(Error("ff still exists"))


            }).catch(() => {
                done()
            })


        }).catch((err) => {
            done(Error(err))
        })



    });

    it("create documents", function (done) {

        CouchManager.create_more([
            {
                "_id": "ssss"
            },
            {
                "_id": "category_emergency",
                "name": "emergency"
            },
            {
                "_id": "category_hotels",
                "name": "hotels"
            },
            {
                "_id": "subcategory_emergency_hospital",
                "name": "hospital",
                "category": "emergency"
            },
            {
                "_id": "subcategory_emergency_pharmacy",
                "name": "pharmacy",
                "category": "emergency"
            }
        ]).then((d) => {
            expect(d).to.be.ok;
            expect(d).to.be.an("Array");
            expect(d[0]).to.be.an("Object").to.have.property("_id");
            expect(d[0]).to.be.an("Object").to.have.property("_rev");
            done();

        }).catch((err) => {
            done(Error(err))
        })


    });

    it("update documents", function (done) {
        CouchManager.update_more([
            {
                "_id": "category_emergency",
                "name": "emergency",
                "up": "uppetwe"
            },
            {
                "_id": "category_hotels",
                "name": "hotels",
                "up": "uppetwe"
            }
        ]).then((d) => {
            expect(d).to.be.ok;
            expect(d).to.be.an("Array");

            expect(d[0]).to.be.an("Object");
            expect(d[0]).to.have.property("_id");
            expect(d[0]).to.have.property("_rev");
            done();

        }).catch((err) => {
            done(Error(err))
        })



    });

    
 it("search between keys", function (done) {
        CouchManager.betweenKeys('category_a', 'category_z').then((d) => {
            expect(d).to.be.ok;
            expect(d).to.be.an("Array");
            expect(d.length).to.be.eq(2);

            expect(d[0]).to.be.ok;

            expect(d[0]).to.be.an("Object");
            expect(d[0]).to.have.property("_id");
            expect(d[0]).to.have.property("_rev");

            expect(d[1]).to.be.an("Object");
            expect(d[1]).to.have.property("_id");
            expect(d[1]).to.have.property("_rev");



            expect(d[0]).to.have.property("_id").that.eq("category_emergency");
            expect(d[1]).to.have.property("_id").that.eq("category_hotels");



            done();

        }).catch((err) => {
            done(Error(err))
        })

    });
   
    it("remove documents", function (done) {

        CouchManager.delete_more(['category_emergency', 'category_hotels']).then((d) => {
            expect(d).to.be.ok;

            done();

        }).catch((err) => {
            done(Error(err))
        })

    });

})
