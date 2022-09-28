import setup from './setup/setup.js';
import Database from './database/databaseAccess.js';
// import { IUpload } from './database/interfaces/tableInterfaces.js';

setup();

// Database.update.upload({filename: "c40804cc284ae429.e", private: 0});
Database.add.user({email: "a", password: "a", name: "a", timezone: "a"});