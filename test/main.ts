import CouchNode from '../index';
import chai = require("chai");

let spawnPouchdbServer = require('spawn-pouchdb-server');

let expect = chai.expect;

let tmPort = 3434;

let couchDBDatabase = "http://localhost:" + tmPort + "/" + new Date().getTime;

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
            done();

        }).catch((err) => {
            done(Error(err))
        })



    });
    it("find a document", function (done) {
        CouchManager.find('ff').then((d) => {

            expect(d).to.be.ok;
            done();

        }).catch((err) => {
            done(Error(err))
        })



    });
    // write tests about multiple values (2 ip or 2 gateway for the same interface)

})
