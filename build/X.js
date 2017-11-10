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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9YLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTBEO0FBRTFELCtCQUFpTDtBQUtqTCxrREFBc0Q7QUFDdEQsOENBQWtEO0FBQ2xELDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFHekI7SUFxQ0k7UUFwQ0Esd0JBQXdCO1FBQ2pCLG1CQUFjLEdBRWpCLEVBQUUsQ0FBQztRQUNBLGlCQUFZLEdBRWYsRUFBRSxDQUFDO1FBRUEsZ0JBQVcsR0FBeUIsRUFBRSxDQUFDO1FBRXZDLG1CQUFjLEdBUWpCLEVBQUUsQ0FBQztRQW9JUCxtRUFBbUU7UUFDbkUsa0NBQWtDO1FBQ2xDLG9DQUFvQztRQUNwQyxpQ0FBaUM7UUFFakMsVUFBVTtRQUNWLElBQUk7UUFFSSxpQkFBWSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUF6SDdCLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUUvQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksd0JBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU3RCxDQUFDO0lBSVMsY0FBYztJQUd4QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQXFCO1FBQzFDLHFCQUFxQjtRQUNyQixxQ0FBcUM7UUFDckMsSUFBSTtRQUVKLGtEQUFrRDtRQUNsRCxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhDLFdBQVc7UUFDWCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksZ0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksNEJBQWdCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNsQyxDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLGtDQUFrQztJQUV0QyxDQUFDO0lBSUQsa0JBQWtCLENBQ2QsSUFBbUIsRUFDbkIsTUFBd0I7UUFFeEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUVyQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUNsQixJQUFJLEVBQUUsSUFBSTtZQUNWLE1BQU0sRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7U0FDekIsQ0FBQyxDQUFDO1FBRUgsS0FBSztRQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUc7WUFDeEIsSUFBSTtZQUNKLE1BQU0sRUFBRSxNQUFNLElBQUksRUFBRTtZQUNwQixZQUFZLEVBQUUsRUFBRTtTQUNuQixDQUFBO1FBRUQsSUFBSTtRQUNKLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssZ0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLGVBQWU7WUFDZiwyQkFBMkI7WUFFM0IsWUFBWTtZQUNaLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekQsR0FBRyxDQUFDLENBQUMsTUFBTSxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLGFBQWEsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDaEQsUUFBUSxDQUFDO2dCQUNiLENBQUM7Z0JBQ0QsSUFBSSxNQUFNLEdBQUcseUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDNUQsQ0FBQztZQUNELElBQUksQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFL0MsSUFBSTtZQUNKLG9CQUFvQjtZQUNwQixRQUFRO1lBQ1IsMkNBQTJDO1lBQzNDLElBQUk7UUFFUixDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUM7UUFFTixDQUFDO0lBRUwsQ0FBQztJQUVELHFCQUFxQixDQUFDLElBQWdCLEVBQUUsT0FBWTtRQUNoRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3hELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFHRDs7T0FFRztJQUNILHFCQUFxQixDQUFDLElBQWdCLEVBQUUsTUFBb0I7UUFDeEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1RCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsVUFBVSxDQUFJLE1BQXdCO1FBQ2xDLE1BQU0sQ0FBQyxVQUFVLE1BQXFCO1lBQ2xDLFNBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQWNELEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBVztRQUM3QixHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV4QixJQUFJLEdBQUcsR0FBUSxFQUFFLENBQUM7UUFDbEIsSUFBSSxZQUFZLEdBQUc7WUFDZixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtnQkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUs7b0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ04sTUFBTSxDQUFDO29CQUNYLENBQUM7b0JBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJO3dCQUNkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQzt3QkFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUNULE1BQU0sQ0FBQzt3QkFDWCxDQUFDO3dCQUNELEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ3pCLENBQUMsQ0FBQyxDQUFDO29CQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztZQUFBLENBQUM7UUFDUixDQUFDLENBQUE7UUFFRCxJQUFJLFVBQVUsR0FBRyxDQUFDLFFBQWdCO1lBQzlCLGlCQUFpQjtZQUNqQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSTtnQkFDNUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUM7Z0JBQ1gsQ0FBQztnQkFDRCxJQUFJLENBQUM7b0JBQ0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUMxQyxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2hDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUIsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDakQsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDO1FBRUYsTUFBTSxZQUFZLEVBQUUsQ0FBQztRQUVyQixJQUFJLFlBQVksR0FBUSxFQUFFLENBQUM7UUFDM0IsSUFBSSxXQUFXLEdBQVEsSUFBSSxDQUFDO1FBRTVCLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVE7WUFDbkQsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUUzQixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNkLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDMUIsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN2QixDQUFDO1lBQ0QsV0FBVyxHQUFHLFVBQVUsQ0FBQztnQkFDckIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekMsTUFBTSxDQUFDO2dCQUNYLENBQUM7Z0JBQ0QsMkNBQTJDO2dCQUMzQyxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUM5QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2IsUUFBUSxDQUFDO29CQUNiLENBQUM7b0JBQ0QsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixDQUFDO2dCQUVELE9BQU87Z0JBQ1AsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUNoQixPQUFPO29CQUNQLFlBQVksR0FBRyxFQUFFLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxDQUFDO1lBRVAsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBRUo7QUEvT0QsMEJBK09DO0FBR1ksUUFBQSxDQUFDLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUkvQjs7R0FFRztBQUNILFNBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBVSxDQUFDLElBQUksRUFBRTtJQUNyQyxHQUFHLENBQUMsR0FBbUI7UUFDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUNELEdBQUcsQ0FBQyxHQUFtQjtRQUNuQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBQ0QsSUFBSSxDQUFDLEdBQW1CO1FBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztJQUN4QixDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQW1CO1FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBQ0QsT0FBTyxDQUFDLEdBQW1CO1FBQ3ZCLE1BQU0sQ0FBRSxHQUFHLENBQUMsR0FBVyxDQUFDLE9BQU8sQ0FBQztJQUNwQyxDQUFDO0lBQ0QsS0FBSyxDQUFDLEdBQW1CO1FBQ3JCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN6QixDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQW1CO1FBQ3RCLE1BQU0sQ0FBQyxvQkFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDO0NBQ0osQ0FBQyxDQUFDO0FBRUgsU0FBQyxDQUFDLHFCQUFxQixDQUFDLGdCQUFVLENBQUMsU0FBUyxFQUFFO0lBQzFDLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUc7SUFDbkIsRUFBRSxFQUFFLENBQUMsR0FBcUIsS0FBSyxHQUFHLENBQUMsRUFBRTtJQUNyQyxPQUFPLENBQUMsR0FBcUI7UUFDekIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7SUFDdkIsQ0FBQztJQUNELEtBQUssQ0FBQyxHQUFxQjtRQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBQ0QsR0FBRyxFQUFFLENBQUMsR0FBcUIsS0FBSyxHQUFHLENBQUMsR0FBRztDQUMxQyxDQUFDLENBQUEifQ==