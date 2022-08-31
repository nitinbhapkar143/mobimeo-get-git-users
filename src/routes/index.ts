import express, { query } from "express";
import IUserRequest from "../interfaces/userRequest";
import userController from "../controllers/user.controller";
import { HtppCodes } from "../constants/responseCodes";
import { logger } from "../config/logger";

const router = express.Router();

router.get("/users", async (req : express.Request<{}, {}, {}, IUserRequest>, res : express.Response) => {
    try {
        const { query } = req;
        if(!query.language) return res.status(HtppCodes.BAD_REQUEST).send({ message : "Language parameter is missing."});
        const controller = new userController();
        const users = await controller.getUsers(query);
        return res.status(HtppCodes.OK).send(users);
    } catch (error) {
        logger.error(
            `Error at get users api - ${error}`,
        );
        return res.status(HtppCodes.ERROR).send({ message : "Something went wrong. Try again later."});
    }
});


export default router;