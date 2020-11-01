import pg from 'pg';

const {Pool, Client} = pg;

export default class Server {

    constructor() {
        //instance the database connection
        this.databasePool = new Pool();
    }

    async query(queryString) {
        return this.databasePool.query(queryString);
    }

    async finalize() {
        await this.databasePool.end();
    }

};
