import * as Promise from "bluebird";

import * as superagent from "superagent";

interface IAuth {
    user: string;
    password: string;
}





function find(_id: string, couchdb: string, auth?: IAuth) {

    return new Promise(function (resolve, reject) {



        if (auth) {
            superagent.get(couchdb + "/" + _id).auth(auth.user, auth.password).end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.body);
                }
            })
        } else {
            superagent.get(couchdb + "/" + _id).end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.body);
                }
            })
        }



    })

}

function update(obj, couchdb: string, auth?: IAuth) {

    return new Promise<boolean>(function (resolve, reject) {

        find(obj._id, couchdb, auth).then(function (o: any) {

            obj._rev = o._rev;

            create(obj, couchdb, auth).then(function () {
                resolve(true);
            }).catch(function (err) {
                reject(err);
            })

        })

    })

}

function create(obj, couchdb: string, auth?: IAuth) {

    return new Promise<boolean>(function (resolve, reject) {

        if (auth) {
            superagent.put(couchdb + "/" + obj._id).set('Content-Type', 'application/json').send(JSON.stringify(obj)).auth(auth.user, auth.password).end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.body);
                }
            })
        } else {
            superagent.put(couchdb + "/" + obj._id).set('Content-Type', 'application/json').send(JSON.stringify(obj)).end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.body);
                }
            })
        }

    })

}


export default class {

    couchdb: string;
    auth: IAuth;

    constructor(couch: string, auth?: IAuth) {

        this.couchdb = couch;
        if (auth) this.auth = auth;

    }



    createDB() {
        const _this = this
        return new Promise<boolean>(function (resolve, reject) {



            if (_this.auth) {
                superagent.get(_this.couchdb).auth(_this.auth.user, _this.auth.password).end((err, res) => {
                    if (err) {
                        if (err.status === 404) {
                            superagent.put(_this.couchdb).auth(_this.auth.user, _this.auth.password).end((err, res) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(res.body);
                                }
                            })

                        } else {
                            reject(err);
                        }
                    } else {
                        resolve(res.body);
                    }
                })
            } else {
                superagent.get(_this.couchdb).end((err, res) => {
                    if (err) {
                        if (err.status === 404) {
                            superagent.put(_this.couchdb).end((err, res) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(res.body);
                                }
                            })

                        } else {
                            reject(err);
                        }
                    } else {
                        resolve(res.body);
                    }
                })
            }
        })
    }
    create(obj:{any}) {
        return create(obj, this.couchdb);
    }

    update(obj) {
        return update(obj, this.couchdb);
    }

    find(_id) {
        return find(_id, this.couchdb);
    }

}



