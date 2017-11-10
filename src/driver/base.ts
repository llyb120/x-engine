import { XEngine } from "../X";
import { ExpressConfig, Controller, ControllerConfig } from '../api';

export abstract class BaseAdapter {
    constructor(
        public context : XEngine,
        //以后追加koa
        public config? : ExpressConfig,
    ){
        
    }


    onControllerRegister(name :string,url : string){
        
    }
}