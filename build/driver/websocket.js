"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const api_1 = require("../api");
const base_1 = require("./base");
const WebSocket = require("ws");
const utils_1 = require("../utils");
class WebsocketAdapter extends base_1.BaseAdapter {
    constructor() {
        super(...arguments);
        this.socketControllers = [];
        this.isStarted = false;
    }
    // constructor(
    //     public context : XEngine,
    //     //以后追加koa
    //     public config : ExpressConfig,
    // ){
    //     super();
    // }
    /**
     * 收集需要的控制器
     */
    collectControllers() {
        this.context.controllers.forEach(controller => {
            if (controller.config.type === api_1.Connection.WebSocket) {
                this.socketControllers.push(controller);
            }
        });
    }
    start() {
        if (this.isStarted) {
            return false;
        }
        this.isStarted = true;
        this.collectControllers();
        const wss = this.wss = new WebSocket.Server({ server: this.config.server });
        const factoryMap = new WeakMap();
        //事件分发
        const each = (functionName, ws, req, message, error) => {
            this.socketControllers.forEach((controller) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const config = controller.config;
                //如果没有，则分发
                if (!config.url || (req && req.url == config.url)) {
                    if (functionName in controller.ctrl.prototype) {
                        const fn = controller.ctrl.prototype[functionName];
                        var factory;
                        //生成适配器
                        if (!(factory = factoryMap.get(fn))) {
                            factory = this.generateWebSocketFactory(controller.ctrl.prototype, functionName);
                            factoryMap.set(fn, factory);
                        }
                        const result = yield factory.call(this, config, ws, req, message);
                        // const factory = factoryMap.get(fn) || this.generateWebSocketFactory(fn);
                        if (result) {
                            try {
                                if (typeof result == 'object') {
                                    ws.send(JSON.stringify(result));
                                }
                                else {
                                    ws.send(result);
                                }
                            }
                            catch (e) {
                            }
                        }
                        // controller.ctrl.prototype[functionName].call(controller.ctrl.prototype,ws,req,message);
                    }
                }
            }));
        };
        // this.webSocketUsers = new WeakMap;
        // const heartbeat = function () {
        //     this.isAlive = true;
        // }
        wss.on('connection', (ws, req) => {
            each('onConnect', ws, req);
            //断线保护
            ws.on("pong", () => {
                ws.isAlive = false;
            });
            ws.on('message', (message) => {
                each('onMessage', ws, req, message);
                // console.log('received: %s', message);
            });
            ws.on("error", (error) => {
                each('onError', ws, req, undefined, error);
            });
            //劫持API
            const fn = ws.terminate;
            ws.terminate = () => {
                fn.call(ws);
                each("onClose", ws, req);
            };
        });
        /**
         * 后面接入消息处理机制
         */
        wss.on("error", () => {
            console.log("oh shit web socket error");
        });
        //增加防断线机制
        const interval = setInterval(function () {
            wss.clients.forEach(function (ws) {
                if (ws.isAlive === false)
                    return ws.terminate();
                ws.isAlive = false;
                ws.ping('', false, true);
            });
        }, 30000);
    }
    generateWebSocketFactory(prototype, key) {
        console.log(key);
        var fn = prototype[key];
        var params = utils_1.getParameterNames(fn);
        // let config = controller.config as SocketController;
        return (config, ws, req, message) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = {
                req: req,
                ws: ws,
                message: message,
                wss: this.wss
            };
            if (config.authorization && key === 'onMessage') {
                let canContinue = true;
                for (const auth of config.authorization) {
                    if (this.context.defaultAuths[api_1.Connection.WebSocket]
                        && this.context.defaultAuths[api_1.Connection.WebSocket][auth]) {
                        canContinue = yield (this.context.defaultAuths[api_1.Connection.WebSocket][auth](ctx));
                        if (!canContinue) {
                            break;
                        }
                    }
                }
                if (!canContinue) {
                    return;
                }
            }
            // var allparams = GetAllParams(req);
            var callParams = params.length ? yield Promise.all(params.map((param) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (param in this.context.defaultInjects[api_1.Connection.WebSocket]) {
                    return yield this.context.defaultInjects[api_1.Connection.WebSocket][param](ctx);
                }
                if (config.inject && config.inject[param]) {
                    return yield config.inject[param](ctx);
                }
                return undefined;
            }))) : [];
            return yield fn.apply(prototype, callParams);
        });
    }
}
exports.WebsocketAdapter = WebsocketAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RyaXZlci93ZWJzb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsZ0NBQW9GO0FBQ3BGLGlDQUFxQztBQUNyQyxnQ0FBZ0M7QUFFaEMsb0NBQTZDO0FBRTdDLHNCQUE4QixTQUFRLGtCQUFXO0lBQWpEOztRQUVZLHNCQUFpQixHQUF5QixFQUFFLENBQUM7UUFDN0MsY0FBUyxHQUFHLEtBQUssQ0FBQztJQWlLOUIsQ0FBQztJQS9KRyxlQUFlO0lBQ2YsZ0NBQWdDO0lBQ2hDLGdCQUFnQjtJQUNoQixxQ0FBcUM7SUFFckMsS0FBSztJQUNMLGVBQWU7SUFFZixJQUFJO0lBRUo7O09BRUc7SUFDSCxrQkFBa0I7UUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUN2QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxnQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDNUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUs7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUUxQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDNUUsTUFBTSxVQUFV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