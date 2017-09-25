import { XEngine } from '../X';
import { ExpressConfig, ControllerSet, Connection, SocketController } from '../api';
import { BaseAdapter } from './base';
import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { getParameterNames } from '../utils';

export class WebsocketAdapter extends BaseAdapter {
    public wss: WebSocket.Server;
    private socketControllers: ControllerSet<any>[] = [];
    private isStarted = false;

    // constructor(
    //     public context : XEngine,
    //     //以后追加koa
    //     public config : ExpressConfig,

    // ){
    //     super();

    // }

    /**
     * 收集需要的控制器
     */
    collectControllers() {
        this.context.controllers.forEach(controller => {
            if (controller.config.type === Connection.WebSocket) {
                this.socketControllers.push(controller);
            }
        });
    }

    start() {
        if (this.isStarted) {
            return false;
        }
        this.isStarted = true;
        this.collectControllers();

        const wss = this.wss = new WebSocket.Server({ server: this.config.server });
        const factoryMap = new WeakMap<Function, Function>();
        //事件分发
        const each = (functionName: string, ws: WebSocket, req: IncomingMessage, message?: any, error?: Error) => {
            this.socketControllers.forEach(async controller => {
                const config = controller.config as SocketController;
                //如果没有，则分发
                if (!config.url || (req && req.url == config.url)) {
                    if (functionName in controller.ctrl.prototype) {
                        const fn = controller.ctrl.prototype[functionName];
                        var factory;
                        //生成适配器
                        if (!(factory = factoryMap.get(fn))) {
                            factory = this.generateWebSocketFactory(controller.ctrl.prototype, functionName);
                            factoryMap.set(fn, factory);
                        }
                        const result = await factory.call(this, config, ws, req, message);
                        // const factory = factoryMap.get(fn) || this.generateWebSocketFactory(fn);
                        if (result) {
                            try {
                                if (typeof result == 'object') {
                                    ws.send(JSON.stringify(result));
                                }
                                else {
                                    ws.send(result);
                                }
                            }
                            catch (e) {

                            }
                        }
                        // controller.ctrl.prototype[functionName].call(controller.ctrl.prototype,ws,req,message);
                    }
                }
            });
        }
        // this.webSocketUsers = new WeakMap;

        // const heartbeat = function () {
        //     this.isAlive = true;
        // }

        wss.on('connection', (ws, req) => {
            each('onConnect', ws, req);

            //断线保护
            ws.on("pong", () => {
                (ws as any).isAlive = false;
            });

            ws.on('message', (message) => {
                each('onMessage', ws, req, message);
                // console.log('received: %s', message);
            });

            ws.on("error", (error) => {
                each('onError', ws, req, undefined, error);
            });

            //劫持API
            const fn = ws.terminate;
            ws.terminate = () => {
                fn.call(ws);
                each("onClose", ws, req);
            }

        });

        /**
         * 后面接入消息处理机制
         */
        wss.on("error", () => {
            console.log("oh shit web socket error");
        });


        //增加防断线机制
        const interval = setInterval(function () {
            wss.clients.forEach(function (ws) {
                if ((ws as any).isAlive === false) return ws.terminate();

                (ws as any).isAlive = false;
                ws.ping('', false, true);
            });
        }, 30000);
    }


    private generateWebSocketFactory(prototype: Object, key: string) {
        var fn = (prototype as any)[key] as Function;
        var params: string[] = getParameterNames(fn);
        // let config = controller.config as SocketController;

        return async (config: SocketController, ws: WebSocket, req: any, message: any) => {
            const ctx = {
                req: req,
                ws: ws,
                message: message,
                wss: this.wss
            };
            // var allparams = GetAllParams(req);
            var callParams = params.length ? await Promise.all(params.map(async param => {
                if (param in this.context.defaultInjects[Connection.WebSocket]) {
                    return await (this.context.defaultInjects[Connection.WebSocket] as any)[param](ctx);
                }
                if (config.inject && config.inject[param]) {
                    return await config.inject[param](ctx);
                }
                return undefined;
            })) : [];
            return await fn.apply(prototype, callParams);
        }
    }

}