"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const api_1 = require("../api");
const base_1 = require("./base");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const utils_1 = require("../utils");
class ExpressAdapter extends base_1.BaseAdapter {
    constructor(context, config) {
        super();
        this.context = context;
        this.config = config;
        this.isStarted = false;
    }
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
                keys.forEach(key => {
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
            var allparams = utils_1.GetAllParams(req);
            var callParams = yield Promise.all(params.map((param) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (param in this.context.defaultInjects[api_1.Connection.HTTP]) {
                    return yield this.context.defaultInjects[api_1.Connection.HTTP][param](ctx);
                }
                if (config.inject && config.inject[param]) {
                    return yield config.inject[param](ctx);
                }
                if (allparams[param]) {
                    return allparams[param];
                }
                return undefined;
            })));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kcml2ZXIvZXhwcmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxnQ0FBa0Y7QUFFbEYsaUNBQXFDO0FBRXJDLDBDQUEwQztBQUMxQyw4Q0FBOEM7QUFDOUMsb0NBQTJEO0FBSTNELG9CQUE0QixTQUFRLGtCQUFXO0lBTTNDLFlBQ1csT0FBaUIsRUFDakIsTUFBc0I7UUFFN0IsS0FBSyxFQUFFLENBQUM7UUFIRCxZQUFPLEdBQVAsT0FBTyxDQUFVO1FBQ2pCLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBTHpCLGNBQVMsR0FBRyxLQUFLLENBQUM7SUFRMUIsQ0FBQztJQUVELEtBQUs7UUFDRCxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUEsQ0FBQztZQUNmLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNyQyxDQUFDO1FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUV2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7Z0JBQ2pDLEdBQUcsQ0FBQyxNQUFNLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQy9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsOEJBQThCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztn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