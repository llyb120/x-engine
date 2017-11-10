"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const api_1 = require("./api");
const websocket_1 = require("./driver/websocket");
const express_1 = require("./driver/express");
const http = require("http");
class XEngine {
    constructor() {
        // private app: Express;
        this.defaultInjects = {};
        this.defaultAuths = {};
        this.controllers = [];
        this.controllersMap = {};
        this.defaultInjects[api_1.Connection.HTTP] = {};
        this.defaultInjects[api_1.Connection.WebSocket] = {};
        this.expressAdapter = new express_1.ExpressAdapter(this);
        this.server = http.createServer(this.expressAdapter.app);
    }
    startWebSocket() {
    }
    /**
     * 启动操作
     * @param app
     */
    async startExpressServer(config) {
        // if (!config.app) {
        // throw new Error("没有传入express实例！");
        // }
        // this.expressAdapter = new ExpressAdapter(this);
        await this.expressAdapter.start(config);
        //websocket
        if (this.controllers.some(item => item.config.type == api_1.Connection.WebSocket)) {
            this.websocketAdapter = new websocket_1.WebsocketAdapter(this, config);
            this.websocketAdapter.start();
        }
        this.server.listen(config.port);
        // return this.expressAdapter.app;
    }
    registerController(ctrl, config) {
        var name = ctrl.name;
        this.controllers.push({
            ctrl: ctrl,
            config: (config || {})
        });
        //dev
        this.controllersMap[name] = {
            ctrl,
            config: config || {},
            methodsParam: {}
        };
        //分发
        if (config.type === api_1.Connection.HTTP) {
            //如果存在这个，那么立刻注册
            // if(this.expressAdapter){
            //生成所有函数的参数表
            let fnNames = Object.getOwnPropertyNames(ctrl.prototype);
            for (const fnName of fnNames) {
                if (fnName === 'constructor' || fnName[0] === '_') {
                    continue;
                }
                let params = utils_1.getParameterNames(ctrl.prototype[fnName]);
                this.controllersMap[name].methodsParam[fnName] = params;
            }
            this.expressAdapter.onControllerRegister(name);
            // }
            //否则，等start开始的时候重新注册
            // else{
            // this.expressControllerBuffer.push(name);
            // }
        }
        else {
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9YLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTBEO0FBRTFELCtCQUFpTDtBQUtqTCxrREFBc0Q7QUFDdEQsOENBQWtEO0FBQ2xELDZCQUE2QjtBQUc3QjtJQXFDSTtRQXBDQSx3QkFBd0I7UUFDakIsbUJBQWMsR0FFakIsRUFBRSxDQUFDO1FBQ0EsaUJBQVksR0FFZixFQUFFLENBQUM7UUFFQSxnQkFBVyxHQUF5QixFQUFFLENBQUM7UUFFdkMsbUJBQWMsR0FRakIsRUFBRSxDQUFDO1FBbUJILElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUUvQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksd0JBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU3RCxDQUFDO0lBTVMsY0FBYztJQUd4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQXFCO1FBQzFDLHFCQUFxQjtRQUNyQixxQ0FBcUM7UUFDckMsSUFBSTtRQUVKLGtEQUFrRDtRQUNsRCxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhDLFdBQVc7UUFDWCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksZ0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLGdCQUFnQixHQUFH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