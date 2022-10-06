import {Request, Response} from 'express';
import databaseAccess from '../../../../database/databaseAccess.js';
import {logger} from '../../../../index.js';

class UpdateRoutes {
    async process(req: Request, res: Response) {
        switch (req.body?.routing?.type) {
            case "file":
                await file.process(req, res);
                break;
            case "user":
                await user.process(req, res);
                break;
            default:
                res.status(400).send("invalid routing type");
                break;
        }
    }
}

class FileUpdates {
    constructor() {}
    async process(req: Request, res: Response) {
        switch (req.body?.routing?.action) {
            case "privacy":
                await this.privacy(req, res);
                break;
            default:
                res.status(400).send("invalid routing action");
                break;
        }
    }

    async privacy(req: Request, res: Response) {
        if (typeof req.body?.payload?.fileId === 'number' && req.body?.payload?.value === 1 || req.body?.payload?.value === 0) {
            await databaseAccess.update.upload({fileId: req.body.payload.fileId, private: req.body.payload.value}).then(() => {
                res.status(200).send("success");
            }).catch((err) => {
                logger.error('API error:' + err);
                res.status(500).send("an error occurred; terminating request");
            });
        } else {res.status(400).send("invalid payload");}
    }
}

const file = new FileUpdates();

class UserUpdates {
    constructor() {}
    async process(req: Request, res: Response) {
        switch (req.body?.routing?.action) {
            default:
                res.status(400).send("invalid routing action");
                break;
        }
    }
}

const user = new UserUpdates();

export default UpdateRoutes;