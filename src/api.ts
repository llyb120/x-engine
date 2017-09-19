import { Response, Express } from 'express';
import { Request } from 'express';
export interface ControllerConfig{
    url : string;
    allowMethod? : ('get' | 'post')[];
    inject? : any;
    render? : string;
    type? : "html" | "json",
    authorization? : string[]
}

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

export interface InjectParams{
    [key : string] : (ctx : ExpressContext) => any
}


export interface ExpressConfig{
    app : Express,
    
}
