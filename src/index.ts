import 'dotenv/config'
import express, { Application } from "express";
import morgan from "morgan";
import { logger } from './config/logger';
import Router from "./routes";
import { HtppCodes } from './constants/responseCodes';

const PORT = process.env.PORT || 4000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));

app.use('/git', Router);

app.get('/health', (_req : express.Request, res : express.Response) => {
    return res.status(HtppCodes.OK).send({status : true, message : "OK"});
});

app.listen(PORT, () => {
    logger.info(
        `[server]: ⚡️Server is running at http://localhost:${PORT}`,
    );
});