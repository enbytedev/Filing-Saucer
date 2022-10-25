import { Request, Response } from 'express';
import config from "../../../../setup/config.js";
import databaseAccess from '../../../../database/databaseAccess.js';
import path from "path";
import { UserSessionInterface } from '../../../../helpers/sessionInterfaces.js';

class ShareRoutes {
    async share(req: Request, res: Response) {
        let filePath = await getFilePath(req.params.fileId as string);

        if (typeof req.params.fileId !== "string" || filePath.length < 1 || !(await databaseAccess.checks.isFileInDatabase(req.params.fileId))) {
            res.render('basic/notFound.ejs');
            return;
        }

        if (await databaseAccess.checks.isFilePrivate(req.params.fileId)) {
            if ((req.session as UserSessionInterface).userId != await databaseAccess.getInfo.getUserIdFromFileId(req.params.fileId)) {
                res.render('share/private.ejs');
                return;
            }
        }

        if (req.query.action == "download" || req.query.action == "1") {
            res.download(path.join(config.uploadDirectory, filePath));
            return;
        }
        if (req.query.action == "preview" || req.query.action == "2") {
            res.sendFile(filePath, { root: path.join(config.uploadDirectory) });
            return;
        }

        let userName = await databaseAccess.getInfo.getUserNameFromFileId(req.params.fileId);
        let fileName = await databaseAccess.getInfo.getFileNameFromFileId(req.params.fileId);

        res.render('share/share.ejs', { fileId: req.params.fileId, userName: userName, fileName: fileName, enablePreview: isPreviewable(fileName) });
    }
}

async function getFilePath(fileId: string) {
    let userId = await databaseAccess.getInfo.getUserIdFromFileId(fileId);
    let fileName = await databaseAccess.getInfo.getFileNameFromFileId(fileId);

    if (typeof userId == "string" || typeof fileName == "string") {
    return path.join(userId.toString(), fileName);
    } else {
        return "";
    }
}

function isPreviewable(fileName: string) {
    if (fileName.endsWith('.png') 
    || fileName.endsWith('.jpg') 
    || fileName.endsWith('.jpeg') 
    || fileName.endsWith('.gif') 
    || fileName.endsWith('.txt') 
    || fileName.endsWith('.pdf')
    || fileName.endsWith('.md')
    || fileName.endsWith('.mp3')
    || fileName.endsWith('.wav')
    || fileName.endsWith('.ogg')
    || fileName.endsWith('.mp4')) {
        return true;
    }
    return false;
}

export default ShareRoutes;