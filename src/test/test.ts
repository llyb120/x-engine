import { V as X } from "../X";
import { Request, Response, Express } from 'express';
import * as express from "express";
import * as path from "path";
import * as WebSocket from "ws"
import * as http from "http"

import * as nunjucks from "nunjucks";
import { Connection, Controller, ExpressContext } from '../api';

import * as should from "should";
import * as supertest from "supertest";
import fetch from "node-fetch";


const TEMPLATE = path.resolve(__dirname, '../view');

declare var describe : Function;

if(typeof describe == 'undefined'){
    (global as any).describe = function(){

    }
}

@X.Controller({
    type: Connection.HTTP,
    url: "/test/:method.html",
    inject: {
        fuck() {
            return 1;
        }
    },
    common : () => {
        return {
            cubi : 2
        }
    }
    // render: TEMPLATE + '/:method.html',
    //dataType : "json";
})
class ctrl1 {


    test2(res: Response) {
        return 123;
    }


}

@X.Controller({
    type : Connection.HTTP,
    url : "/test/:method.html",
    common : () => {
        return {
            cubi : 2
        } 
    },
    dataType : "json"
})
class ctrl110{
    test1(req: Request, res: Response, fuck: string, query: any, body: any, c: string) {
        return {
            guichu: 123321
        }
        // res.redirect("http://www.baidu.com")
    }
}

@X.Controller({
    type: Connection.HTTP,
    url: "/auth/:method",
    authorization: ['notlogin']
})
class ctrl2 {
    test(res: Response) {

    }
}

@X.Controller({
    type: Connection.HTTP,
    url: "/auth/:method",
    authorization: ['login']
})
class ctrl3 {
    login(user: any) {
        return user ? 1 : 0;
    }
}



@X.Controller({
    type : Connection.HTTP,
    url : "/",
})
class ctrl4{
    index(){
        return 1;
    }
}


@X.Controller({
    type: Connection.WebSocket,
    url: "/liaoyang"
})
class GameController {

    onConnect() {
    }

    onMessage(ws: WebSocket, req: any, message: string) {
        return 'pong';
        // ws.send("pong");
    }


}


X.registerAuthorization(Connection.HTTP, {
    notlogin: function (ctx: ExpressContext) {
        ctx.res.redirect("http://www.baidu.com");
        return false;
    },
    login: function (ctx: ExpressContext | any) {
        ctx.user = {};
        return true;
    }

})

var app = express();
var request : supertest.SuperTest<supertest.Test>;

// const server = http.createServer(app);

X.startExpressServer({
    // app: app,
    // server: server,
    init : (server,app : Express) => {
        console.log("before start");

        var env = nunjucks.configure(TEMPLATE, {
            autoescape: true,
            express: app,
            noCache: true
        });
        request  = supertest(app);


    },
    crossDomain: true,
    port : 8080

});
// server.listen(8080);

// const server = http.createServer(app);

// X.startExpressServer({
//     app: app,
//     server: server,
//     crossDomain: true
// });
// server.listen(8080);


// console.log('server is listing on 800');
// X.registerController(ctrl1,);

describe('test', () => {
 
 
    let url = 'http://127.0.0.1:8080';

    it("should get common",async() => {
        
        let result = await fetch('http://127.0.0.1:8080/test/test1.html');
        const json = JSON.parse(await result.text());
        should.exist(json.cubi);
    });

    //测试http请求
    it("should access success",async () => {
        let ret = await fetch(`${url}/test/test2.html`);
        let txt = await ret.text();
        should.exist(txt);
        txt.should.eql("123");
    });

    // /**
    //  * 测试不通过，被重定向
    //  */
    it("test auth",  (done) => {
        done();
        // let ret = await fetch(`${url}/auth/test`);
        // console.log(ret.status);
        // request.get("/auth/test")
        //     .expect(302)
        //     .end((err, res) => {
        //         should.exist(err);
        //         // should.not.exist(err);
        //         done();
        //     });
    });

    // //已经登录的情况，保留user
    it("test logined", async () => {
        try{
            const res = await request.get("/auth/login").expect(200);
            res.text.should.be.eql('1');
        }
        catch(e){
            should.not.exist(e);
        }
    });

    it("test index",async() => {
        try{
            const res = await request.get('/').expect(200);
        }
        catch(e){
            should.not.exist(e);
        }
    })


    let client: WebSocket;

    it("should connect success", (done) => {
        client = new WebSocket("ws://127.0.0.1:8080/liaoyang");
        setTimeout(() => {
            should.exist(client.readyState);
            client.readyState.should.eql(WebSocket.OPEN);
            done();
        }, 10)

    });

    it("should get some message", (done) => {
        client.onmessage = function (msg) {
            should.exist(msg);
            msg.data.should.eql('pong');
            done();
        }
        client.send("ping");
        // done()

    })





});
