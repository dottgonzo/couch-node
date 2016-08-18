import * as Promise from "bluebird";

import * as superagent from "superagent";

interface IAuth {
    user: string;
    password: string;
}



export default class couchNode {

    couchdb: string;
    auth: IAuth;

    constructor(couch: string, auth?: IAuth) {

        this.couchdb = couch;
        if (auth) this.auth = auth;

    }



    createDB(): Promise<boolean> {
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
    create(obj: any): Promise<boolean> {
        const _this = this;
        return new Promise<boolean>(function (resolve, reject) {

            if (_this.auth) {
                superagent.put(_this.couchdb + "/" + obj._id).set('Content-Type', 'application/json').send(JSON.stringify(obj)).auth(_this.auth.user, _this.auth.password).end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.body);
                    }
                })
            } else {
                superagent.put(_this.couchdb + "/" + obj._id).set('Content-Type', 'application/json').send(JSON.stringify(obj)).end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.body);
                    }
                })
            }

        })



    }

    update(obj): Promise<boolean> {

        const _this = this;

        return new Promise<boolean>(function (resolve, reject) {

            _this.find(obj._id).then(function (o: any) {

                obj._rev = o._rev;

                _this.create(obj).then(function () {
                    resolve(true);
                }).catch(function (err) {
                    reject(err);
                })

            })

        })


    }

    find(_id) {
        const _this = this;

        return new Promise(function (resolve, reject) {



            if (_this.auth) {
                superagent.get(_this.couchdb + "/" + _id).auth(_this.auth.user, _this.auth.password).end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.body);
                    }
                })
            } else {
                superagent.get(_this.couchdb + "/" + _id).end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.body);
                    }
                })
            }



        })

    }

}



