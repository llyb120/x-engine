import { getParameterNames, GetAllParams } from './utils';
import { Express, Request, Response } from "express";
import { Controller, ControllerConfig, ControllerSet, InjectParams, ExpressConfig, HttpController, Connection, SocketController, ExpressContext, WebSocketContext } from './api';


import * as WebSocket from 'ws';
import { Server, IncomingMessage } from 'http';
import { WebsocketAdapter } from './driver/websocket';
import { ExpressAdapter } from './driver/express';


export class XEngine {
    // private app: Express;
    public defaultInjects: {
        [key: string]: {}
    } = {};
    public defaultAuths : {
        [key : string] : {}
    } = {};

    public controllers: ControllerSet<any>[] = [];
    // private wss: WebSocket.Server;
    // private socket = "no";

    public expressAdapter: ExpressAdapter;
    public websocketAdapter: WebsocketAdapter;


    /**
     * 用来保存所有连接的用户
     */
    private webSocketUsers: WeakMap<WebSocket, any>;

    constructor() {
        this.defaultInjects[Connection.HTTP] = {};
        this.defaultInjects[Connection.WebSocket] = {};
    }

    



    protected startWebSocket() {
        

    }

    /**
     * 启动操作
     * @param app 
     */
    startExpressServer(config: ExpressConfig) {
        if (!config.app) {
            throw new Error("没有传入express实例！");
        }

        this.expressAdapter = new ExpressAdapter(this, config);
        this.expressAdapter.start();

        //websocket
        if(this.controllers.some(item => item.config.type == Connection.WebSocket)){
            this.websocketAdapter = new WebsocketAdapter(this, config);
            this.websocketAdapter.start();
        }

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

    registerAuthorization(from : Connection, authObj : any){
        this.defaultAuths[from] = this.defaultAuths[from] || {};
        this.defaultAuths[from] = Object.assign(this.defaultInjects[from],authObj);
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
    }
})