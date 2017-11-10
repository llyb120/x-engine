import { V as X } from "../../X";
import { Request, Response, Express } from 'express';
import * as express from "express";
import * as path from "path";
import * as WebSocket from "ws"
import * as http from "http"

import * as nunjucks from "nunjucks";
import { Connection, Controller, ExpressContext } from '../../api';

import * as should from "should";
import * as supertest from "supertest";
import fetch from "node-fetch";


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
export class ctrl1 {


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
            guichu: 1233214
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

console.log("i'm load  3!4")