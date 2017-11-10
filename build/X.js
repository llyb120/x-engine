"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const api_1 = require("./api");
const websocket_1 = require("./driver/websocket");
const express_1 = require("./driver/express");
const http = require("http");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const vm = require("vm");
class XEngine {
    constructor() {
        // private app: Express;
        this.defaultInjects = {};
        this.defaultAuths = {};
        this.controllers = [];
        this.controllersMap = {};
        // addHotUpdateController(fileName : string,controller : Function){
        //     let name = controller.name;
        //     fs.watchFile(fileName,() => {
        //         // this.controllersMap
        //     });
        // }
        this.needToUpdate = new Set();
        this.defaultInjects[api_1.Connection.HTTP] = {};
        this.defaultInjects[api_1.Connection.WebSocket] = {};
        this.expressAdapter = new express_1.ExpressAdapter(this);
        this.server = http.createServer(this.expressAdapter.app);
    }
    startWebSocket() {
    }
    /**
     * 启动操作
     * @param app
     */
    async startExpressServer(config) {
        // if (!config.app) {
        // throw new Error("没有传入express实例！");
        // }
        // this.expressAdapter = new ExpressAdapter(this);
        await this.expressAdapter.start(config);
        //websocket
        if (this.controllers.some(item => item.config.type == api_1.Connection.WebSocket)) {
            this.websocketAdapter = new websocket_1.WebsocketAdapter(this, config);
            this.websocketAdapter.start();
        }
        this.server.listen(config.port);
        // return this.expressAdapter.app;
    }
    registerController(ctrl, config) {
        var name = ctrl.name;
        this.controllers.push({
            ctrl: ctrl,
            config: (config || {})
        });
        //dev
        this.controllersMap[name] = {
            ctrl,
            config: config || {},
            methodsParam: {}
        };
        //分发
        if (config.type === api_1.Connection.HTTP) {
            //如果存在这个，那么立刻注册
            // if(this.expressAdapter){
            //生成所有函数的参数表
            let fnNames = Object.getOwnPropertyNames(ctrl.prototype);
            for (const fnName of fnNames) {
                if (fnName === 'constructor' || fnName[0] === '_') {
                    continue;
                }
                let params = utils_1.getParameterNames(ctrl.prototype[fnName]);
                this.controllersMap[name].methodsParam[fnName] = params;
            }
            this.expressAdapter.onControllerRegister(name);
            console.log("register controller,", name);
            // }
            //否则，等start开始的时候重新注册
            // else{
            // this.expressControllerBuffer.push(name);
            // }
        }
        else {
        }
    }
    registerAuthorization(from, authObj) {
        this.defaultAuths[from] = this.defaultAuths[from] || {};
        this.defaultAuths[from] = Object.assign(this.defaultInjects[from], authObj);
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
    async addHotUpdateDir(dir) {
        dir = path.resolve(dir);
        let map = {};
        let loadAllFiles = () => {
            return new Promise((resolve, reject) => {
                glob(path.resolve(dir, '*'), (err, files) => {
                    if (err) {
                        return;
                    }
                    files.forEach(file => {
                        let match = file.match(/([^\/]+\.(?:js|ts))$/);
                        if (!match) {
                            return;
                        }
                        map[match[1]] = file;
                    });
                    resolve('ok');
                });
            });
            ;
        };
        let updateCode = (filePath) => {
            //缓存原来的代码，防止热更新失败
            let codeIndex = path.resolve(filePath);
            let temp = require.cache[codeIndex];
            console.log("开始热更新代码", filePath);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    return;
                }
                try {
                    let code = new vm.Script(data.toString());
                    delete require.cache[codeIndex];
                    require(filePath);
                    console.log("热更新成功！");
                }
                catch (e) {
                    console.log("热更新失败！编译代码出错");
                    require.cache[path.resolve(filePath)] = temp;
                }
            });
        };
        await loadAllFiles();
        let needToUpdate = {};
        let updateTimer = null;
        fs.watch(dir, { recursive: true }, (eventType, fileName) => {
            needToUpdate[fileName] = 1;
            if (updateTimer) {
                clearTimeout(updateTimer);
                updateTimer = null;
            }
            updateTimer = setTimeout(() => {
                if (Object.keys(needToUpdate).length === 0) {
                    return;
                }
                // console.log('hot upadte', needToUpdate);
                for (const file in needToUpdate) {
                    if (!map[file]) {
                        continue;
                    }
                    updateCode(map[file]);
                }
                //更新此目录
                loadAllFiles().then(() => {
                    //清空加载器
                    needToUpdate = {};
                });
            }, 50);
        });
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
    },
    params(ctx) {
        return utils_1.GetAllParams(ctx.req);
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
    },
    wss: (ctx) => ctx.wss
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9YLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTBEO0FBRTFELCtCQUFpTDtBQUtqTCxrREFBc0Q7QUFDdEQsOENBQWtEO0FBQ2xELDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFHekI7SUFxQ0k7UUFwQ0Esd0JBQXdCO1FBQ2pCLG1CQUFjLEdBRWpCLEVBQUUsQ0FBQztRQUNBLGlCQUFZLEdBRWYsRUFBRSxDQUFDO1FBRUEsZ0JBQVcsR0FBeUIsRUFBRSxDQUFDO1FBRXZDLG1CQUFjLEdBUWpCLEVBQUUsQ0FBQztRQXVJUCxtRUFBbUU7UUFDbkUsa0NBQWtDO1FBQ2xDLG9DQUFvQztRQUNwQyxpQ0FBaUM7UUFFakMsVUFBVTtRQUNWLElBQUk7UUFFSSxpQkFBWSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUE1SDdCLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUUvQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksd0JBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU3RCxDQUFDO0lBTVMsY0FBYztJQUd4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQXFCO1FBQzFDLHFCQUFxQjtRQUNyQixxQ0FBcUM7UUFDckMsSUFBSTtRQUVKLGtEQUFrRDtRQUNsRCxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FB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