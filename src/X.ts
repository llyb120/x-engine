import { getParameterNames, GetAllParams } from './utils';
import { Express, Request, Response } from "express";
import { Controller, ControllerConfig, ControllerSet, InjectParams, ExpressConfig, HttpController, Connection, SocketController } from './api';
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as WebSocket from 'ws';
import { Server } from 'http';


export class XEngine {
    private app: Express;
    private defaultInjects: any = {};
    private controllers: ControllerSet<any>[] = [];
    private socketControllers : ControllerSet<any>[] = [];
    private wss: WebSocket.Server;
    private socket = "no";
    private server: Server;

    private generateExpressFacotry<T>(controller: ControllerSet<T>, key: string) {
        var fn = controller.ctrl.prototype[key];
        var params: string[] = getParameterNames(fn);
        let config = controller.config as HttpController;

        return async (req: Request, res: Response, next?: Function) => {
            //构造参数
            //先计算default
            var ctx = {
                req: req,
                res: res
            };
            var allparams = GetAllParams(req);
            var callParams = await Promise.all(params.map(async param => {
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


    protected startWebSocket() {
        const wss = this.wss = new WebSocket.Server({ server: this.server });

        //事件分发
        const each = (functionName :string,ws : WebSocket | Error,req? : any) => {
            this.socketControllers.forEach(controller => {
                const config = controller.config as SocketController;
                //如果没有，则分发
                if(!config.url || req.url == config.url){
                    if(functionName in controller.ctrl.prototype){
                        controller.ctrl.prototype[functionName].call(controller.ctrl.prototype,ws,req);
                    }
                }
            });
        }

        wss.on('connection', function connection(ws, req) {
            each('onConnect',ws,req);
            // console.log("connnection");
            // const location = url.parse(req.url, true);
            // You might use location.query.access_token to authenticate or share sessions
            // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

            ws.on('message', function incoming(message) {
                each('onMessage',ws);
                // console.log('received: %s', message);
            });

            ws.on("error", (error) => {
                each('onError',error);
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
    startExpressServer(config: ExpressConfig) {
        if (!config.app) {
            throw new Error("没有传入express实例！");
        }
        if(config.server){
            this.server = config.server;
        }

        const app = this.app = config.app;
        
        if(config.crossDomain){
            app.all('*', function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
                // res.header("X-Powered-By", ' 3.2.1');
                // res.header("Content-Type", "application/json;charset=utf-8");
                next();
            });
        }

        //bodyParser
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser())

        var set = new Set();
        this.controllers.forEach(controller => {
            switch (controller.config.type) {
                case Connection.WebSocket:
                    this.socketControllers.push(controller);
                    if(set.has(Connection.WebSocket)){
                        return;
                    } 
                    set.add(Connection.WebSocket);
                    this.startWebSocket();
                    break;

                case Connection.HTTP:
                    var keys = Object.getOwnPropertyNames(controller.ctrl.prototype);
                    const config = controller.config as HttpController;
                    keys.forEach(key => {
                        var args = [config.url.replace(":method", key), this.generateExpressFacotry(controller, key)]
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
                            })
                        }
                        else {
                            app.all.apply(app, args);
                        }
                    });
                    break;
            }

        })
    }



    registerController<T>(
        ctrl: Controller<T>,
        config: ControllerConfig
    ) {
        var name = ctrl.name;

        this.controllers.push({
            ctrl: ctrl,
            config: (config || {})
        })

    }



    /**
     * 增加默认注入的元素
     */
    registerDefaultInject(params: InjectParams) {
        this.defaultInjects = Object.assign(this.defaultInjects, params);
    }


    /**
     * 常用装饰器
     * @param config c
     */
    Controller<T>(config: ControllerConfig) {
        return function (target: Controller<T>) {
            V.registerController(target, config);
        }
    }

}


export const V = new XEngine();

/**
 * 注册默认的变量
 */
V.registerDefaultInject({
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
        return (ctx.req as any).session;
    },
    query(ctx) {
        return ctx.req.query;
    }
});