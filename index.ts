import * as Promise from "bluebird";
import * as superagent from "superagent";
import * as async from "async";

interface IAuth {
    user: string;
    password: string;
}



export default class couchNode {

    couchdb: string;
    auth: IAuth; // to be removed for private credentials

    constructor(couch: string, auth?: IAuth) {

        this.couchdb = couch;
        if (auth) this.auth = auth;

    }



    createDB(): Promise<boolean> {
        const _this = this
        return new Promise<boolean>((resolve, reject) => {



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
    /*
        createDBS(dbs: string[]): Promise<boolean> {
            const _this = this;
            return new Promise<boolean>((resolve, reject) => {
                async.eachSeries(dbs, (db, cb) => {
                    _this.create(db).then(() => {
                        cb()
                    }).catch((err) => {
                        cb(err)
                    })
                }, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(true)
                    }
                })
            })
        }
    */


    create(obj: any): Promise<any> {
        const _this = this;
        return new Promise<any>((resolve, reject) => {
            if (_this.auth) {
                superagent.put(_this.couchdb + "/" + obj._id).set('Content-Type', 'application/json').send(JSON.stringify(obj)).auth(_this.auth.user, _this.auth.password).end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        obj._rev = JSON.parse(res.text).rev;
                        resolve(obj);
                    }
                })
            } else {
                superagent.put(_this.couchdb + "/" + obj._id).set('Content-Type', 'application/json').send(JSON.stringify(obj)).end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        obj._rev = JSON.parse(res.text).rev;
                        resolve(obj);
                    }
                })
            }

        })



    }

    create_more(obj: any) {
        const results = [];
        const _this = this;
        return new Promise<any>((resolve, reject) => {

            async.eachSeries(obj, (r, cb) => {
                _this.create(r).then((result) => {
                    results.push(result);
                    cb()
                }).catch((err) => {
                    cb(err)
                })

            }, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)

                }
            })
        })
    }
    update_more(obj: any) {
        const results = [];
        const _this = this;
        return new Promise<any>((resolve, reject) => {

            async.eachSeries(obj, (r, cb) => {
                _this.update(r).then((result) => {
                    results.push(result);
                    cb()
                }).catch((err) => {
                    cb(err)
                })

            }, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)

                }
            })
        })
    }
    delete_more(ids: string[]) {
        const results = [];
        const _this = this;
        return new Promise<any>((resolve, reject) => {

            async.eachSeries(ids, (r, cb) => {
                _this.delete(r).then((result) => {
                    results.push(result);
                    cb()
                }).catch((err) => {
                    cb(err)
                })

            }, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)

                }
            })
        })
    }
    update(obj): Promise<any> {

        const _this = this;

        return new Promise((resolve, reject) => {

            _this.find(obj._id).then(function (o: any) {
                obj._rev = o._rev;
                _this.create(obj).then(function (c: any) {
                    resolve(obj);
                }).catch(function (err) {
                    reject(err);
                })

            })

        })


    }

    find(_id: string, _rev?: string): Promise<any> {
        const _this = this;

        return new Promise<any>((resolve, reject) => {

            if (_this.auth) {
                superagent.get(_this.couchdb + "/" + _id).set('Content-Type', 'application/json').auth(_this.auth.user, _this.auth.password).end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(res.text));
                    }
                })
            } else {
                superagent.get(_this.couchdb + "/" + _id).set('Content-Type', 'application/json').end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {


                        resolve(JSON.parse(res.text));
                    }
                })
            }



        })

    }


    delete(id: string): Promise<boolean> {
        const _this = this;

        return new Promise<boolean>((resolve, reject) => {

            _this.find(id).then((a) => {

                a._deleted = true;

                _this.update(a).then(() => {
                    resolve(true)
                }).catch((err) => {
                    reject(err)
                })
            }).catch((err) => {
                reject(err)
            })


        })
    }

    finder(params: string, options?: { notIncludeDocs?: boolean }): Promise<any[]> {
        const _this = this;

        return new Promise<any[]>((resolve, reject) => {

            if (params[0] !== '?') {
                reject('params must starts with?')
            } else {
                if (params.split('include_docs').length < 2) {
                    if (!options || !options.notIncludeDocs) params = params + '&include_docs=true'
                }


                if (_this.auth) {
                    superagent.get(_this.couchdb + "/_all_docs" + params).auth(_this.auth.user, _this.auth.password).end((err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            const ob = JSON.parse(res.text).rows;
                            const objects = [];
                            for (let i = 0; i < ob.length; i++) {
                                objects.push(ob[i].doc)
                            }

                            resolve(objects);
                        }
                    })
                } else {
                    superagent.get(_this.couchdb + "/_all_docs" + params).end((err, res) => {
                        if (err) {
                            reject(err);
                        } else {

                            const ob = JSON.parse(res.text).rows;
                            const objects = [];
                            for (let i = 0; i < ob.length; i++) {
                                objects.push(ob[i].doc)
                            }

                            resolve(objects);

                        }
                    })
                }
            }

        })
    }

    betweenKeys(start, stop, options?: { notIncludeDocs?: boolean }): Promise<any[]> {
        const _this = this;

        return new Promise<any[]>((resolve, reject) => {

            const params = '?startkey="' + start + '"&endkey="' + stop+'"';

            _this.finder(params, options).then((a) => {
                resolve(a)
            }).catch((err) => {
                reject(err)
            })

        })

    }
    betweenIDKeys(start, stop, options?: { notIncludeDocs?: boolean }): Promise<any[]> {
        const _this = this;

        return new Promise<any[]>((resolve, reject) => {

            const params = '?startkey_docid="' + start + '"&endkey_docid="' + stop+'"';

            _this.finder(params, options).then((a) => {
                resolve(a)
            }).catch((err) => {
                reject(err)
            })

        })

    }
        startID(start, options?: { notIncludeDocs?: boolean }): Promise<any[]> {
        const _this = this;

        return new Promise<any[]>((resolve, reject) => {

            const params = '?startkey_docid="' + start+'"';

            _this.finder(params, options).then((a) => {
                resolve(a)
            }).catch((err) => {
                reject(err)
            })

        })

    }
}



