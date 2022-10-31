import { Request, Response } from 'express';
import config from "../../../../setup/config.js";
import databaseAccess from '../../../../database/databaseAccess.js';
import path from "path";
import { UserSessionInterface } from '../../../../helpers/sessionInterfaces.js';

class ShareRoutes {
    async share(req: Request, res: Response) {
        let fileId: string = req.params?.fileId;

        if (fileId.length < 1 || !(await databaseAccess.checks.isFileInDatabase(fileId))) {
            res.render('basic/notFound.ejs');
            return;
        }

        let filePath = await getFilePath(fileId);
        
        if (await databaseAccess.checks.isFilePrivate(fileId)) {
            if ((req.session as UserSessionInterface).userId != await databaseAccess.getInfo.getUserIdFromFileId(fileId)) {
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

        let userName = await databaseAccess.getInfo.getUserNameFromFileId(fileId);
        let fileName = await databaseAccess.getInfo.getFileNameFromFileId(fileId);

        res.render('share/share.ejs', { fileId: fileId, userName: userName, fileName: fileName, enablePreview: isPreviewable(fileName) });
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