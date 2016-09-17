import CouchNode from '../index';
import chai = require("chai");

let spawnPouchdbServer = require('spawn-pouchdb-server');

let expect = chai.expect;

let tmPort = 3435;

let couchDBDatabase = "http://localhost:" + tmPort + "/" + new Date().getTime;

let CouchManager;

before(function (done) {
    this.timeout(10000);
    spawnPouchdbServer(
        {
            port: tmPort,
            backend: false,
            config: {
                admins: { "adminuser": "adminpass" },
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

                CouchManager = new CouchNode(couchDBDatabase, { user: "adminuser", password: "adminpass" });

                done();

            }
        })

});

describe("db testing with auth", function () {
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

        CouchManager.create_more([{
            _id: 'zz'
        }, {
                _id: 'ffs'
            }, {
                _id: 'ffg'
            }]).then((d) => {
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
        CouchManager.update_more([{
            _id: 'zz',
            upp: 'up2'
        }, {
                _id: 'ffs',
                upp: 'up2'
            }]).then((d) => {
                expect(d).to.be.ok;
                expect(d).to.be.an("Array");
                expect(d[0]).to.be.an("Object").to.have.property("_id");
                expect(d[0]).to.be.an("Object").to.have.property("_rev");
                done();

            }).catch((err) => {
                done(Error(err))
            })



    });

    it("search between keys", function (done) {
        CouchManager.betweenKeys('ffa','ffz').then((d) => {
            expect(d).to.be.ok;
            done();

        }).catch((err) => {
            done(Error(err))
        })

    });

    it("remove documents", function (done) {

        CouchManager.delete_more(['zz', 'ffs', 'ffg']).then((d) => {
            expect(d).to.be.ok;

            done();

        }).catch((err) => {
            done(Error(err))
        })

    });

})



