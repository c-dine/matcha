import express, { NextFunction } from 'express';
import { Response, Request } from 'express';
import { FakeReportService } from './fake-report.service.js';

export const fakeReportController = express();

fakeReportController.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const fakeReport = new FakeReportService(req.dbClient);
		const blacklist = await fakeReport.getList(req.userId);

		res.status(200).json({ data: blacklist });
		next();
	} catch (error: any) {
		error.message = `Error while fetching fake report list.`;
		next(error);
	}
});

fakeReportController.post("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const targetUserId = req.body.targetUserId;
		const fakeReport = new FakeReportService(req.dbClient);
		const blacklistedUser = await fakeReport.addElement(req.userId, targetUserId);

		res.status(201).json({ 
			data: blacklistedUser,
			message: "Report successfully sent."
		});
		next();
	} catch (error: any) {
		error.message = `Error while reporting profile.`;
		next(error);
	}
});

fakeReportController.delete("/:targetUserId", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const targetUserId = req.params.targetUserId;
		const fakeReport = new FakeReportService(req.dbClient);
		await fakeReport.deleteElement(req.userId, targetUserId);

		res.status(200).json({ 
			message: "Report successfully cancelled." 
		});
		next();
	} catch (error: any) {
		error.message = `Error while deleting report.`;
		next(error);
	}
});


