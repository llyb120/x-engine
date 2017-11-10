import { getParameterNames, GetAllParams } from './utils';
import { Express, Request, Response } from "express";
import { Controller, ControllerConfig, ControllerSet, InjectParams, ExpressConfig, HttpController, Connection, SocketController, ExpressContext, WebSocketContext } from './api';


import * as WebSocket from 'ws';
import { Server, IncomingMessage } from 'http';
import { WebsocketAdapter } from './driver/websocket';
import { ExpressAdapter } from './driver/express';
import * as http from 'http';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as vm from 'vm';


export class XEngine {
    // private app: Express;
    public defaultInjects: {
        [key: string]: {}
    } = {};
    public defaultAuths: {
        [key: string]: {}
    } = {};

    public controllers: ControllerSet<any>[] = [];

    public controllersMap: {
        [key: string]: {
            ctrl: Controller<any>,
            config: any,
            methodsParam: {
                [name: string]: any[]
            }
        }
    } = {};

    // private expressControllerBuffer : string[] = [];

    // private wss: WebSocket.Server;
    // private socket = "no";

    public expressAdapter: ExpressAdapter;
    public websocketAdapter: WebsocketAdapter;

    public server: Server;


    /**
     * 用来保存所有连接的用户
     */
    private webSocketUsers: WeakMap<WebSocket, any>;

    constructor() {
        this.defaultInjects[Connection.HTTP] = {};
        this.defaultInjects[Connection.WebSocket] = {};

        this.expressAdapter = new ExpressAdapter(this);
        this.server = http.createServer(this.expressAdapter.app);

    }



    protected startWebSocket() {


    }

    /**
     * 启动操作
     * @param app 
     */
    async startExpressServer(config: ExpressConfig) {
        // if (!config.app) {
        // throw new Error("没有传入express实例！");
        // }

        // this.expressAdapter = new ExpressAdapter(this);
        await this.expressAdapter.start(config);

        //websocket
        if (this.controllers.some(item => item.config.type == Connection.WebSocket)) {
            this.websocketAdapter = new WebsocketAdapter(this, config);
            this.websocketAdapter.start();
        }

        this.server.listen(config.port);
        // return this.expressAdapter.app;

    }



    registerController<T>(
        ctrl: Controller<T>,
        config: ControllerConfig
    ) {
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
        }

        //分发
        if (config.type === Connection.HTTP) {
            //如果存在这个，那么立刻注册
            // if(this.expressAdapter){

            //生成所有函数的参数表
            let fnNames = Object.getOwnPropertyNames(ctrl.prototype);
            for (const fnName of fnNames) {
                if (fnName === 'constructor' || fnName[0] === '_') {
                    continue;
                }
                let params = getParameterNames(ctrl.prototype[fnName]);
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

    registerAuthorization(from: Connection, authObj: any) {
        this.defaultAuths[from] = this.defaultAuths[from] || {};
        this.defaultAuths[from] = Object.assign(this.defaultInjects[from], authObj);
    }


    /**
     * 增加默认注入的元素
     */
    registerDefaultInject(from: Connection, params: InjectParams) {
        this.defaultInjects[from] = this.defaultInjects[from] || {};
        this.defaultInjects[from] = Object.assign(this.defaultInjects[from], params);
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


    // addHotUpdateController(fileName : string,controller : Function){
    //     let name = controller.name;
    //     fs.watchFile(fileName,() => {
    //         // this.controllersMap

    //     });
    // }

    private needToUpdate = new Set();
    private updateTimer: any;

    async addHotUpdateDir(dir: string) {
        dir = path.resolve(dir);

        let map: any = {};
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
            });;
        }

        let updateCode = (filePath: string) => {
            //缓存原来的代码，防止热更新失败
            let codeIndex = path.resolve(filePath);
            let temp = require.cache[codeIndex];
            console.log("开始热更新代码",filePath);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    return;
                }
                try {
                    let code = new vm.Script(data.toString());
                    delete require.cache[codeIndex];
                    require(filePath);
                    console.log("热更新成功！");
                } catch (e) {
                    console.log("热更新失败！编译代码出错");
                    require.cache[path.resolve(filePath)] = temp;
                }
            });
        };

        await loadAllFiles();

        let needToUpdate: any = {};
        let updateTimer: any = null;

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


export const V = new XEngine();



/**
 * 注册默认的变量
 */
V.registerDefaultInject(Connection.HTTP, {
    req(ctx: ExpressContext) {
        return ctx.req;
    },
    res(ctx: ExpressContext) {
        return ctx.res;
    },
    body(ctx: ExpressContext) {
        return ctx.req.body;
    },
    cookie(ctx: ExpressContext) {
        return ctx.req.cookies;
    },
    session(ctx: ExpressContext) {
        return (ctx.req as any).session;
    },
    query(ctx: ExpressContext) {
        return ctx.req.query;
    },
    params(ctx: ExpressContext) {
        return GetAllParams(ctx.req);
    }
});

V.registerDefaultInject(Connection.WebSocket, {
    req: ctx => ctx.req,
    ws: (ctx: WebSocketContext) => ctx.ws,
    message(ctx: WebSocketContext) {
        return ctx.message;
    },
    error(ctx: WebSocketContext) {
        return ctx.error;
    },
    wss: (ctx: WebSocketContext) => ctx.wss
})