import {Request, Response} from 'express';
import databaseAccess from '../../../../database/databaseAccess.js';
import { UserSessionInterface } from '../../../../helpers/sessionInterfaces.js';
import {logger} from '../../../../index.js';
import { RenderUser } from '../render/user.js';

class UpdateFileRoutes {
    async process(req: Request, res: Response) {
        switch (req.body?.action) {
            case "private":
                await updatePrivate(req, res);
                break;
            default:
                res.status(400).send("invalid routing type");
                break;
        }
    }
}

async function updatePrivate(req: Request, res: Response) {
    if (req.body?.fileId == undefined || req.body?.fileId == '' || !(req.body?.value === "true" || req.body?.value === "false")) {
        RenderUser.history(req, res, "An error occured while updating file privacy");
        return;
    }

    // Should replace with tokens when implemented
    let userIdOfFileOwner = await databaseAccess.getInfo.getUserIdFromFileId(req.body.fileId);

    if ((req.session as UserSessionInterface).userId != userIdOfFileOwner) {
        res.status(401).send("You do not have permission to update this file");
        return;
    }

    let privateSetting = req.body.value === "true" ? 1 : 0;
    await databaseAccess.update.file({fileId: req.body.fileId, private: privateSetting}).then(() => {
        RenderUser.history(req, res, "Successfully updated file privacy");
    }).catch((err) => {
        logger.error('API error:' + err);
        RenderUser.history(req, res, "An error occured while updating file privacy");
    });
}

export default UpdateFileRoutes;