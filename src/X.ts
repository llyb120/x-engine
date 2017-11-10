import { getParameterNames, GetAllParams } from './utils';
import { Express, Request, Response } from "express";
import { Controller, ControllerConfig, ControllerSet, InjectParams, ExpressConfig, HttpController, Connection, SocketController, ExpressContext, WebSocketContext } from './api';


import * as WebSocket from 'ws';
import { Server, IncomingMessage } from 'http';
import { WebsocketAdapter } from './driver/websocket';
import { ExpressAdapter } from './driver/express';
import * as http from 'http';


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
                [name : string] : any[]
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
            for(const fnName of fnNames){
                if(fnName === 'constructor' || fnName[0] === '_'){
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