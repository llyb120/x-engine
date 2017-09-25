"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const api_1 = require("../api");
const base_1 = require("./base");
const WebSocket = require("ws");
const utils_1 = require("../utils");
class WebsocketAdapter extends base_1.BaseAdapter {
    constructor(context, 
        //以后追加koa
        config) {
        super();
        this.context = context;
        this.config = config;
        this.socketControllers = [];
        this.isStarted = false;
    }
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
        wss.on('connection', (ws, req) => {
            each('onConnect', ws, req);
            ws.on('message', function incoming(message) {
                each('onMessage', ws, req, message);
                // console.log('received: %s', message);
            });
            ws.on("error", (error) => {
                each('onError', ws, req, undefined, error);
            });
        });
        /**
         * 后面接入消息处理机制
         */
        wss.on("error", () => {
            console.log("oh shit web socket error");
        });
    }
    generateWebSocketFactory(prototype, key) {
        var fn = prototype[key];
        var params = utils_1.getParameterNames(fn);
        // let config = controller.config as SocketController;
        return (config, ws, req, message) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = {
                req: req,
                ws: ws,
                message: message
            };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RyaXZlci93ZWJzb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsZ0NBQW9GO0FBQ3BGLGlDQUFxQztBQUNyQyxnQ0FBZ0M7QUFFaEMsb0NBQTZDO0FBRTdDLHNCQUE4QixTQUFRLGtCQUFXO0lBSzdDLFlBQ1csT0FBaUI7UUFDeEIsU0FBUztRQUNGLE1BQXNCO1FBRzdCLEtBQUssRUFBRSxDQUFDO1FBTEQsWUFBTyxHQUFQLE9BQU8sQ0FBVTtRQUVqQixXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQU56QixzQkFBaUIsR0FBeUIsRUFBRSxDQUFDO1FBQzdDLGNBQVMsR0FBRyxLQUFLLENBQUM7SUFVMUIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVU7WUFDdkMsRUFBRSxDQUFBLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssZ0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQSxDQUFDO2dCQUNoRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxLQUFLO1FBQ0QsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBLENBQUM7WUFDZixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUUxQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxD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