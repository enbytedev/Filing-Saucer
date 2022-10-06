import AuthRoutes from './authApi.js';
import UserRoutes from './userApi.js';
import UploadRoutes from './uploadApi.js';
import UpdateRoutes from './updateApi.js';

class ApiAggregate {
    constructor() {
        this.auth = new AuthRoutes();
        this.user = new UserRoutes();
        this.upload = new UploadRoutes();
        this.update = new UpdateRoutes();
    }
    public auth;
    public user;
    public upload;
    public update;
}

export default ApiAggregate