import AuthRoutes from './auth.js';
import BasicRoutes from './basic.js';
import UserRoutes from './user.js';

class RenderAggregate {
    constructor() {
        this.basic = new BasicRoutes();
        this.auth = new AuthRoutes();
        this.user = new UserRoutes();
    }
    public basic;
    public auth;
    public user;
}

export default RenderAggregate