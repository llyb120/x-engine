import { V as X } from "../X";
import { Request, Response } from "express";
import * as express from "express";
import * as path from "path";
import * as WebSocket from "ws"
import * as http from "http"

import * as nunjucks from "nunjucks";
import { Connection } from '../api';

const TEMPLATE = path.resolve(__dirname, '../view');

@X.Controller({
    type: Connection.HTTP,
    url: "/test/:method.html",
    inject: {
        fuck() {
            return 1;
        }
    },
    render: TEMPLATE + '/:method.html',
    //dataType : "json";
})
class ctrl1 {
    test1(req: Request, res: Response, fuck: string, query : any, body : any, c: string) {
        console.log(query, body, c);
        return {
            guichu: 123321
        }
        // res.redirect("http://www.baidu.com")
    }

    test2(res: Response) {

    }


}




@X.Controller({
    type: Connection.WebSocket,
    url : "/liaoyang"
})
class GameController {

    onConnect(){
        console.log("oh i'm coming");
    }

    onMessage(){
        
    }


}


var app = express();

var env = nunjucks.configure(TEMPLATE, {
    autoescape: true,
    express: app,
    noCache: true
});


// console.log('server is listing on 800');
// X.registerController(ctrl1,);

describe('test', () => {
    /**
     * 启动框架
     */
    it("should boot success", (done) => {
        try {
            const server = http.createServer(app);

            X.startExpressServer({
                app: app,
                server: server,
                crossDomain : true
            });
         
            server.listen(8080);

            done();

        } catch (e) {
            should.not.exist(e);
        }
    });



});
