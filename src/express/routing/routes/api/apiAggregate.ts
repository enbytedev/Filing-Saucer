import AuthRoutes from './authApi.js';
import UpdateUserRoutes from './updateUserApi.js';
import UploadRoutes from './uploadApi.js';
import UpdateRoutes from './updateFileApi.js';

class ApiAggregate {
    constructor() {
        this.auth = new AuthRoutes();
        this.updateUser = new UpdateUserRoutes();
        this.upload = new UploadRoutes();
        this.updateFile = new UpdateRoutes();
    }
    public auth;
    public updateUser;
    public updateFile;
    public upload;
}

export default ApiAggregate