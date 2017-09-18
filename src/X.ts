import { getParameterNames } from './utils';
import { Express, Request, Response } from "express";
import { Controller, ControllerConfig, ControllerSet, InjectParams } from "./api";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";


export class XEngineManager {
    private app: Express;
    private defaultInjects: any = {};
    private controllers: ControllerSet<any>[] = [];

    private generateExpressFacotry<T>(controller: ControllerSet<T>, key: string) {
        var fn = controller.ctrl.prototype[key];
        var params: string[] = getParameterNames(fn);
        let config = controller.config;

        return async (req: Request, res: Response, next?: Function) => {
            //构造参数
            //先计算default
            var ctx = {
                req: req,
                res: res
            };
            var allparams = Object.assign(req.params,req.query,req.body);
            var callParams = await Promise.all(params.map(async param => {
                if (this.defaultInjects[param]) {
                    return await this.defaultInjects[param](ctx);
                }
                if (config.inject && config.inject[param]) {
                    return await config.inject[param](ctx);
                }
                if(allparams[param]){
                    return allparams[param];
                }
                return undefined;
            }));
            var result = await fn.apply(controller.ctrl.prototype, callParams);
            try {
                for(const [key,val] of Object.entries(req.cookies)){
                    res.cookie(key,val);
                }
                var render;
                if (render = config.render) {
                    res.render(render.replace(":method", key), result);
                }
                else if (config.type == 'json') {
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

    startExpressServer(app: Express) {
        this.app = app;

        //bodyParser
        app.use(bodyParser.urlencoded({extended : false}));
        app.use(cookieParser())

        this.controllers.forEach(controller => {
            var keys = Object.getOwnPropertyNames(controller.ctrl.prototype);
            keys.forEach(key => {
                var args = [controller.config.url.replace(":method", key), this.generateExpressFacotry(controller, key)]
                //如果存在allowMethod
                if (controller.config.allowMethod) {
                    controller.config.allowMethod.forEach(method => {
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
            X.registerController(target, config);
        }
    }

}


export const X = new XEngineManager();

/**
 * 注册默认的变量
 */
X.registerDefaultInject({
    req(ctx) {
        return ctx.req;
    },
    res(ctx) {
        return ctx.res;
    },
    body(ctx){
        return ctx.req.body;
    },
    cookie(ctx){
        return ctx.req.cookies;
    },
    session(ctx){
        return ctx.req.session;
    },
    query(ctx){
        return ctx.req.query;
    }
});