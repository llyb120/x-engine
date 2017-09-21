"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const api_1 = require("./api");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const WebSocket = require("ws");
class XEngine {
    constructor() {
        this.defaultInjects = {};
        this.controllers = [];
        this.socketControllers = [];
        this.socket = "no";
        this.defaultInjects[api_1.Connection.HTTP] = {};
        this.defaultInjects[api_1.Connection.WebSocket] = {};
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
                console.log(this);
                if (this.defaultInjects[api_1.Connection.WebSocket].hasOwnProperty(param)) {
                    return await this.defaultInjects[api_1.Connection.WebSocket][param](ctx);
                }
                if (config.inject && config.inject[param]) {
                    return await config.inject[param](ctx);
                }
                return undefined;
            })) : [];
            return await fn.apply(prototype, callParams);
        };
    }
    generateExpressFacotry(controller, key) {
        var fn = controller.ctrl.prototype[key];
        var params = utils_1.getParameterNames(fn);
        let config = controller.config;
        return async (req, res, next) => {
            //构造参数
            //先计算default
            var ctx = {
                req: req,
                res: res
            };
            var allparams = utils_1.GetAllParams(req);
            var callParams = await Promise.all(params.map(async (param) => {
                if (param in this.defaultInjects[api_1.Connection.HTTP]) {
                    return await this.defaultInjects[api_1.Connection.HTTP][param](ctx);
                }
                if (config.inject && config.inject[param]) {
                    return await config.inject[param](ctx);
                }
                if (allparams[param]) {
                    return allparams[param];
                }
                return undefined;
            }));
            var result = await fn.apply(controller.ctrl.prototype, callParams);
            try {
                for (const [key, val] of Object.entries(req.cookies)) {
                    res.cookie(key, val);
                }
                var render;
                if (render = config.render) {
                    res.render(render.replace(":method", key), result);
                }
                else if (config.dataType == 'json') {
                    res.header("Content-type: application/json");
                    res.send(JSON.stringify(result));
                }
                else if (next) {
                    next();
                }
                // res.end();
            }
            catch (e) {
                console.log(e, "这个错误不影响运行，请不要担心");
            }
        };
    }
    startWebSocket() {
        const wss = this.wss = new WebSocket.Server({ server: this.server });
        const factoryMap = new WeakMap();
        //事件分发
        const each = (functionName, ws, req, message) => {
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
                        await factory.call(this, config, ws, req, message);
                        // const factory = factoryMap.get(fn) || this.generateWebSocketFactory(fn);
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
                each('onError', error, req);
            });
        });
        /**
         * 后面接入消息处理机制
         */
        wss.on("error", () => {
            // console.log("oh shit web socket error");
        });
    }
    /**
     * 启动操作
     * @param app
     */
    startExpressServer(config) {
        if (!config.app) {
            throw new Error("没有传入express实例！");
        }
        if (config.server) {
            this.server = config.server;
        }
        const app = this.app = config.app;
        if (config.crossDomain) {
            app.all('*', function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
                res.header("X-Powered-By", ' 3.2.1');
                // res.header("Content-Type", "application/json;charset=utf-8");
                next();
            });
        }
        //bodyParser
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        var set = new Set();
        this.controllers.forEach(controller => {
            switch (controller.config.type) {
                case api_1.Connection.WebSocket:
                    this.socketControllers.push(controller);
                    if (set.has(api_1.Connection.WebSocket)) {
                        return;
                    }
                    set.add(api_1.Connection.WebSocket);
                    this.startWebSocket();
                    break;
                case api_1.Connection.HTTP:
                    var keys = Object.getOwnPropertyNames(controller.ctrl.prototype);
                    const config = controller.config;
                    keys.forEach(key => {
                        var args = [config.url.replace(":method", key), this.generateExpressFacotry(controller, key)];
                        //如果存在allowMethod
                        if (config.allowMethod) {
                            config.allowMethod.forEach(method => {
                                switch (method) {
                                    case 'get':
                                        app.get.apply(app, args);
                                        break;
                                    case 'post':
                                        app.post.apply(app, args);
                                        break;
                                }
                            });
                        }
                        else {
                            app.all.apply(app, args);
                        }
                    });
                    break;
            }
        });
    }
    registerController(ctrl, config) {
        var name = ctrl.name;
        this.controllers.push({
            ctrl: ctrl,
            config: (config || {})
        });
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
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9YLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTBEO0FBRTFELCtCQUFpTDtBQUNqTCwwQ0FBMEM7QUFDMUMsOENBQThDO0FBQzlDLGdDQUFnQztBQUloQztJQWlCSTtRQWZRLG1CQUFjLEdBRWxCLEVBQUUsQ0FBQztRQUNDLGdCQUFXLEdBQXlCLEVBQUUsQ0FBQztRQUN2QyxzQkFBaUIsR0FBMEIsRUFBRSxDQUFDO1FBRTlDLFdBQU0sR0FBRyxJQUFJLENBQUM7UUFVbEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ25ELENBQUM7SUFFTyx3QkFBd0IsQ0FBQyxTQUFrQixFQUFDLEdBQVk7UUFDNUQsSUFBSSxFQUFFLEdBQUksU0FBaUIsQ0FBQyxHQUFHLENBQWEsQ0FBQztRQUM3QyxJQUFJLE1BQU0sR0FBYyx5QkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QyxzREFBc0Q7UUFFdEQsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUF5QixFQUFFLEVBQWMsRUFBQyxHQUFTLEVBQUUsT0FBYTtZQUM1RSxNQUFNLEdBQUcsR0FBRztnQkFDUixHQUFHLEVBQUcsR0FBRztnQkFDVCxFQUFFLEVBQUcsRUFBRTtnQkFDUCxPQUFPLEVBQUcsT0FBTzthQUNwQixDQUFDO1lBQ0YscUNBQXFDO1lBQ3JDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLEtBQUs7Z0JBQ3JFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsRSxNQUFNLENBQUMsTUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFVLENBQUMsU0FBUyxDQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hGLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEMsTUFBTSxDQUFDLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDM0MsQ0FBQztnQkFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1QsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVPLHNCQUFzQixDQUFJLFVBQTRCLEVBQUUsR0FBVztRQUN2RSxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxJQUFJLE1BQU0sR0FBYSx5QkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QyxJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBd0IsQ0FBQztRQUVqRCxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBZTtZQUN0RCxNQUFNO1lBQ04sWUFBWTtZQUNaLElBQUksR0FBRyxHQUFHO2dCQUNOLEdBQUcsRUFBRSxHQUFHO2dCQUNSLEdBQUcsRUFBRSxHQUFHO2FBQ1gsQ0FBQztZQUNGLElBQUksU0FBUyxHQUFHLG9CQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsSUFBSSxVQUFVLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLEtBQUs7Z0JBQ3JELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRCxNQUFNLENBQUMsTUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFVLENBQUMsSUFBSSxDQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzNFLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEMsTUFBTSxDQUFDLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDM0MsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQixNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1QixDQUFDO2dCQUNELE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNKLElBQUksTUFBTSxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUM7Z0JBQ0QsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25ELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QixDQUFDO2dCQUNELElBQUksTUFBTSxDQUFDO2dCQUNYLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDekIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDdkQsQ0FBQztnQkFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxHQUFHLENBQUMsTUFBTSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7b0JBQzdDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO2dCQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNaLElBQUksRUFBRSxDQUFDO2dCQUNYLENBQUM7Z0JBQ0QsYUFBYTtZQUNqQixDQUFDO1lBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3RDLENBQUM7UUFDTCxDQUFDLENBQUM7SUFDTixDQUFDO0lBR1MsY0FBYztRQUNwQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNyRSxNQUFNLFVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBcUIsQ0FBQztRQUNwRCxNQUFNO1FBQ04sTUFBTSxJQUFJLEdBQUcsQ0FBQyxZQUFvQixFQUFDLEVBQXNCLEVBQUMsR0FBcUIsRUFBQyxPQUFjO1lBQzFGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLFVBQVU7Z0JBQzNDLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUEwQixDQUFDO2dCQUNyRCxVQUFVO2dCQUNWLEVBQUUsQ0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBLENBQUM7b0JBQzlDLEVBQUUsQ0FBQSxDQUFDLFlBQVksSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBLENBQUM7d0JBQzFDLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO3dCQUNuRCxJQUFJLE9BQU8sQ0FBQzt3QkFDWixPQUFPO3dCQUNQLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQzs0QkFDaEMsT0FBTyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxZQUFZLENBQUMsQ0FBQzs0QkFDaEYsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsT0FBTyxDQUFDLENBQUM7d0JBQy9CLENBQUM7d0JBQ0QsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxPQUFPLENBQUMsQ0FBQzt3QkFDL0MsMkVBQTJFO3dCQUMzRSwwRkFBMEY7b0JBQzlGLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO1FBQ0QscUNBQXFDO1FBRXJDLEdBQUcsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFHLENBQUMsRUFBRSxFQUFFLEdBQUc7WUFDMUIsSUFBSSxDQUFDLFdBQVcsRUFBQyxFQUFFLEVBQUMsR0FBRyxDQUFDLENBQUM7WUFFekIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLE9BQU87Z0JBQ3RDLElBQUksQ0FBQyxXQUFXLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxPQUFPLENBQUMsQ0FBQztnQkFDakMsd0NBQXdDO1lBQzVDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLO2dCQUNqQixJQUFJLENBQUMsU0FBUyxFQUFDLEtBQUssRUFBQyxHQUFHLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQztRQUdQLENBQUMsQ0FBQyxDQUFDO1FBRUg7O1dBRUc7UUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtZQUNaLDJDQUEyQztRQUMvQyxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFFRDs7O09BR0c7SUFDSCxrQkFBa0IsQ0FBQyxNQUFxQjtRQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFDRCxFQUFFLENBQUEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQztZQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQyxDQUFDO1FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBRWxDLEVBQUUsQ0FBQSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQSxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFVBQVUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO2dCQUNqQyxHQUFHLENBQUMsTUFBTSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQyxHQUFHLENBQUMsTUFBTSxDQUFDLDhCQUE4QixFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQy9ELEdBQUcsQ0FBQyxNQUFNLENBQUMsOEJBQThCLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztnQkFDMUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3JDLGdFQUFnRTtnQkFDaEUsSUFBSSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFRCxZQUFZO1FBQ1osR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwRCxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUE7UUFFdkIsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQy9CLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsS0FBSyxnQkFBVSxDQUFDLFNBQVM7b0JBQ3JCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3hDLEVBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBLENBQUM7d0JBQzlCLE1BQU0sQ0FBQztvQkFDWCxDQUFDO29CQUNELEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDOUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN0QixLQUFLLENBQUM7Z0JBRVYsS0FBSyxnQkFBVSxDQUFDLElBQUk7b0JBQ2hCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNqRSxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBd0IsQ0FBQztvQkFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO3dCQUNaLElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTt3QkFDN0YsaUJBQWlCO3dCQUNqQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs0QkFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTTtnQ0FDN0IsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQ0FDYixLQUFLLEtBQUs7d0NBQ04sR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO3dDQUN6QixLQUFLLENBQUM7b0NBQ1YsS0FBSyxNQUFNO3dDQUNQLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzt3Q0FDMUIsS0FBSyxDQUFDO2dDQUNkLENBQUM7NEJBQ0wsQ0FBQyxDQUFDLENBQUE7d0JBQ04sQ0FBQzt3QkFDRCxJQUFJLENBQUMsQ0FBQzs0QkFDRixHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQzdCLENBQUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsS0FBSyxDQUFDO1lBQ2QsQ0FBQztRQUVMLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUlELGtCQUFrQixDQUNkLElBQW1CLEVBQ25CLE1BQXdCO1FBRXhCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDbEIsSUFBSSxFQUFFLElBQUk7WUFDVixNQUFNLEVBQUUsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1NBQ3pCLENBQUMsQ0FBQTtJQUVOLENBQUM7SUFJRDs7T0FFRztJQUNILHFCQUFxQixDQUFDLElBQWlCLEVBQUMsTUFBb0I7UUFDeEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1RCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsVUFBVSxDQUFJLE1BQXdCO1FBQ2xDLE1BQU0sQ0FBQyxVQUFVLE1BQXFCO1lBQ2xDLFNBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztDQUVKO0FBN1BELDBCQTZQQztBQUdZLFFBQUEsQ0FBQyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFFL0I7O0dBRUc7QUFDSCxTQUFDLENBQUMscUJBQXFCLENBQUMsZ0JBQVUsQ0FBQyxJQUFJLEVBQUM7SUFDcEMsR0FBRyxDQUFDLEdBQW9CO1FBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ25CLENBQUM7SUFDRCxHQUFHLENBQUMsR0FBb0I7UUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUNELElBQUksQ0FBQyxHQUFvQjtRQUNyQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxHQUFvQjtRQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7SUFDM0IsQ0FBQztJQUNELE9BQU8sQ0FBQyxHQUFvQjtRQUN4QixNQUFNLENBQUUsR0FBRyxDQUFDLEdBQVcsQ0FBQyxPQUFPLENBQUM7SUFDcEMsQ0FBQztJQUNELEtBQUssQ0FBQyxHQUFvQjtRQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDekIsQ0FBQztDQUNKLENBQUMsQ0FBQztBQUVILFNBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBVSxDQUFDLFNBQVMsRUFBQztJQUN6QyxHQUFHLEVBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHO0lBQ3BCLEVBQUUsRUFBRyxDQUFDLEdBQXNCLEtBQUssR0FBRyxDQUFDLEVBQUU7SUFDdkMsT0FBTyxDQUFDLEdBQXNCO1FBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxLQUFLLENBQUMsR0FBc0I7UUFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDckIsQ0FBQztDQUNKLENBQUMsQ0FBQSJ9