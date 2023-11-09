import { PoolClient } from "pg";

export class ModelBase {
	table: string;
	dbClient: PoolClient

	constructor(table: string, dbClient: PoolClient) {
		this.table = table;
		this.dbClient = dbClient;
	}

	async findById(id: string, select?: string[]) {
		const query = `SELECT ${this.getSelectQuery(select)} FROM "${this.table}" WHERE id = $1`;
		const values = [id];
		const result = await this.dbClient.query(query, values);
		return result.rows[0];
	}

	async findMany(where: { [key: string]: any }[], select?: string[]) {
		const query = `SELECT ${this.getSelectQuery(select)} FROM "${this.table}" ${this.getWhereQuery(where)}`;
		const values = where.flatMap(orObject => Object.values(orObject));
		const result = await this.dbClient.query(query, values);
		return result.rows;
	}

	async create(createdData: { [key: string]: any }, select?: string[]) {
		const query = `INSERT INTO "${this.table}" ${this.getCreateQuery(createdData)} RETURNING ${this.getSelectQuery(select)}`;
		const values = Object.values(createdData);
		const result = await this.dbClient.query(query, values);
		return result.rows[0];
	}

	async createMany(createdData: { [ key: string ]: any }[], select?: string[]) {
		if (!Object.keys(createdData).length) return [];
        const query = `INSERT INTO "${this.table}" ${this.getCreateManyQuery(createdData)} RETURNING ${this.getSelectQuery(select)}`;
		const values = createdData.flatMap(object => Object.values(object));
        const result = await this.dbClient.query(query, values);
        return result.rows;
	}

	async updateById(id: string, updatedData: { [key: string]: any }, select?: string[]) {
		const query = `UPDATE "${this.table}" SET ${this.getUpdateQuery(updatedData, 1)} WHERE id = $1 RETURNING ${this.getSelectQuery(select)}`;
		const values = [id, ...Object.values(updatedData)];
		const result = await this.dbClient.query(query, values);
		return result.rows[0];
	}

	async update(where: { [key: string]: any }[], updatedData: { [key: string]: any }, select?: string[]) {
		updatedData = Object.fromEntries(Object.entries(updatedData).filter(([key, value]) => value !== undefined));
		const query = `UPDATE "${this.table}" SET ${this.getUpdateQuery(updatedData)} ${this.getWhereQuery(where, Object.keys(updatedData).length)} RETURNING ${this.getSelectQuery(select)}`;
		const values = [...Object.values(updatedData), ...where.flatMap(orObject => Object.values(orObject))];
		const result = await this.dbClient.query(query, values);
		return result.rows;
	}

	async deleteById(id: string, select?: string[]) {
		const query = `DELETE FROM "${this.table}" WHERE id = $1 RETURNING ${this.getSelectQuery(select)}`;
		const values = [id];
		const result = await this.dbClient.query(query, values);
		return result.rows[0];
	}

	async delete(where: { [key: string]: any }[], select?: string[]) {
		const query = `DELETE FROM "${this.table}" ${this.getWhereQuery(where)} RETURNING ${this.getSelectQuery(select)}`;
		const values = where.flatMap(orObject => Object.values(orObject));
		const result = await this.dbClient.query(query, values);
		return result.rows;
	}

	private getSelectQuery(select?: string[]) {
		return select?.length ?
			select.reduce((query, arg) => query += query.length ? `, ${arg}` : arg, "")
			: "*";
	}

	private getCreateQuery(data: { [key: string]: any }) {
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

	private getCreateManyQuery(data: { [key: string]: any }[]) {
		let createQuery = "(";

		for (const arg in data[0])
			createQuery += (createQuery.length > 2 ? `, ` : "") + arg;
		createQuery += ") VALUES "
		let index = 1;
		for (let i = 0; i < data.length; i++) {
			createQuery += "(";
			for (const arg in data[i]) {
				createQuery += (createQuery[createQuery.length - 1] === '(' ? "" : ", ");
				createQuery += `\$${index}`;
				index++;
			}
			createQuery += ")";
			if (i < data.length - 1)
				createQuery += ", ";
		}
		return createQuery;
	}

	private getUpdateQuery(data: { [key: string]: any }, startIndex = 0) {
		let updateQuery = "";

		for (const [index, key] of Object.keys(data).entries()) {
			console.log(key)
			updateQuery += updateQuery.length ? ", " : "";
			updateQuery += `${key} = $${index + 1 + startIndex}`;
		}
		return updateQuery;
	}

	private getWhereQuery(data: { [key: string]: any }[], startIndex = 0) {
		let whereQuery = "";
		let index = 1;

		for (const orObject of data) {
			const keyArray = Object.keys(orObject);
			if (!keyArray.length) continue;

			whereQuery += whereQuery.length ? " OR (" : '(';
			for (const key of keyArray) {
				whereQuery += whereQuery[whereQuery.length - 1] === '(' ? "" : " AND ";
				whereQuery += `${key} = $${index + startIndex}`;
				index++;
			}
			whereQuery += ')';
		}
		return whereQuery.length ? `WHERE ${whereQuery}` : "";
	}
}
