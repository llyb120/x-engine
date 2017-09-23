import { BaseAdapter } from "./base";
import { ControllerSet, Connection } from "../api";

class SocketIOAdapter extends BaseAdapter {

    private isStarted = false;
    private socketControllers: ControllerSet<any>[] = [];
    
    collectControllers(){
        this.context.controllers.forEach(controller => {
            if(controller.config.type === Connection.SocketIO){
                this.socketControllers.push(controller);
            }
        });
    }
    start(){
        if(this.isStarted){
            return;
        }
        this.isStarted = true;
        this.collectControllers();

    }
}