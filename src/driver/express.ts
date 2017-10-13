import { XEngine } from '../X';
import { ExpressConfig, Connection, HttpController, ControllerSet } from '../api';
import { Express, Request, Response } from 'express';
import { BaseAdapter } from './base';
import { Server } from 'http';
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { GetAllParams, getParameterNames } from '../utils';
import { WebsocketAdapter } from './websocket';


export class ExpressAdapter extends BaseAdapter {
    public app: Express;
    public server: Server;
    private isStarted = false;


    // constructor(
    //     public context : XEngine,
    //     public config : ExpressConfig
    // ){
    //     super();
    // }

    start() {
        if (this.isStarted) {
            return;
        }

        this.isStarted = true;
        if (this.config.server) {
            this.server = this.config.server;
        }

        const app = this.app = this.config.app;

        if (this.config.crossDomain) {
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
        this.context.controllers.forEach(controller => {
            if (controller.config.type == Connection.HTTP) {
                var keys = Object.getOwnPropertyNames(controller.ctrl.prototype);
                const config = controller.config as HttpController;
                // console.log(keys)
                keys.forEach(key => {
                    //构造器没法调用
                    if (key == 'constructor') {
                        return;
                    }
                    //私有方法禁止访问
                    if (key[0] == '_') return;

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
            }

        })
    }


    private generateExpressFacotry<T>(controller: ControllerSet<T>, key: string) {
        var fn = controller.ctrl.prototype[key];
        var params: string[] = getParameterNames(fn);
        let config = controller.config as HttpController;

        return async (req: Request, res: Response, next?: Function) => {
            //构造参数
            //先计算default
            var ctx: any = {
                req: req,
                res: res
            };

            //存在授权
            if (config.authorization) {
                let canContinue = true;
                for (const auth of Object.values(config.authorization)) {
                    if (typeof auth === 'function') {
                        canContinue = await auth(ctx);
                    }
                    else if (this.context.defaultAuths[Connection.HTTP]
                        && (<any>this.context.defaultAuths[Connection.HTTP])[auth]) {
                        canContinue = await ((this.context.defaultAuths[Connection.HTTP] as any)[auth](ctx));
                    }
                    if (!canContinue) {
                        break;
                    }
                }
                if (!canContinue) {
                    return;
                }
            }

            //通用参数
            let commons = {};
            if (config.common) {
                if (!Array.isArray(config.common)) {
                    config.common = [config.common];
                }
                for (const common of config.common) {
                    let _ret = await common.call(controller.ctrl.prototype, ctx);
                    if (_ret) {
                        commons = Object.assign(commons, _ret);
                    }
                }
            }


            var allparams = GetAllParams(req);
            var callParams = await Promise.all(params.map(async param => {
                //ctx的优先级最高
                if (param in ctx) {
                    return ctx[param];
                }
                //检测默认的绑定
                if (param in this.context.defaultInjects[Connection.HTTP]) {
                    return await (this.context.defaultInjects[Connection.HTTP] as any)[param](ctx);
                }
                //控制器中自定义的绑定
                if (config.inject && config.inject[param]) {
                    return await config.inject[param](ctx);
                }
                //余下的绑定
                if (allparams[param]) {
                    return allparams[param];
                }
                return undefined;
            }));



            try {
                for (const [key, val] of Object.entries(req.cookies)) {
                    res.cookie(key, val);
                }
                var result = await fn.apply(controller.ctrl.prototype, callParams);
                if (Object.keys(commons).length) {
                    if (!result) {
                        commons = result;
                    }
                    else if (typeof result == 'object') {
                        result = Object.assign(commons, result);
                    }
                }

                if (!res.headersSent) {
                    var render;
                    if (render = config.render) {
                        res.render(render.replace(":method", key), result);
                    }
                    else if (config.dataType == 'json') {
                        res.header("Content-type: application/json");
                        res.send(JSON.stringify(result));
                    }
                    else if (result) {
                        res.send(result + "");
                    }
                    else if (next) {
                        next();
                    }
                }
                // res.end();
            }
            catch (e) {
                console.log(e, "这个错误不影响运行，请不要担心");
            }
        };
    }
}