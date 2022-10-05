import AuthRoutes from './authApi.js';
import UserRoutes from './userApi.js';

class ApiAggregate {
    constructor() {
        this.auth = new AuthRoutes();
        this.user = new UserRoutes();
    }
    public auth;
    public user;
}

export default ApiAggregate