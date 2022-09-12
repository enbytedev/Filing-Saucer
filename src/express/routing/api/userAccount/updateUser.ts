import { Response, Request } from 'express';
import databaseAccess from '../../../../database/databaseAccess.js';
import { UserSessionInterface } from '../../sessionInterfaces.js';
import { renderAccount } from '../../user/account.js';

export default async (req: Request, res: Response) => {
    if(await databaseAccess.checks.isPasswordCorrect(String((req.session as UserSessionInterface).email), req.body.oldpassword)) {
        if (req.body.password != "*****") {
            console.log("password updating");
            databaseAccess.userAccount.updateUser("password", String((req.session as UserSessionInterface).email), req.body.password)
            .catch(() => { console.error(`Something went wrong while updating password for user ${String((req.session as UserSessionInterface).email)}`); renderAccount(req, res, "Something went wrong"); })
        }
        if (String((req.session as UserSessionInterface).firstName) != req.body.name) {
            databaseAccess.userAccount.updateUser("name", String((req.session as UserSessionInterface).email), req.body.name)
            .then(() => { (req.session as UserSessionInterface).firstName = req.body.name; })
            .catch(() => { console.error(`Something went wrong while updating name for user ${String((req.session as UserSessionInterface).email)}`); renderAccount(req, res, "Something went wrong"); })
        }
    } else {
        renderAccount(req, res, "Incorrect password");
        return;
    }

    operationComplete(req, res, "Account updated");
}

async function operationComplete(req: Request, res: Response, message: string) {
    await new Promise(r => setTimeout(r, 500));
    renderAccount(req, res, message); 
}