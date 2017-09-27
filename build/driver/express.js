"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const api_1 = require("../api");
const base_1 = require("./base");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const utils_1 = require("../utils");
class ExpressAdapter extends base_1.BaseAdapter {
    constructor() {
        super(...arguments);
        this.isStarted = false;
    }
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
        app.use(cookieParser());
        var set = new Set();
        this.context.controllers.forEach(controller => {
            if (controller.config.type == api_1.Connection.HTTP) {
                var keys = Object.getOwnPropertyNames(controller.ctrl.prototype);
                const config = controller.config;
                // console.log(keys)
                keys.forEach(key => {
                    //构造器没法调用
                    if (key == 'constructor') {
                        return;
                    }
                    //私有方法禁止访问
                    if (key[0] == '_')
                        return;
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
            }
        });
    }
    generateExpressFacotry(controller, key) {
        var fn = controller.ctrl.prototype[key];
        var params = utils_1.getParameterNames(fn);
        let config = controller.config;
        return (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            //构造参数
            //先计算default
            var ctx = {
                req: req,
                res: res
            };
            //存在授权
            if (config.authorization) {
                let canContinue = true;
                for (const auth of Object.values(config.authorization)) {
                    if (this.context.defaultAuths[api_1.Connection.HTTP]
                        && this.context.defaultAuths[api_1.Connection.HTTP][auth]) {
                        canContinue = yield (this.context.defaultAuths[api_1.Connection.HTTP][auth](ctx));
                        if (!canContinue) {
                            break;
                        }
                    }
                }
                if (!canContinue) {
                    return;
                }
            }
            var allparams = utils_1.GetAllParams(req);
            var callParams = yield Promise.all(params.map((param) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                //ctx的优先级最高
                if (param in ctx) {
                    return ctx[param];
                }
                //检测默认的绑定
                if (param in this.context.defaultInjects[api_1.Connection.HTTP]) {
                    return yield this.context.defaultInjects[api_1.Connection.HTTP][param](ctx);
                }
                //控制器中自定义的绑定
                if (config.inject && config.inject[param]) {
                    return yield config.inject[param](ctx);
                }
                //余下的绑定
                if (allparams[param]) {
                    return allparams[param];
                }
                return undefined;
            })));
            var result = yield fn.apply(controller.ctrl.prototype, callParams);
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
                else if (result) {
                    res.send(result + "");
                }
                else if (next) {
                    next();
                }
                // res.end();
            }
            catch (e) {
                console.log(e, "这个错误不影响运行，请不要担心");
            }
        });
    }
}
exports.ExpressAdapter = ExpressAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kcml2ZXIvZXhwcmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxnQ0FBa0Y7QUFFbEYsaUNBQXFDO0FBRXJDLDBDQUEwQztBQUMxQyw4Q0FBOEM7QUFDOUMsb0NBQTJEO0FBSTNELG9CQUE0QixTQUFRLGtCQUFXO0lBQS9DOztRQUdZLGNBQVMsR0FBRyxLQUFLLENBQUM7SUEySjlCLENBQUM7SUF4SkcsZUFBZTtJQUNmLGdDQUFnQztJQUNoQyxvQ0FBb0M7SUFDcEMsS0FBSztJQUNMLGVBQWU7SUFDZixJQUFJO0lBRUosS0FBSztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNyQyxDQUFDO1FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUV2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7Z0JBQ2pDLEdBQUcsQ0FBQyxNQUFNLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQy9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsOEJBQThCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDL0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyw4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