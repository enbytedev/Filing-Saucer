import AuthRoutes from './auth.js';
import BasicRoutes from './basic.js';
import UserRoutes from './user.js';
import ShareRoutes from './share.js';

class RenderAggregate {
    constructor() {
        this.basic = new BasicRoutes();
        this.auth = new AuthRoutes();
        this.user = new UserRoutes();
        this.share = new ShareRoutes();
    }
    public basic;
    public auth;
    public user;
    public share;
}

export default RenderAggregate