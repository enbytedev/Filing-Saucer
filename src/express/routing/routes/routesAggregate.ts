import ApiAggregate from './api/apiAggregate.js';
import RenderAggregate from './render/renderAggregate.js';

class RoutesAggregate {
    constructor() {
        this.api = new ApiAggregate();
        this.render = new RenderAggregate();
    }
    public api;
    public render;
}

export default RoutesAggregate