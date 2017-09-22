"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        return async (config, ws, req, message) => {
            const ctx = {
                req: req,
                ws: ws,
                message: message
            };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RyaXZlci93ZWJzb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxnQ0FBb0Y7QUFDcEYsaUNBQXFDO0FBQ3JDLGdDQUFnQztBQUVoQyxvQ0FBNkM7QUFFN0Msc0JBQThCLFNBQVEsa0JBQVc7SUFLN0MsWUFDVyxPQUFpQjtRQUN4QixTQUFTO1FBQ0YsTUFBc0I7UUFHN0IsS0FBSyxFQUFFLENBQUM7UUFMRCxZQUFPLEdBQVAsT0FBTyxDQUFVO1FBRWpCLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBTnpCLHNCQUFpQixHQUF5QixFQUFFLENBQUM7UUFDN0MsY0FBUyxHQUFHLEtBQUssQ0FBQztJQVUxQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxrQkFBa0I7UUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUN2QyxFQUFFLENBQUEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxnQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFBLENBQUM7Z0JBQ2hELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDNUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELEtBQUs7UUFDRCxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUEsQ0FBQztZQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRTFCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM1RSxNQUFNLFVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBc0IsQ0FBQztRQUNyRCxNQUFNO1FBQ04sTUFBTSxJQUFJLEdBQUcsQ0FBQyxZQUFvQixFQUFFLEVBQWEsRUFBRSxHQUFvQixFQUFFLE9BQWEsRUFBQyxLQUFjO1lBQ2pHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLFVBQVU7Z0JBQzNDLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUEwQixDQUFDO2dCQUNyRCxVQUFVO2dCQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hELEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO3dCQUNuRCxJQUFJLE9BQU8sQ0FBQzt3QkFDWixPQUFPO3dCQUNQLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbEMsT0FBTyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQzs0QkFDakYsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBQ2hDLENBQUM7d0JBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQzt3QkFDbEUsMkVBQTJFO3dCQUMzRSxFQUFFLENBQUEsQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFDOzRCQUNQLElBQUcsQ0FBQztnQ0FDQSxFQUFFLENBQUEsQ0FBQyxPQUFPLE1BQU0sSUFBSSxRQUFRLENBQUMsQ0FBQSxDQUFDO29DQUMxQixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQ0FDcEMsQ0FBQztnQ0FDRCxJQUFJLENBQUEsQ0FBQztvQ0FDRCxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dDQUNwQixDQUFDOzRCQUNMLENBQUM7NEJBQ0QsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQzs0QkFFVCxDQUFDO3dCQUNMLENBQUM7d0JBQ0QsMEZBQTBGO29CQUM5RixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQTtRQUNELHFDQUFxQztRQUVyQyxHQUFHLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHO1lBQ3pCLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTNCLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLGtCQUFrQixPQUFPO2dCQUN0QyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3BDLHdDQUF3QztZQUM1QyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSztnQkFDakIsSUFBSSxDQUFDLFNBQVMsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQztRQUdQLENBQUMsQ0FBQyxDQUFDO1FBRUg7O1dBRUc7UUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHTyx3QkFBd0IsQ0FBQyxTQUFpQixFQUFFLEdBQVc7UUFDM0QsSUFBSSxFQUFFLEdBQUksU0FBaUIsQ0FBQyxHQUFHLENBQWEsQ0FBQztRQUM3QyxJQUFJLE1BQU0sR0FBYSx5QkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QyxzREFBc0Q7UUFFdEQsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUF3QixFQUFFLEVBQWEsRUFBRSxHQUFRLEVBQUUsT0FBWTtZQUN6RSxNQUFNLEdBQUcsR0FBRztnQkFDUixHQUFHLEVBQUUsR0FBRztnQkFDUixFQUFFLEVBQUUsRUFBRTtnQkFDTixPQUFPLEVBQUUsT0FBTzthQUNuQixDQUFDO1lBQ0YscUNBQXFDO1lBQ3JDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLEtBQUs7Z0JBQ3JFLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxnQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0QsTUFBTSxDQUFDLE1BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsZ0JBQVUsQ0FBQyxTQUFTLENBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDeEYsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxNQUFNLENBQUMsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDO2dCQUNELE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDVCxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUE7SUFDTCxDQUFDO0NBRUo7QUF4SEQsNENBd0hDIn0=