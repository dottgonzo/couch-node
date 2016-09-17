"use strict";
var index_1 = require('../index');
var chai = require("chai");
var spawnPouchdbServer = require('spawn-pouchdb-server');
var expect = chai.expect;
var tmPort = 3434;
var couchDBDatabase = "http://localhost:" + tmPort + "/" + new Date().getTime;
var CouchManager;
before(function (done) {
    this.timeout(10000);
    spawnPouchdbServer({
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
        }
        else {
            CouchManager = new index_1.default(couchDBDatabase);
            done();
        }
    });
});
describe("db testing", function () {
    var o;
    it("create db", function (done) {
        CouchManager.createDB().then(function (d) {
            expect(d).to.be.ok;
            done();
        }).catch(function (err) {
            done(Error(err));
        });
    });
    it("create a document", function (done) {
        CouchManager.create({
            _id: 'ff'
        }).then(function (d) {
            expect(d).to.be.ok;
            expect(d).to.be.an("Object").to.have.property("_id");
            expect(d).to.have.property("_rev");
            done();
        }).catch(function (err) {
            done(Error(err));
        });
    });
    it("find a document", function (done) {
        CouchManager.find('ff').then(function (d) {
            o = d;
            expect(d).to.be.an("Object").to.have.property("_id");
            expect(d).to.have.property("_rev");
            expect(d).to.be.ok;
            done();
        }).catch(function (err) {
            done(Error(err));
        });
    });
    it("update a document", function (done) {
        o.up = "updated";
        CouchManager.update(o).then(function (d) {
            expect(d).to.be.ok;
            expect(d).to.be.an("Object").to.have.property("up");
            expect(d).to.have.property("_id");
            expect(d).to.have.property("_rev");
            expect(d.up).to.be.eq("updated");
            done();
        }).catch(function (err) {
            done(Error(err));
        });
    });
    it("delete a document", function (done) {
        CouchManager.delete('ff').then(function () {
            CouchManager.find('ff').then(function (d) {
                done(Error("ff still exists"));
            }).catch(function () {
                done();
            });
        }).catch(function (err) {
            done(Error(err));
        });
    });
    it("create documents", function (done) {
        CouchManager.create_more([{
                _id: 'zz'
            }, {
                _id: 'ffs'
            }, {
                _id: 'ffg'
            }]).then(function (d) {
            expect(d).to.be.ok;
            expect(d).to.be.an("Array");
            expect(d[0]).to.be.an("Object").to.have.property("_id");
            expect(d[0]).to.be.an("Object").to.have.property("_rev");
            done();
        }).catch(function (err) {
            done(Error(err));
        });
    });
    it("update documents", function (done) {
        CouchManager.update_more([{
                _id: 'zz',
                upp: 'up2'
            }, {
                _id: 'ffs',
                upp: 'up2'
            }]).then(function (d) {
            expect(d).to.be.ok;
            expect(d).to.be.an("Array");
            expect(d[0]).to.be.an("Object").to.have.property("_id");
            expect(d[0]).to.be.an("Object").to.have.property("_rev");
            done();
        }).catch(function (err) {
            done(Error(err));
        });
    });
    it("search between keys", function (done) {
        CouchManager.betweenKeys('ffa', 'ffz').then(function (d) {
            expect(d).to.be.ok;
            done();
        }).catch(function (err) {
            done(Error(err));
        });
    });
    it("remove documents", function (done) {
        CouchManager.delete_more(['zz', 'ffs', 'ffg']).then(function (d) {
            expect(d).to.be.ok;
            done();
        }).catch(function (err) {
            done(Error(err));
        });
    });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0JBQXNCLFVBQVUsQ0FBQyxDQUFBO0FBQ2pDLElBQVksSUFBSSxXQUFNLE1BQU0sQ0FBQyxDQUFBO0FBRTdCLElBQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFM0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUUzQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFFcEIsSUFBTSxlQUFlLEdBQUcsbUJBQW1CLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUVoRixJQUFJLFlBQVksQ0FBQztBQUVqQixNQUFNLENBQUMsVUFBVSxJQUFJO0lBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsa0JBQWtCLENBQ2Q7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxLQUFLO1FBQ2QsTUFBTSxFQUFFO1lBQ0osSUFBSSxFQUFFLEtBQUs7U0FDZDtRQUNELEdBQUcsRUFBRTtZQUNELElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLE1BQU07U0FDaEI7S0FDSixFQUFFLFVBQVUsS0FBSyxFQUFFLE1BQU07UUFDdEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNSLE1BQU0sS0FBSyxDQUFDO1FBRWhCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUVKLFlBQVksR0FBRyxJQUFJLGVBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUU5QyxJQUFJLEVBQUUsQ0FBQztRQUVYLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQTtBQUVWLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUNuQixJQUFJLENBQUMsQ0FBQztJQUNOLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBVSxJQUFJO1FBQzFCLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO1lBRTNCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNuQixJQUFJLEVBQUUsQ0FBQztRQUVYLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7WUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFJTixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLElBQUk7UUFDbEMsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUNoQixHQUFHLEVBQUUsSUFBSTtTQUNaLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkMsSUFBSSxFQUFFLENBQUM7UUFFWCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHO1lBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBSU4sQ0FBQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxJQUFJO1FBQ2hDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztZQUMzQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVuQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbkIsSUFBSSxFQUFFLENBQUM7UUFFWCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHO1lBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBSU4sQ0FBQyxDQUFDLENBQUM7SUFHSCxFQUFFLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxJQUFJO1FBQ2xDLENBQUMsQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQ2pCLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNqQyxJQUFJLEVBQUUsQ0FBQztRQUVYLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7WUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFTixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLElBQUk7UUFDbEMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFM0IsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQTtZQUdsQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ0wsSUFBSSxFQUFFLENBQUE7WUFDVixDQUFDLENBQUMsQ0FBQTtRQUdOLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7WUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFJTixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLElBQUk7UUFFakMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN0QixHQUFHLEVBQUUsSUFBSTthQUNaLEVBQUU7Z0JBQ0ssR0FBRyxFQUFFLEtBQUs7YUFDYixFQUFFO2dCQUNDLEdBQUcsRUFBRSxLQUFLO2FBQ2IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6RCxJQUFJLEVBQUUsQ0FBQztRQUVYLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7WUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFHVixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLElBQUk7UUFDakMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN0QixHQUFHLEVBQUUsSUFBSTtnQkFDVCxHQUFHLEVBQUUsS0FBSzthQUNiLEVBQUU7Z0JBQ0ssR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsR0FBRyxFQUFFLEtBQUs7YUFDYixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO1lBQ1AsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pELElBQUksRUFBRSxDQUFDO1FBRVgsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRztZQUNULElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNwQixDQUFDLENBQUMsQ0FBQTtJQUlWLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFLFVBQVUsSUFBSTtRQUNwQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNuQixJQUFJLEVBQUUsQ0FBQztRQUVYLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7WUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFTixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLElBQUk7UUFFakMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUVuQixJQUFJLEVBQUUsQ0FBQztRQUVYLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7WUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFTixDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxDQUFBIiwiZmlsZSI6InRlc3QvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb3VjaE5vZGUgZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0ICogYXMgY2hhaSBmcm9tIFwiY2hhaVwiO1xuXG5jb25zdCBzcGF3blBvdWNoZGJTZXJ2ZXIgPSByZXF1aXJlKCdzcGF3bi1wb3VjaGRiLXNlcnZlcicpO1xuXG5jb25zdCBleHBlY3QgPSBjaGFpLmV4cGVjdDtcblxuY29uc3QgdG1Qb3J0ID0gMzQzNDtcblxuY29uc3QgY291Y2hEQkRhdGFiYXNlID0gXCJodHRwOi8vbG9jYWxob3N0OlwiICsgdG1Qb3J0ICsgXCIvXCIgKyBuZXcgRGF0ZSgpLmdldFRpbWU7XG5cbmxldCBDb3VjaE1hbmFnZXI7XG5cbmJlZm9yZShmdW5jdGlvbiAoZG9uZSkge1xuICAgIHRoaXMudGltZW91dCgxMDAwMCk7XG4gICAgc3Bhd25Qb3VjaGRiU2VydmVyKFxuICAgICAgICB7XG4gICAgICAgICAgICBwb3J0OiB0bVBvcnQsXG4gICAgICAgICAgICBiYWNrZW5kOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgIGZpbGU6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbG9nOiB7XG4gICAgICAgICAgICAgICAgZmlsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgbGV2ZWw6ICdpbmZvJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IsIHNlcnZlcikge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBDb3VjaE1hbmFnZXIgPSBuZXcgQ291Y2hOb2RlKGNvdWNoREJEYXRhYmFzZSk7XG5cbiAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxufSk7XG5cbmRlc2NyaWJlKFwiZGIgdGVzdGluZ1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IG87XG4gICAgaXQoXCJjcmVhdGUgZGJcIiwgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgQ291Y2hNYW5hZ2VyLmNyZWF0ZURCKCkudGhlbigoZCkgPT4ge1xuXG4gICAgICAgICAgICBleHBlY3QoZCkudG8uYmUub2s7XG4gICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgZG9uZShFcnJvcihlcnIpKVxuICAgICAgICB9KVxuXG5cblxuICAgIH0pO1xuICAgIFxuICAgIGl0KFwiY3JlYXRlIGEgZG9jdW1lbnRcIiwgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgQ291Y2hNYW5hZ2VyLmNyZWF0ZSh7XG4gICAgICAgICAgICBfaWQ6ICdmZidcbiAgICAgICAgfSkudGhlbigoZCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KGQpLnRvLmJlLm9rO1xuICAgICAgICAgICAgZXhwZWN0KGQpLnRvLmJlLmFuKFwiT2JqZWN0XCIpLnRvLmhhdmUucHJvcGVydHkoXCJfaWRcIik7XG4gICAgICAgICAgICBleHBlY3QoZCkudG8uaGF2ZS5wcm9wZXJ0eShcIl9yZXZcIik7XG4gICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgZG9uZShFcnJvcihlcnIpKVxuICAgICAgICB9KVxuXG5cblxuICAgIH0pO1xuICAgIGl0KFwiZmluZCBhIGRvY3VtZW50XCIsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgIENvdWNoTWFuYWdlci5maW5kKCdmZicpLnRoZW4oKGQpID0+IHtcbiAgICAgICAgICAgIG8gPSBkO1xuICAgICAgICAgICAgZXhwZWN0KGQpLnRvLmJlLmFuKFwiT2JqZWN0XCIpLnRvLmhhdmUucHJvcGVydHkoXCJfaWRcIik7XG4gICAgICAgICAgICBleHBlY3QoZCkudG8uaGF2ZS5wcm9wZXJ0eShcIl9yZXZcIik7XG5cbiAgICAgICAgICAgIGV4cGVjdChkKS50by5iZS5vaztcbiAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBkb25lKEVycm9yKGVycikpXG4gICAgICAgIH0pXG5cblxuXG4gICAgfSk7XG5cblxuICAgIGl0KFwidXBkYXRlIGEgZG9jdW1lbnRcIiwgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgby51cCA9IFwidXBkYXRlZFwiO1xuICAgICAgICBDb3VjaE1hbmFnZXIudXBkYXRlKG8pLnRoZW4oKGQpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChkKS50by5iZS5vaztcbiAgICAgICAgICAgIGV4cGVjdChkKS50by5iZS5hbihcIk9iamVjdFwiKS50by5oYXZlLnByb3BlcnR5KFwidXBcIik7XG4gICAgICAgICAgICBleHBlY3QoZCkudG8uaGF2ZS5wcm9wZXJ0eShcIl9pZFwiKTtcbiAgICAgICAgICAgIGV4cGVjdChkKS50by5oYXZlLnByb3BlcnR5KFwiX3JldlwiKTtcbiAgICAgICAgICAgIGV4cGVjdChkLnVwKS50by5iZS5lcShcInVwZGF0ZWRcIik7XG4gICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgZG9uZShFcnJvcihlcnIpKVxuICAgICAgICB9KVxuXG4gICAgfSk7XG5cbiAgICBpdChcImRlbGV0ZSBhIGRvY3VtZW50XCIsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgIENvdWNoTWFuYWdlci5kZWxldGUoJ2ZmJykudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgIENvdWNoTWFuYWdlci5maW5kKCdmZicpLnRoZW4oKGQpID0+IHtcbiAgICAgICAgICAgICAgICBkb25lKEVycm9yKFwiZmYgc3RpbGwgZXhpc3RzXCIpKVxuXG5cbiAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICBkb25lKClcbiAgICAgICAgICAgIH0pXG5cblxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBkb25lKEVycm9yKGVycikpXG4gICAgICAgIH0pXG5cblxuXG4gICAgfSk7XG5cbiAgICBpdChcImNyZWF0ZSBkb2N1bWVudHNcIiwgZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICBDb3VjaE1hbmFnZXIuY3JlYXRlX21vcmUoW3tcbiAgICAgICAgICAgIF9pZDogJ3p6J1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgX2lkOiAnZmZzJ1xuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIF9pZDogJ2ZmZydcbiAgICAgICAgICAgIH1dKS50aGVuKChkKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGQpLnRvLmJlLm9rO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkKS50by5iZS5hbihcIkFycmF5XCIpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkWzBdKS50by5iZS5hbihcIk9iamVjdFwiKS50by5oYXZlLnByb3BlcnR5KFwiX2lkXCIpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChkWzBdKS50by5iZS5hbihcIk9iamVjdFwiKS50by5oYXZlLnByb3BlcnR5KFwiX3JldlwiKTtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBkb25lKEVycm9yKGVycikpXG4gICAgICAgICAgICB9KVxuXG5cbiAgICB9KTtcblxuICAgIGl0KFwidXBkYXRlIGRvY3VtZW50c1wiLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICBDb3VjaE1hbmFnZXIudXBkYXRlX21vcmUoW3tcbiAgICAgICAgICAgIF9pZDogJ3p6JyxcbiAgICAgICAgICAgIHVwcDogJ3VwMidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIF9pZDogJ2ZmcycsXG4gICAgICAgICAgICAgICAgdXBwOiAndXAyJ1xuICAgICAgICAgICAgfV0pLnRoZW4oKGQpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3QoZCkudG8uYmUub2s7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGQpLnRvLmJlLmFuKFwiQXJyYXlcIik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRbMF0pLnRvLmJlLmFuKFwiT2JqZWN0XCIpLnRvLmhhdmUucHJvcGVydHkoXCJfaWRcIik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGRbMF0pLnRvLmJlLmFuKFwiT2JqZWN0XCIpLnRvLmhhdmUucHJvcGVydHkoXCJfcmV2XCIpO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGRvbmUoRXJyb3IoZXJyKSlcbiAgICAgICAgICAgIH0pXG5cblxuXG4gICAgfSk7XG5cbiAgICBpdChcInNlYXJjaCBiZXR3ZWVuIGtleXNcIiwgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgQ291Y2hNYW5hZ2VyLmJldHdlZW5LZXlzKCdmZmEnLCdmZnonKS50aGVuKChkKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoZCkudG8uYmUub2s7XG4gICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgZG9uZShFcnJvcihlcnIpKVxuICAgICAgICB9KVxuXG4gICAgfSk7XG5cbiAgICBpdChcInJlbW92ZSBkb2N1bWVudHNcIiwgZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICBDb3VjaE1hbmFnZXIuZGVsZXRlX21vcmUoWyd6eicsICdmZnMnLCAnZmZnJ10pLnRoZW4oKGQpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChkKS50by5iZS5vaztcblxuICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIGRvbmUoRXJyb3IoZXJyKSlcbiAgICAgICAgfSlcblxuICAgIH0pO1xuXG59KVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
