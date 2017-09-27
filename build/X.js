"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
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
    },
    params(ctx) {
        return utils_1.GetAllParams(ctx.req);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9YLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTBEO0FBRTFELCtCQUFpTDtBQUtqTCxrREFBc0Q7QUFDdEQsOENBQWtEO0FBR2xEO0lBc0JJO1FBckJBLHdCQUF3QjtRQUNqQixtQkFBYyxHQUVqQixFQUFFLENBQUM7UUFDQSxpQkFBWSxHQUVmLEVBQUUsQ0FBQztRQUVBLGdCQUFXLEdBQXlCLEVBQUUsQ0FBQztRQWMxQyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQU1TLGNBQWM7SUFHeEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILGtCQUFrQixDQUFDLE1BQXFCO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSx3QkFBYyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTVCLFdBQVc7UUFDWCxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksZ0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBLENBQUM7WUFDeEUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksNEJBQWdCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVB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