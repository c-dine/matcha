import express from 'express';
export const authController = express();
/*------------- GET -------------*/
authController.get("/", async (req, res) => {
    res.status(200).json('OKAY !');
});
