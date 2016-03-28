import CouchNode = require('../index');
import chai = require("chai");

let spawnPouchdbServer = require('spawn-pouchdb-server');

let expect = chai.expect;

let tmPort = 3434;

let couchDBDatabase = "http://localhost:" + tmPort + "/" + new Date().getTime;


describe("create new document", function() {

    spawnPouchdbServer({
        port: tmPort
    }, function(error, server) {
        console.log('PouchDB Server stared at localhost:' + tmPort + '/_utils');


        let CouchManager = new CouchNode(couchDBDatabase);

        setTimeout(function() {



            CouchManager.create("zz").then(function() {

                it("should return an object", function() {
                    expect("networking").to.be.ok;
                });



            }).catch(function() {


            })





            describe("network entry", function() {



                describe("wifi property (if wifi device is present on your computer", function() {


                    it("check essid if present", function() {
                        expect("networking").to.be.ok;

                    });

                });

            });






        }, 5000)
    });
    // write tests about multiple values (2 ip or 2 gateway for the same interface)

})
