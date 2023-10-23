import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { FakeReportService } from './fake-report.service.js';

export const fakeReportController = express();

fakeReportController.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const blacklistService = new FakeReportService(req.dbClient);
		const blacklist = await blacklistService.getList(req.userId);

		res.status(200).json({ data: blacklist });
		next();
	} catch (error: any) {
		console.error(`Error while fetching fake report list: ${error}.`);
		error.message = `Error while fetching fake report list.`;
		next(error);
	}
});

fakeReportController.post("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const targetProfileId = req.body.targetProfileId;
		const blacklistService = new FakeReportService(req.dbClient);
		const blacklistedUser = await blacklistService.addElement(req.userId, targetProfileId);

		res.status(201).json({ 
			data: blacklistedUser,
			message: "Report successfully sent."
		});
		next();
	} catch (error: any) {
		console.error(`Error while reporting profile: ${error}.`);
		error.message = `Error while reporting profile.`;
		next(error);
	}
});

fakeReportController.delete("/:targetProfileId", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const targetProfileId = req.params.targetProfileId;
		const blacklistService = new FakeReportService(req.dbClient);
		await blacklistService.deleteElement(req.userId, targetProfileId);

		res.status(200).json({ 
			message: "Report successfully cancelled." 
		});
		next();
	} catch (error: any) {
		console.error(`Error while deleting report: ${error}.`);
		error.message = `Error while deleting report.`;
		next(error);
	}
});


