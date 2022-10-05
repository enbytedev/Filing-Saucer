import AuthRoutes from './authApi.js';

class ApiAggregate {
    constructor() {
        this.auth = new AuthRoutes();
    }
    public auth;
}

export default ApiAggregate