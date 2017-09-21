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
        this.socket = "no";
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
                if (this.defaultInjects[param]) {
                    return await this.defaultInjects[param](ctx);
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
        wss.on('connection', function connection(ws, req) {
            console.log("connnection");
            // const location = url.parse(req.url, true);
            // You might use location.query.access_token to authenticate or share sessions
            // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
            });
            ws.send('something');
            ws.on("error", (error) => {
            });
        });
        /**
         * 后面接入消息处理机制
         */
        wss.on("error", () => {
        });
        console.log("boot success");
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
        //如果使用socket
        // if (config.socket) {
        //     switch (config.socket) {
        //         case 'websocket':
        //             if (!config.server) {
        //                 throw new Error("没有传入server实例！");
        //             }
        //             this.socket = 'websocket';
        //             this.server = config.server;
        //             this.startWebSocket();
        //             break;
        //     }
        // }
        const app = this.app = config.app;
        //bodyParser
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        var services = {};
        this.controllers.forEach(controller => {
            switch (controller.config.type) {
                case api_1.Connection.WebSocket:
                    if (services[api_1.Connection.WebSocket]) {
                        return;
                    }
                    this.startWebSocket();
                    services[api_1.Connection.WebSocket] = 1;
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
    registerDefaultInject(params) {
        this.defaultInjects = Object.assign(this.defaultInjects, params);
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
exports.V.registerDefaultInject({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9YLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTBEO0FBRTFELCtCQUE2SDtBQUM3SCwwQ0FBMEM7QUFDMUMsOENBQThDO0FBQzlDLGdDQUFnQztBQUloQztJQUFBO1FBRVksbUJBQWMsR0FBUSxFQUFFLENBQUM7UUFDekIsZ0JBQVcsR0FBeUIsRUFBRSxDQUFDO1FBRXZDLFdBQU0sR0FBRyxJQUFJLENBQUM7SUE2TDFCLENBQUM7SUExTFcsc0JBQXNCLENBQUksVUFBNEIsRUFBRSxHQUFXO1FBQ3ZFLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLElBQUksTUFBTSxHQUFhLHlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUF3QixDQUFDO1FBRWpELE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFlO1lBQ3RELE1BQU07WUFDTixZQUFZO1lBQ1osSUFBSSxHQUFHLEdBQUc7Z0JBQ04sR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsR0FBRyxFQUFFLEdBQUc7YUFDWCxDQUFDO1lBQ0YsSUFBSSxTQUFTLEdBQUcsb0JBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxJQUFJLFVBQVUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUMsS0FBSztnQkFDckQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdCLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pELENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxD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