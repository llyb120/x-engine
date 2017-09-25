"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const websocket_1 = require("./driver/websocket");
const express_1 = require("./driver/express");
class XEngine {
    constructor() {
        // private app: Express;
        this.defaultInjects = {};
        this.defaultAuths = {};
        this.controllers = [];
        this.defaultInjects[api_1.Connection.HTTP] = {};
        this.defaultInjects[api_1.Connection.WebSocket] = {};
    }
    startWebSocket() {
    }
    /**
     * 启动操作
     * @param app
     */
    startExpressServer(config) {
        if (!config.app) {
            throw new Error("没有传入express实例！");
        }
        this.expressAdapter = new express_1.ExpressAdapter(this, config);
        this.expressAdapter.start();
        //websocket
        if (this.controllers.some(item => item.config.type == api_1.Connection.WebSocket)) {
            this.websocketAdapter = new websocket_1.WebsocketAdapter(this, config);
            this.websocketAdapter.start();
        }
    }
    registerController(ctrl, config) {
        var name = ctrl.name;
        this.controllers.push({
            ctrl: ctrl,
            config: (config || {})
        });
    }
    registerAuthorization(from, authObj) {
        this.defaultAuths[from] = this.defaultAuths[from] || {};
        this.defaultAuths[from] = Object.assign(this.defaultInjects[from], authObj);
    }
    /**
     * 增加默认注入的元素
     */
    registerDefaultInject(from, params) {
        this.defaultInjects[from] = this.defaultInjects[from] || {};
        this.defaultInjects[from] = Object.assign(this.defaultInjects[from], params);
    }
    /**
     * 常用装饰器
     * @param config c
     */
    Controller(config) {
        return function (target) {
            exports.V.registerController(target, config);
        };
    }
}
exports.XEngine = XEngine;
exports.V = new XEngine();
/**
 * 注册默认的变量
 */
exports.V.registerDefaultInject(api_1.Connection.HTTP, {
    req(ctx) {
        return ctx.req;
    },
    res(ctx) {
        return ctx.res;
    },
    body(ctx) {
        return ctx.req.body;
    },
    cookie(ctx) {
        return ctx.req.cookies;
    },
    session(ctx) {
        return ctx.req.session;
    },
    query(ctx) {
        return ctx.req.query;
    }
});
exports.V.registerDefaultInject(api_1.Connection.WebSocket, {
    req: ctx => ctx.req,
    ws: (ctx) => ctx.ws,
    message(ctx) {
        return ctx.message;
    },
    error(ctx) {
        return ctx.error;
    },
    wss: (ctx) => ctx.wss
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9YLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsK0JBQWlMO0FBS2pMLGtEQUFzRDtBQUN0RCw4Q0FBa0Q7QUFHbEQ7SUFzQkk7UUFyQkEsd0JBQXdCO1FBQ2pCLG1CQUFjLEdBRWpCLEVBQUUsQ0FBQztRQUNBLGlCQUFZLEdBRWYsRUFBRSxDQUFDO1FBRUEsZ0JBQVcsR0FBeUIsRUFBRSxDQUFDO1FBYzFDLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNuRCxDQUFDO0lBTVMsY0FBYztJQUd4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsa0JBQWtCLENBQUMsTUFBcUI7UUFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBRUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLHdCQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFNUIsV0FBVztRQUNYLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxnQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUEsQ0FBQztZQUN4RSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSw0QkFBZ0IsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2xD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