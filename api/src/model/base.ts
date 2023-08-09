import { PoolClient } from "pg";

export class ModelBase {
	table: string;
    dbClient: PoolClient

	constructor (table: string, dbClient: PoolClient) {
		this.table = table;
        this.dbClient = dbClient;
	}

    private getSelectQuery(select?: string[]) {
        return select?.length ?
            select.reduce((query, arg) => query += query.length ? `, ${arg}` : arg, "")
            : "*";
    }

    private getCreateQuery(data: { [ key: string ]: any }) {
        let createQuery = "(";

        for (const arg in data)
            createQuery += (createQuery.length > 2 ? `, ` : "") + arg;
        createQuery += ") VALUES (";
        for (let i = 1; i <= data.length; i++)
            createQuery += (createQuery[createQuery.length - 1] === '(' ? "" : ", ")
                        + `$${i}`;
        createQuery += ")";
        return createQuery;
    }

    private getUpdateQuery(data: { [ key: string ]: any }) {
        let updateQuery = "";

        for (const [index, key] of Object.keys(data))
            updateQuery += updateQuery.length ? ", " : ""
                        + `${key} = $${index}`;
        return updateQuery;
    }

	async findById(id: string, select?: string[]) {
		const query = `SELECT ${this.getSelectQuery(select)} FROM ${this.table} WHERE id = $1`;
		const values = [id];
		const result = await this.dbClient.query(query, values);
		return result.rows[0];
    }

    async create(createdData: { [ key: string ]: any }, select?: string[]) {
        const query = `INSERT INTO ${this.table} ${this.getCreateQuery(createdData)} RETURNING ${this.getSelectQuery(select)}`;
        const values = Object.values(createdData);
        const result = await this.dbClient.query(query, values);
        return result.rows[0];
      }
    
    async update(id: string, updatedData: { [ key: string ]: any }, select?: string[]) {
        const query = `UPDATE ${this.table} SET ${this.getUpdateQuery(updatedData)} WHERE id = $4 RETURNING ${this.getSelectQuery(select)}`;
        const values = [...Object.values(updatedData), id];
        const result = await this.dbClient.query(query, values);
        return result.rows[0];
    }
    
    async delete(id: string, select?: string[]) {
        const query = `DELETE FROM ${this.table} WHERE id = $1 RETURNING ${this.getSelectQuery(select)}`;
        const values = [id];
        const result = await this.dbClient.query(query, values);
        return result.rows[0];
    }
}
