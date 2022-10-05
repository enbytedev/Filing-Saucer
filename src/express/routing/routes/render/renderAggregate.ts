import AuthRoutes from './auth.js';
import BasicRoutes from './basic.js';

class RenderAggregate {
    constructor() {
        this.basic = new BasicRoutes();
        this.auth = new AuthRoutes();
    }
    public basic;
    public auth;
}

export default RenderAggregate