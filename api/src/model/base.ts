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

	async findById(id: string, select?: string[]) {
		const query = `SELECT ${this.getSelectQuery(select)} FROM "${this.table}" WHERE id = $1`;
		const values = [id];
		const result = await this.dbClient.query(query, values);
		return result.rows[0];
    }
	
    async findMany(where: { [ key: string ]: any }, select?: string[]) {
		const query = `SELECT ${this.getSelectQuery(select)} FROM "${this.table}" WHERE ${this.getWhereQuery(where)}`;
		const values = Object.values(where);
		const result = await this.dbClient.query(query, values);
		return result.rows;
    }

    async create(createdData: { [ key: string ]: any }, select?: string[]) {
        const query = `INSERT INTO "${this.table}" ${this.getCreateQuery(createdData)} RETURNING ${this.getSelectQuery(select)}`;
        const values = Object.values(createdData);
        const result = await this.dbClient.query(query, values);
        return result.rows[0];
      }
    
    async updateById(id: string, updatedData: { [ key: string ]: any }, select?: string[]) {
        const query = `UPDATE "${this.table}" SET ${this.getUpdateQuery(updatedData)} WHERE id = $1 RETURNING ${this.getSelectQuery(select)}`;
        const values = [id, ...Object.values(updatedData)];
        const result = await this.dbClient.query(query, values);
        return result.rows[0];
    }
    
    async delete(id: string, select?: string[]) {
        const query = `DELETE FROM "${this.table}" WHERE id = $1 RETURNING ${this.getSelectQuery(select)}`;
        const values = [id];
        const result = await this.dbClient.query(query, values);
        return result.rows[0];
    }

    private getCreateQuery(data: { [ key: string ]: any }) {
        let createQuery = "(";

        for (const arg in data)
            createQuery += (createQuery.length > 2 ? `, ` : "") + arg;
        createQuery += ") VALUES (";
        for (let i = 1; i <= Object.keys(data).length; i++) {
            createQuery += (createQuery[createQuery.length - 1] === '(' ? "" : ", ");
            createQuery += `\$${i}`;
        }
        createQuery += ")";
        return createQuery;
    }

    private getUpdateQuery(data: { [ key: string ]: any }) {
        let updateQuery = "";

        for (const [index, key] of Object.keys(data).entries()) {
            updateQuery += updateQuery.length ? ", " : "";
            updateQuery += `${key} = $${index + 2}`;
        }
        return updateQuery;
    }
    
    private getWhereQuery(data: { [ key: string ]: any }) {
        let whereQuery = "";

        for (const [index, key] of Object.keys(data).entries()) {
            whereQuery += whereQuery.length ? " AND " : "";
            whereQuery += `${key} = $${index + 1}`;
        }
        return whereQuery;
    }
}
