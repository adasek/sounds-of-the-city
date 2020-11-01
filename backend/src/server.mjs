import pkg from 'pg';
const { Pool, Client } = pkg;

export default class Server {

    constructor() {
        //instance the database connection
                this.databasePool = new Pool();
    }

    async databaseQuery(queryString){
        return this.databasePool.query('SELECT NOW()');
    }

    async finalize() {
        await this.databasePool.end();
    }

};
