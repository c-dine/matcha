import { PoolClient } from "pg";
import { InteractionsService } from "../interactions.service.js";

export class FakeReportService extends InteractionsService {

	constructor(dbClient: PoolClient) {
		super("fake_report", dbClient);
	}

}
