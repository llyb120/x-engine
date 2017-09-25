import { Response, Express } from 'express';
import { Request } from 'express';
import { Server, IncomingMessage } from 'http';
import * as WebSocket from 'ws';

export enum Connection{
    WebSocket = 'websocket',
    SocketIO = 'socket.io',
    HTTP = 'http'
}

export type SocketController = {
    type : Connection;
    //必须提供
    url? : string;
    inject? : any;
    authorization? : string[];
}

export interface HttpController {
    type : Connection;
    url : string;
    allowMethod? : ('get' | 'post')[];
    inject? : any;
    render? : string;
    dataType? : "html" | "json";
    // type? : "html" | "json",
    authorization? : string[]
}

export type ControllerConfig = SocketController | HttpController;

export type Controller<T> = new() => T;


export interface ControllerSet<T>{
    ctrl: Controller<T>,
    config: ControllerConfig
}

// type InjectParams = {
// }
export interface ExpressContext{
    req : Request,
    res : Response
}

export interface WebSocketContext{
    req : IncomingMessage;
    ws : WebSocket;
    message : any;
    error : Error;
    wss : WebSocket.Server
}

export interface InjectParams{
    [key : string] : (ctx : ExpressContext | WebSocketContext) => any
}


export interface XEngineConfig{
    app? : any;
    server? : Server;
    socket? : Connection[];
}

export interface ExpressConfig extends XEngineConfig{
    app : Express,
    crossDomain? : boolean;
}
