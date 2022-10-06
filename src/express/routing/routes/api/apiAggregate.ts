import AuthRoutes from './authApi.js';
import UserRoutes from './userApi.js';
import UploadRoutes from './uploadApi.js';

class ApiAggregate {
    constructor() {
        this.auth = new AuthRoutes();
        this.user = new UserRoutes();
        this.upload = new UploadRoutes();
    }
    public auth;
    public user;
    public upload;
}

export default ApiAggregate