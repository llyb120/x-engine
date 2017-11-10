"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../api");
const base_1 = require("./base");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const utils_1 = require("../utils");
const express = require("express");
class ExpressAdapter extends base_1.BaseAdapter {
    constructor(context) {
        super(context);
        this.context = context;
        this.isStarted = false;
        this.urlMap = {};
        this.buffer = [];
        this.app = express();
    }
    async start(globalConfig) {
        if (this.isStarted) {
            return;
        }
        this.config = globalConfig;
        this.isStarted = true;
        // if (this.config.server) {
        // this.server = this.config.server;
        // }
        const app = this.app;
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
        app.use(cookieParser());
        if (this.config.init) {
            await this.config.init(this.context.server, app);
        }
        if (this.buffer.length) {
            for (const [url, fn] of this.buffer) {
                app.all.call(app, url, fn);
            }
        }
        if (!!1) {
            return;
        }
        // var set = new Set();
        // this.context.controllers.forEach(controller => {
        //     if (controller.config.type == Connection.HTTP) {
        //         var keys = Object.getOwnPropertyNames(controller.ctrl.prototype);
        //         const config = controller.config as HttpController;
        //         // console.log(keys)
        //         keys.forEach(key => {
        //             //构造器没法调用
        //             if (key == 'constructor') {
        //                 return;
        //             }
        //             //私有方法禁止访问
        //             if (key[0] == '_') return;
        //             var args = [config.url.replace(":method", key), this.generateExpressFacotry(controller, key)]
        //             //如果存在allowMethod
        //             if (config.allowMethod) {
        //                 config.allowMethod.forEach(method => {
        //                     switch (method) {
        //                         case 'get':
        //                             app.get.apply(app, args);
        //                             break;
        //                         case 'post':
        //                             app.post.apply(app, args);
        //                             break;
        //                     }
        //                 })
        //             }
        //             else {
        //                 app.all.apply(app, args);
        //             }
        //         });
        //     }
        // })
    }
    onControllerRegister(name) {
        // this.urlMap[name] = this.urlMap[name] || [];
        // let controller = this.context.controllersMap[name].ctrl;
        let url = this.context.controllersMap[name].config.url;
        if (this.urlMap[url]) {
            this.urlMap[url].push(name);
            return;
        }
        this.urlMap[url] = [name];
        let callback = async (req, res, next) => {
            //查找是否有该方法
            let method = req.params.method;
            if (!method) {
                method = 'index';
            }
            for (const controllerName of this.urlMap[url]) {
                if (!this.context.controllersMap[controllerName]) {
                    continue;
                }
                let { ctrl, config, methodsParam } = this.context.controllersMap[controllerName];
                //查找是否存在这个方法
                if (!ctrl.prototype[method]) {
                    continue;
                }
                let params = methodsParam[method] || [];
                var ctx = {
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
                        else if (this.context.defaultAuths[api_1.Connection.HTTP]
                            && this.context.defaultAuths[api_1.Connection.HTTP][auth]) {
                            canContinue = await (this.context.defaultAuths[api_1.Connection.HTTP][auth](ctx));
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
                        let _ret = await common.call(ctrl.prototype, ctx);
                        if (_ret) {
                            commons = Object.assign(commons, _ret);
                        }
                    }
                }
                var allparams = utils_1.GetAllParams(req);
                var callParams = await Promise.all(params.map(async (param) => {
                    //ctx的优先级最高
                    if (param in ctx) {
                        return ctx[param];
                    }
                    //检测默认的绑定
                    if (param in this.context.defaultInjects[api_1.Connection.HTTP]) {
                        return await this.context.defaultInjects[api_1.Connection.HTTP][param](ctx);
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
                    var result = await ctrl.prototype[method].apply(ctrl.prototype, callParams);
                    if (Object.keys(commons).length) {
                        if (!result) {
                            result = commons;
                        }
                        else if (typeof result == 'object') {
                            result = Object.assign(commons, result);
                        }
                    }
                    if (!res.headersSent) {
                        var render;
                        if (render = config.render) {
                            res.render(render.replace(":method", method), result);
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
            }
            return next ? next : undefined;
            // if()
        };
        if (this.isStarted) {
            this.app.all(url, callback);
        }
        else {
            this.buffer.push([url, callback]);
        }
        // this.app.all(url, );
        // console.log(name, url);
    }
}
exports.ExpressAdapter = ExpressAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kcml2ZXIvZXhwcmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGdDQUE4RjtBQUU5RixpQ0FBcUM7QUFFckMsMENBQTBDO0FBQzFDLDhDQUE4QztBQUM5QyxvQ0FBMkQ7QUFFM0QsbUNBQW1DO0FBR25DLG9CQUE0QixTQUFRLGtCQUFXO0lBVTNDLFlBQ1csT0FBZ0I7UUFHdkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBSFIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQVJuQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLFdBQU0sR0FFVixFQUFFLENBQUM7UUFFQyxXQUFNLEdBQXlCLEVBQUUsQ0FBQztRQU90QyxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQTJCO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztRQUUzQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0Qiw0QkFBNEI7UUFDNUIsb0NBQW9DO1FBQ3BDLElBQUk7UUFFSixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMxQixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtnQkFDakMsR0FBRyxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDL0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxrQkFB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