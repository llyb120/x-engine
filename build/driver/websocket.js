"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        const wss = this.wss = new WebSocket.Server({ server: this.context.server });
        const factoryMap = new WeakMap();
        //事件分发
        const each = (functionName, ws, req, message, error) => {
            this.socketControllers.forEach(async (controller) => {
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
                        const result = await factory.call(this, config, ws, req, message);
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
            });
        };
        // this.webSocketUsers = new WeakMap;
        // const heartbeat = function () {
        //     this.isAlive = true;
        // }
        wss.on('connection', (ws, req) => {
            each('onConnect', ws, req);
            //断线保护
            // ws.on("pong", () => {
            //     (ws as any).isAlive = false;
            // });
            ws.on('message', (message) => {
                each('onMessage', ws, req, message);
                // console.log('received: %s', message);
            });
            ws.on("error", (error) => {
                each('onError', ws, req, undefined, error);
            });
            ws.on("close", (code, message) => {
                each("onClose", ws, req, message);
            });
            //劫持API
            // const fn = ws.terminate;
            // ws.terminate = () => {
            //     fn.call(ws);
            //     each("onClose", ws, req);
            // }
        });
        /**
         * 后面接入消息处理机制
         */
        wss.on("error", () => {
            console.log("oh shit web socket error");
        });
        //增加防断线机制
        // const interval = setInterval(function () {
        //     wss.clients.forEach(function (ws) {
        //         if ((ws as any).isAlive === false) return ws.terminate();
        //         (ws as any).isAlive = false;
        //         ws.ping('', false, true);
        //     });
        // }, 30000);
    }
    generateWebSocketFactory(prototype, key) {
        var fn = prototype[key];
        var params = utils_1.getParameterNames(fn);
        // let config = controller.config as SocketController;
        return async (config, ws, req, message) => {
            const ctx = {
                req: req,
                ws: ws,
                message: message,
                wss: this.wss
            };
            if (config.authorization && key === 'onMessage') {
                let canContinue = true;
                for (const auth of config.authorization) {
                    if (typeof auth === 'function') {
                        canContinue = await auth(ctx);
                    }
                    else if (this.context.defaultAuths[api_1.Connection.WebSocket]
                        && this.context.defaultAuths[api_1.Connection.WebSocket][auth]) {
                        canContinue = await (this.context.defaultAuths[api_1.Connection.WebSocket][auth](ctx));
                    }
                    if (!canContinue) {
                        break;
                    }
                }
                if (!canContinue) {
                    return;
                }
            }
            // var allparams = GetAllParams(req);
            var callParams = params.length ? await Promise.all(params.map(async (param) => {
                if (param in this.context.defaultInjects[api_1.Connection.WebSocket]) {
                    return await this.context.defaultInjects[api_1.Connection.WebSocket][param](ctx);
                }
                if (config.inject && config.inject[param]) {
                    return await config.inject[param](ctx);
                }
                return undefined;
            })) : [];
            return await fn.apply(prototype, callParams);
        };
    }
}
exports.WebsocketAdapter = WebsocketAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RyaXZlci93ZWJzb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxnQ0FBb0Y7QUFDcEYsaUNBQXFDO0FBQ3JDLGdDQUFnQztBQUVoQyxvQ0FBNkM7QUFFN0Msc0JBQThCLFNBQVEsa0JBQVc7SUFBakQ7O1FBRVksc0JBQWlCLEdBQXlCLEVBQUUsQ0FBQztRQUM3QyxjQUFTLEdBQUcsS0FBSyxDQUFDO0lBdUs5QixDQUFDO0lBcktHLGVBQWU7SUFDZixnQ0FBZ0M7SUFDaEMsZ0JBQWdCO0lBQ2hCLHFDQUFxQztJQUVyQyxLQUFLO0lBQ0wsZUFBZTtJQUVmLElBQUk7SUFFSjs7T0FFRztJQUNILGtCQUFrQjtRQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLGdCQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM1QyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsS0FBSztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRTFCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM3RSxNQUFNLFVBQVUs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