import { getParameterNames } from './utils';
import { Express, Request, Response } from "express";
import { Controller, ControllerConfig, ControllerSet, InjectParams } from "./api";



export class XEngineManager {
    private app: Express;
    private defaultInjects: any = {};
    private controllers: ControllerSet<any>[] = [];

    private generateExpressFacotry<T>(controller: ControllerSet<T>, key: string) {
        var fn = controller.ctrl.prototype[key];
        var params: string[] = getParameterNames(fn);

        return async (req: Request, res: Response, next?: Function) => {
            //构造参数
            //先计算default
            var ctx = {
                req: req,
                res: res
            };
            var callParams = await Promise.all(params.map(async param => {
                if (this.defaultInjects[param]) {
                    return await this.defaultInjects[param](ctx);
                }
                if (controller.config.inject && controller.config.inject[param]) {
                    return await controller.config.inject[param](ctx);
                }
                return undefined;
            }));
            // console.log(callParams);
            // return;
            await fn.apply(controller.ctrl.prototype, callParams);
            try {
                if (next) {
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

        console.log(this.controllers);
        this.controllers.forEach(controller => {
            var keys = Object.getOwnPropertyNames(controller.ctrl.prototype);
            keys.forEach(key => {
                app.get(controller.config.url.replace(":method", key), this.generateExpressFacotry(controller, key));
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
    Controller<T>(config : ControllerConfig){
        return function(target : Controller<T>){
            X.registerController(target,config);
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
    }
});